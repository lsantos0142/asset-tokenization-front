import { Ownership } from "./Ownership";

export type Collateral = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    bankWallet: string;
    percentage: number;
    expirationDate: string;
    status: number;
    ownership: Ownership;
};
