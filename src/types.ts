// /types.ts
export interface Player {
  id: string;
  uid?: string;
  name: string;
  totalBuyIn: number;
  finalCash: number | null;
}

export interface Debt {
  from: string;
  to: string;
  amount: number;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  players: Player[];
  debts: Debt[];
}
