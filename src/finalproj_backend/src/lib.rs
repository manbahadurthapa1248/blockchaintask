use num_traits::ToPrimitive;
use ic_cdk::api::{caller, time, management_canister::main::raw_rand};
use ic_cdk::{call, init, post_upgrade, pre_upgrade, query, update};
use candid::{CandidType, Deserialize, Principal, Nat};
use serde::{Serialize, Deserialize as SerdeDeserialize};
use std::collections::HashMap;

// 1. CONSTANTS ========================================================
const ICP_LEDGER_CANISTER_ID: &str = "ryjl3-tyaaa-aaaaa-aaaba-cai"; // Mainnet
const MINIMUM_CYCLES: u128 = 1_000_000_000_000; // 1T cycles
const MAX_EVENT_NAME_LENGTH: usize = 100;

// 2. TYPES ===========================================================
#[derive(CandidType, Serialize, SerdeDeserialize, Clone, Debug)]
pub struct TicketMetadata {
    pub event_id: String,
    pub seat: Option<String>,
    pub tier: Option<String>,
    pub image_url: Option<String>,
}

#[derive(CandidType, Serialize, SerdeDeserialize, Clone, Debug)]
pub struct Ticket {
    pub id: Nat,
    pub owner: Principal,
    pub metadata: TicketMetadata,
    pub original_price: Nat,
    pub transfer_history: Vec<(u64, Principal)>,
}

#[derive(CandidType, Deserialize)]
pub struct TransferArgs {
    pub to: Principal,
    pub amount: Nat,
    pub fee: Nat,
    pub memo: Vec<u8>,
    pub from_subaccount: Option<Vec<u8>>,
    pub created_at_time: Option<u64>,
}

// ✅ CORRECTED TransferError to match ICP Ledger's Candid
#[derive(CandidType, Deserialize, Debug)]
pub enum TransferError {
    BadFee { expected_fee: Nat },
    InsufficientFunds { balance: Nat },
    TxTooOld { allowed_window_nanos: Nat },
    TxDuplicate { duplicate_of: Nat },
    TxCreatedInFuture,
    Other { error_message: String }, // Catch-all variant
}

// ✅ Using Result directly which implements ArgumentDecoder
type IcpTransferResult = (Result<Nat, TransferError>,);

#[derive(CandidType, Serialize, SerdeDeserialize, Clone, Debug)]
pub struct Event {
    pub id: String,
    pub name: String,
    pub date: u64,
    pub location: String,
    pub organizer: Principal,
    pub ticket_price: Nat,
    pub max_resale_multiplier: Option<f64>,
    pub total_tickets: Nat,
    pub tickets_sold: Nat,
    pub funds_collected: Nat,
    pub whitelist: Option<Vec<Principal>>,
}

// 3. STATE MANAGEMENT ================================================
thread_local! {
    static TICKETS: std::cell::RefCell<HashMap<Nat, Ticket>> = std::cell::RefCell::new(HashMap::new());
    static EVENTS: std::cell::RefCell<HashMap<String, Event>> = std::cell::RefCell::new(HashMap::new());
}

// 4. INITIALIZATION ==================================================
#[init]
fn init() {
    if ic_cdk::api::canister_balance128() < MINIMUM_CYCLES {
        ic_cdk::trap("Insufficient cycles - please top up canister");
    }
}

// 5. EVENT MANAGEMENT ================================================
#[update]
async fn create_event(
    name: String,
    date: u64,
    location: String,
    ticket_price: Nat,
    total_tickets: Nat,
    max_resale_multiplier: Option<f64>,
    whitelist: Option<Vec<Principal>>,
) -> Result<String, String> {
    if name.is_empty() || name.len() > MAX_EVENT_NAME_LENGTH {
        return Err(format!(
            "Event name must be 1-{} characters", 
            MAX_EVENT_NAME_LENGTH
        ));
    }
    if date <= time() {
        return Err("Event date must be in the future".to_string());
    }
    if total_tickets == Nat::from(0u64){
        return Err("Must have at least 1 ticket".to_string());
    }

    let organizer = caller();
    let rand_bytes = raw_rand()
        .await
        .map_err(|e| format!("RNG failed: {:?}", e))?;
    let event_id = hex::encode(&rand_bytes.0[..16]);

    let event = Event {
        id: event_id.clone(),
        name,
        date,
        location,
        organizer,
        ticket_price,
        max_resale_multiplier,
        total_tickets,
        tickets_sold: 0u64.into(),
        funds_collected: 0u64.into(),
        whitelist,
    };

    EVENTS.with(|e| e.borrow_mut().insert(event_id.clone(), event));
    ic_cdk::print(format!(
    "Event {} created by {}",
    event_id, organizer
    ));

    Ok(event_id)
}

// 6. TICKET OPERATIONS ==============================================
#[update]
async fn purchase_ticket(event_id: String) -> Result<Nat, String> {
    let buyer = caller();
    let now = time();

    let (organizer, ticket_price, _total, sold) = EVENTS.with(|e| {
        let e = e.borrow();
        let event = e.get(&event_id).ok_or("Event not found")?;

        if let Some(wl) = &event.whitelist {
            if !wl.contains(&buyer) {
                return Err("Not on whitelist".to_string());
            }
        }
        if event.tickets_sold >= event.total_tickets {
            return Err("Sold out".to_string());
        }

        Ok((
            event.organizer,
            event.ticket_price.clone(),
            event.total_tickets.clone(),
            event.tickets_sold.clone(),
        ))
    })?;

    // Process payment using correct type
    let transfer_args = TransferArgs {
        to: organizer,
        amount: ticket_price.clone(),
        fee: 10_000u64.into(),
        memo: event_id.as_bytes().to_vec(),
        from_subaccount: None,
        created_at_time: Some(now),
    };

    let (transfer_result,): IcpTransferResult = call(
        Principal::from_text(ICP_LEDGER_CANISTER_ID).unwrap(),
        "transfer",
        (transfer_args,),
    )
    .await
    .map_err(|e| format!("ICP transfer failed: {:?}", e))?;

    match transfer_result {
        Ok(block_height) => {
            ic_cdk::print(format!("Payment succeeded at block {}", block_height));
        }
        Err(e) => return Err(match e {
            TransferError::BadFee { expected_fee } => 
                format!("Bad fee. Expected: {}", expected_fee),
            TransferError::InsufficientFunds { balance } => 
                format!("Insufficient funds. Balance: {}", balance),
            TransferError::TxTooOld { allowed_window_nanos } => 
                format!("Transaction too old. Window: {} nanos", allowed_window_nanos),
            TransferError::TxDuplicate { duplicate_of } => 
                format!("Duplicate transaction. Original: {}", duplicate_of),
            TransferError::TxCreatedInFuture => 
                "Transaction created in future".to_string(),
            TransferError::Other { error_message } => 
                error_message,
        }),
    }

    // Generate ticket
    let ticket_id = sold + 1u64;
    let metadata = TicketMetadata {
        event_id: event_id.clone(),
        seat: None,
        tier: None,
        image_url: None,
    };

    let ticket = Ticket {
        id: ticket_id.clone(),
        owner: buyer,
        metadata,
        original_price: ticket_price.clone(),
        transfer_history: vec![(now, buyer)],
    };

    // Update state
    TICKETS.with(|t| t.borrow_mut().insert(ticket_id.clone(), ticket));
    EVENTS.with(|e| {
        let mut e = e.borrow_mut();
        if let Some(event) = e.get_mut(&event_id) {
            event.tickets_sold += 1u64;
            event.funds_collected += ticket_price;
        }
    });
    ic_cdk::print(format!(
    "Ticket {} purchased by {} for event {}",
    ticket_id, buyer, event_id
    ));

    Ok(ticket_id)
}

#[update]
async fn transfer_ticket(
    ticket_id: Nat,
    new_owner: Principal,
    sale_price: Option<Nat>,
) -> Result<(), String> {
    let sender = caller();
    let now = time();

    let (event_id, original_price) = TICKETS.with(|t| {
        let t = t.borrow();
        let ticket = t.get(&ticket_id).ok_or("Ticket not found")?;
        if ticket.owner != sender {
            return Err("Not ticket owner".to_string());
        }
        Ok((ticket.metadata.event_id.clone(), ticket.original_price.clone()))
    })?;

    let max_multiplier = EVENTS.with(|e| {
    e.borrow()
        .get(&event_id)
        .map(|e| e.max_resale_multiplier)
}).ok_or("Event not found")?;


   if let Some(price) = sale_price {
    if let Some(multiplier) = max_multiplier {
        let base: f64 = original_price.clone().0.to_u64().unwrap() as f64;
        let max_price_f64 = base * multiplier;
        let max_price = Nat::from(max_price_f64.round() as u64);

        if price > max_price {
            return Err(format!(
                "Price exceeds maximum resale price of {} ICP",
                max_price
            ));
        }
    }

        let transfer_args = TransferArgs {
            to: sender,
            amount: price,
            fee: 10_000u64.into(),
            memo: format!("resale-{}", ticket_id).as_bytes().to_vec(),
            from_subaccount: None,
            created_at_time: Some(now),
        };

        let (transfer_result,):IcpTransferResult = call(
            Principal::from_text(ICP_LEDGER_CANISTER_ID).unwrap(),
            "transfer",
            (transfer_args,),
        )
        .await
        .map_err(|e| format!("ICP transfer failed: {:?}", e))?;

        if let Err(e) = transfer_result {
            return Err(format!("ICP transfer error: {:?}", e));
        }
    }

    TICKETS.with(|t| {
        let mut t = t.borrow_mut();
        if let Some(ticket) = t.get_mut(&ticket_id) {
            ticket.owner = new_owner;
            ticket.transfer_history.push((now, new_owner));
        }
    });
    ic_cdk::print(format!(
        "Ticket {} transferred from {} to {}",
        ticket_id, sender, new_owner
    ));
    Ok(())
}

// 7. FINANCIAL OPERATIONS =============================================
#[update]
async fn withdraw_funds(event_id: String, amount: Nat) -> Result<(), String> {
    let who = caller();
    let now = time();

    let available = EVENTS.with(|e| {
        let e = e.borrow();
        let ev = e.get(&event_id).ok_or("Event not found")?;
        if ev.organizer != who {
            return Err("Only organizer can withdraw".to_string());
        }
        Ok(ev.funds_collected.clone())
    })?;

    if amount > available {
        return Err("Insufficient funds".to_string());
    }

    let transfer_args = TransferArgs {
        to: who,
        amount: amount.clone(),
        fee: 10_000u64.into(),
        memo: format!("withdraw-{}", event_id).as_bytes().to_vec(),
        from_subaccount: None,
        created_at_time: Some(now),
    };

    let (transfer_result,):IcpTransferResult = call(
        Principal::from_text(ICP_LEDGER_CANISTER_ID).unwrap(),
        "transfer",
        (transfer_args,),
    )
    .await
    .map_err(|e| format!("ICP transfer failed: {:?}", e))?;

    if let Err(e) = transfer_result {
        return Err(format!("ICP transfer error: {:?}", e));
    }

    EVENTS.with(|e| {
        let mut e = e.borrow_mut();
        if let Some(ev) = e.get_mut(&event_id) {
            ev.funds_collected -= amount.clone();
        }
    });
    ic_cdk::print(format!(
    "Organizer {} withdrew {} ICP from event {}",
    who, amount, event_id
    ));


    Ok(())
}

// 9. ICRC-7 NFT ======================================================
#[query]
fn icrc7_metadata(ticket_id: Nat) -> Result<TicketMetadata, String> {
    TICKETS.with(|t| {
        t.borrow()
            .get(&ticket_id)
            .map(|t| t.metadata.clone())
            .ok_or("Ticket not found".to_string())
    })
}

#[query]
fn icrc7_owner_of(ticket_id: Nat) -> Result<Principal, String> {
    TICKETS.with(|t| {
        t.borrow()
            .get(&ticket_id)
            .map(|t| t.owner)
            .ok_or("Ticket not found".to_string())
    })
}

#[query]
fn icrc7_transfer_history(ticket_id: Nat) -> Result<Vec<(u64, Principal)>, String> {
    TICKETS.with(|t| {
        t.borrow()
            .get(&ticket_id)
            .map(|t| t.transfer_history.clone())
            .ok_or("Ticket not found".to_string())
    })
}

// 10. UPGRADE ========================================================
#[pre_upgrade]
fn pre_upgrade() {
    let events = EVENTS.with(|e| e.borrow().clone());
    let tickets = TICKETS.with(|t| t.borrow().clone());
    ic_cdk::storage::stable_save((events, tickets)).expect("Failed to save state");
}

#[post_upgrade]
fn post_upgrade() {
    let (events, tickets): (HashMap<String, Event>, HashMap<Nat, Ticket>) =
        ic_cdk::storage::stable_restore().expect("Failed to restore state");
    EVENTS.with(|e| *e.borrow_mut() = events);
    TICKETS.with(|t| *t.borrow_mut() = tickets);
}

// 11. QUERIES ========================================================
#[query]
fn get_event(event_id: String) -> Result<Event, String> {
    EVENTS.with(|e| {
        e.borrow()
            .get(&event_id)
            .cloned()
            .ok_or("Event not found".to_string())
    })
}

#[query]
fn get_ticket(ticket_id: Nat) -> Result<Ticket, String> {
    TICKETS.with(|t| {
        t.borrow()
            .get(&ticket_id)
            .cloned()
            .ok_or("Ticket not found".to_string())
    })
}

#[query]
fn get_events_by_organizer(organizer: Principal) -> Vec<Event> {
    EVENTS.with(|e| {
        e.borrow()
            .values()
            .filter(|ev| ev.organizer == organizer)
            .cloned()
            .collect()
    })
}

#[query]
fn get_tickets_by_owner(owner: Principal) -> Vec<Ticket> {
    TICKETS.with(|t| {
        t.borrow()
            .values()
            .filter(|t| t.owner == owner)
            .cloned()
            .collect()
    })
}