export type UserTypes = "COMMON" | "ADMIN";

export interface User {
    id: number;

    name: string;
    email: string;
    type: UserTypes;

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}