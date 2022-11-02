import { Ownership } from "./Ownership";

export type Offer = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    percentage: number;
    amount: number;
    isEffectiveTransfer: boolean;
    status: number;
    ownership: Ownership;
};
