export type User = {
    id: string;
    name: string;
    cpf: string;
    username: string;
    password: string;
    walletAddress: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    hashedRt: string;
};
