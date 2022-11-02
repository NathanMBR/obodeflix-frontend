export type UserTypes = "COMMON" | "ADMIN";

export interface User {
    readonly id: number;

    readonly name: string;
    readonly email: string;
    readonly type: UserTypes;

    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}