
/**
 * SUPABASE SCHEMA & SETUP GUIDE
 * -----------------------------
 * 
 * 1. Create Table `guest_flags`
 * 
 * create table public.guest_flags (
 *   id uuid default gen_random_uuid() primary key,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   name text not null,
 *   message text,
 *   color_idx integer default 0, -- 0: Blue, 1: White, 2: Red, 3: Green, 4: Yellow
 *   position_index integer generated always as identity
 * );
 * 
 * 2. Enable Realtime
 * - Go to Database -> Replication
 * - Enable replication for `guest_flags`
 * 
 * 3. Policies (RLS)
 * - Enable RLS
 * - Policy "Enable read access for all users": SELECT using (true)
 * - Policy "Enable insert access for all users": INSERT using (true)
 */

import { createClient } from '@supabase/supabase-js';

// MOCK DATA for Demo purposes
export interface GuestFlag {
  id: string;
  name: string;
  message: string;
  colorIdx: number; // 0-4 based on Tibetan elements
}

const MOCK_NAMES = ["Aarav", "Sarah", "Priya", "John", "Nima", "Grace", "Pasang", "David"];
const MESSAGES = ["Namaste!", "So excited!", "Annapurna forever", "Cant wait", "Love from UK", "Yum!"];

export const subscribeToFlags = (callback: (flag: GuestFlag) => void) => {
  // In production: 
  // supabase.channel('custom-insert-channel')
  //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guest_flags' }, (payload) => callback(payload.new))
  //   .subscribe()

  // Mock Realtime Simulation
  const interval = setInterval(() => {
    if (Math.random() > 0.7) {
      callback({
        id: Math.random().toString(),
        name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
        message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
        colorIdx: Math.floor(Math.random() * 5)
      });
    }
  }, 3000); // New flag every few seconds

  return () => clearInterval(interval);
};

export const getInitialFlags = async (): Promise<GuestFlag[]> => {
  // Mock initial fetch
  return Array.from({ length: 12 }).map((_, i) => ({
    id: i.toString(),
    name: MOCK_NAMES[i % MOCK_NAMES.length],
    message: "Blessings",
    colorIdx: i % 5
  }));
};
