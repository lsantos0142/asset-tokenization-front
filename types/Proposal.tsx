import { User } from "./User";

export type Proposal = {
    id: string;
    createdAt: string;
    updatedAt: string;
    address: string;
    registration: number;
    deed?: string;
    usableArea: number;
    status: number;
    user?: User;
};
