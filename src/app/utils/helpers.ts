import { Roommate } from "../components/RoommateList";

export const splitBillEvenly = (
  totalBill: number,
  numPeople: number,
  roommates: Roommate[]
): Roommate[] => {
  const amountPerPerson = totalBill / numPeople;
  return roommates.map((roommate) => ({
    ...roommate,
    amountDue: amountPerPerson,
  }));
};