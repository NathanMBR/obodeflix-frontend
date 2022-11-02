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

export class User implements User {
    constructor(
        public readonly id: number,

        public readonly name: string,
        public readonly email: string,
        public readonly type: UserTypes,

        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly deletedAt: Date | null
    ) { }
}