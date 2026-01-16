export type AccessKind = 'TRIAL' | 'SUBSCRIPTION' | 'EXPIRED';

export type AccessInfo = {
    kind: AccessKind;
    endsAt: string | null;
    daysLeft: number;
    trialEndsAt?: string;
    subscriptionEndsAt?: string | null;
};

export type SubscriptionStatusResponse = {
    access: AccessInfo;
    subscriptionPlan: 'MONTHLY' | null;
};
