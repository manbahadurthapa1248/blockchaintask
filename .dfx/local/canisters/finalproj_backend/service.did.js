export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'create_event' : IDL.Func(
        [
          IDL.Text,
          IDL.Nat64,
          IDL.Text,
          IDL.Nat,
          IDL.Nat,
          IDL.Opt(IDL.Float64),
          IDL.Opt(IDL.Vec(IDL.Principal)),
        ],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'get_event' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Text,
              'organizer' : IDL.Principal,
              'whitelist' : IDL.Opt(IDL.Vec(IDL.Principal)),
              'date' : IDL.Nat64,
              'name' : IDL.Text,
              'ticket_price' : IDL.Nat,
              'tickets_sold' : IDL.Nat,
              'total_tickets' : IDL.Nat,
              'funds_collected' : IDL.Nat,
              'location' : IDL.Text,
              'max_resale_multiplier' : IDL.Opt(IDL.Float64),
            }),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'get_events_by_organizer' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'organizer' : IDL.Principal,
              'whitelist' : IDL.Opt(IDL.Vec(IDL.Principal)),
              'date' : IDL.Nat64,
              'name' : IDL.Text,
              'ticket_price' : IDL.Nat,
              'tickets_sold' : IDL.Nat,
              'total_tickets' : IDL.Nat,
              'funds_collected' : IDL.Nat,
              'location' : IDL.Text,
              'max_resale_multiplier' : IDL.Opt(IDL.Float64),
            })
          ),
        ],
        ['query'],
      ),
    'get_ticket' : IDL.Func(
        [IDL.Nat],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Nat,
              'owner' : IDL.Principal,
              'metadata' : IDL.Record({
                'image_url' : IDL.Opt(IDL.Text),
                'seat' : IDL.Opt(IDL.Text),
                'tier' : IDL.Opt(IDL.Text),
                'event_id' : IDL.Text,
              }),
              'transfer_history' : IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Principal)),
              'original_price' : IDL.Nat,
            }),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'get_tickets_by_owner' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Nat,
              'owner' : IDL.Principal,
              'metadata' : IDL.Record({
                'image_url' : IDL.Opt(IDL.Text),
                'seat' : IDL.Opt(IDL.Text),
                'tier' : IDL.Opt(IDL.Text),
                'event_id' : IDL.Text,
              }),
              'transfer_history' : IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Principal)),
              'original_price' : IDL.Nat,
            })
          ),
        ],
        ['query'],
      ),
    'icrc7_metadata' : IDL.Func(
        [IDL.Nat],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'image_url' : IDL.Opt(IDL.Text),
              'seat' : IDL.Opt(IDL.Text),
              'tier' : IDL.Opt(IDL.Text),
              'event_id' : IDL.Text,
            }),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'icrc7_owner_of' : IDL.Func(
        [IDL.Nat],
        [IDL.Variant({ 'Ok' : IDL.Principal, 'Err' : IDL.Text })],
        ['query'],
      ),
    'icrc7_transfer_history' : IDL.Func(
        [IDL.Nat],
        [
          IDL.Variant({
            'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Principal)),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'purchase_ticket' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : IDL.Text })],
        [],
      ),
    'transfer_ticket' : IDL.Func(
        [IDL.Nat, IDL.Principal, IDL.Opt(IDL.Nat)],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'withdraw_funds' : IDL.Func(
        [IDL.Text, IDL.Nat],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
