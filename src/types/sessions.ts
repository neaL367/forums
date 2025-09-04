export type UserSession = {
    id: string;
    userId: string;
    token: string;
    createdAt: string;
    expiresAt: string;
    userAgent?: string;
}