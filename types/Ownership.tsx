import { TokenizedAsset } from "./TokenizedAsset";
import { User } from "./User";

export type Ownership = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    isEffectiveOwner: boolean;
    percentageOwned: number;
    tokenizedAsset: TokenizedAsset;
    user: User;
};
