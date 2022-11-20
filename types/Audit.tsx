interface IAuditOwner {
    name: string;
    username: string;
    cpf: string;
    walletAddress: string;
    isAdmin: boolean;
}

interface IAuditRentPayment {
    amount: number;
    shares: number;
    paymentDate: Date;
}

interface IAuditCollateral {
    bankId: string;
    collateralShares: number;
    expirationDate: Date;
}

export interface IAuditResponse {
    owner: IAuditOwner;
    shares: number;
    isEffectiveOwner: boolean;
    rentPayments: IAuditRentPayment[];
    collaterals: IAuditCollateral[];
}
