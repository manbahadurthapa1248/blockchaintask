import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// Your deployed backend canister ID
const CANISTER_ID = 'ajuq4-ruaaa-aaaaa-qaaga-cai';
const INTERNET_IDENTITY_CANISTER_ID = 'ahw5u-keaaa-aaaaa-qaaha-cai';

// Create actor function
const createActor = (canisterId: string, options?: { agentOptions?: any }) => {
  const agent = new HttpAgent({
    host: 'http://127.0.0.1:4943',
    ...options?.agentOptions,
  });

  // Fetch root key for local development
  agent.fetchRootKey().catch(err => {
    console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
    console.error(err);
  });

  return Actor.createActor(
    ({ IDL }) => {
      const Event = IDL.Record({
        id: IDL.Text,
        name: IDL.Text,
        date: IDL.Nat64,
        location: IDL.Text,
        organizer: IDL.Principal,
        ticket_price: IDL.Nat,
        max_resale_multiplier: IDL.Opt(IDL.Float64),
        total_tickets: IDL.Nat,
        tickets_sold: IDL.Nat,
        funds_collected: IDL.Nat,
        whitelist: IDL.Opt(IDL.Vec(IDL.Principal)),
      });

      const TicketMetadata = IDL.Record({
        event_id: IDL.Text,
        seat: IDL.Opt(IDL.Text),
        tier: IDL.Opt(IDL.Text),
        image_url: IDL.Opt(IDL.Text),
      });

      const Ticket = IDL.Record({
        id: IDL.Nat,
        owner: IDL.Principal,
        metadata: TicketMetadata,
        original_price: IDL.Nat,
        transfer_history: IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Principal)),
      });

      return IDL.Service({
        create_event: IDL.Func(
          [IDL.Text, IDL.Nat64, IDL.Text, IDL.Nat, IDL.Nat, IDL.Opt(IDL.Float64), IDL.Opt(IDL.Vec(IDL.Principal))],
          [IDL.Variant({ Ok: IDL.Text, Err: IDL.Text })],
          []
        ),
        purchase_ticket: IDL.Func([IDL.Text], [IDL.Variant({ Ok: IDL.Nat, Err: IDL.Text })], []),
        transfer_ticket: IDL.Func(
          [IDL.Nat, IDL.Principal, IDL.Opt(IDL.Nat)],
          [IDL.Variant({ Ok: IDL.Null, Err: IDL.Text })],
          []
        ),
        withdraw_funds: IDL.Func(
          [IDL.Text, IDL.Nat],
          [IDL.Variant({ Ok: IDL.Null, Err: IDL.Text })],
          []
        ),
        get_event: IDL.Func([IDL.Text], [IDL.Variant({ Ok: Event, Err: IDL.Text })], ['query']),
        get_ticket: IDL.Func([IDL.Nat], [IDL.Variant({ Ok: Ticket, Err: IDL.Text })], ['query']),
        get_events_by_organizer: IDL.Func([IDL.Principal], [IDL.Vec(Event)], ['query']),
        get_tickets_by_owner: IDL.Func([IDL.Principal], [IDL.Vec(Ticket)], ['query']),
        icrc7_metadata: IDL.Func([IDL.Nat], [IDL.Variant({ Ok: TicketMetadata, Err: IDL.Text })], ['query']),
        icrc7_owner_of: IDL.Func([IDL.Nat], [IDL.Variant({ Ok: IDL.Principal, Err: IDL.Text })], ['query']),
        icrc7_transfer_history: IDL.Func(
          [IDL.Nat],
          [IDL.Variant({ Ok: IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Principal)), Err: IDL.Text })],
          ['query']
        ),
      });
    },
    {
      agent,
      canisterId,
    }
  );
};

interface AuthContextType {
  isAuthenticated: boolean;
  principal: Principal | null;
  authClient: AuthClient | null;
  backendActor: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  principal: null,
  authClient: null,
  backendActor: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [backendActor, setBackendActor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const client = await AuthClient.create();
      setAuthClient(client);

      // Always create an actor for public queries
      const actor = createActor(CANISTER_ID);
      setBackendActor(actor);

      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        
        setIsAuthenticated(true);
        setPrincipal(principal);
        
        // Create authenticated actor
        const authenticatedActor = createActor(CANISTER_ID, {
          agentOptions: {
            identity,
          },
        });
        setBackendActor(authenticatedActor);
      }
      
      setError(null);
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setError(error instanceof Error ? error.message : 'Authentication initialization failed');
      
      // Still try to create an anonymous actor for public queries
      try {
        const actor = createActor(CANISTER_ID);
        setBackendActor(actor);
      } catch (actorError) {
        console.error('Failed to create anonymous actor:', actorError);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    if (!authClient) {
      setError('Auth client not initialized');
      return;
    }

    try {
      setError(null);
      await authClient.login({
        identityProvider: `http://127.0.0.1:4943/?canisterId=${INTERNET_IDENTITY_CANISTER_ID}`,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal();
          
          setIsAuthenticated(true);
          setPrincipal(principal);
          
          // Create authenticated actor
          const actor = createActor(CANISTER_ID, {
            agentOptions: {
              identity,
            },
          });
          setBackendActor(actor);
          setError(null);
        },
        onError: (error) => {
          console.error('Login error:', error);
          setError('Login failed. Please try again.');
        },
      });
    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
      
      // Create anonymous actor
      const actor = createActor(CANISTER_ID);
      setBackendActor(actor);
      setError(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setError(error instanceof Error ? error.message : 'Logout failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        principal,
        authClient,
        backendActor,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};