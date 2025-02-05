// /types.ts
export interface Player {
    id: number;
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
    id: number;
    name: string;
    date: string;
    players: Player[];
    debts: Debt[];
  }