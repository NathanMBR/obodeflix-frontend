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

export class UserBuilder implements User {
    public readonly id: User["id"];

    public readonly name: User["name"];
    public readonly email: User["email"];
    public readonly type: User["type"];

    public readonly createdAt: User["createdAt"];
    public readonly updatedAt: User["updatedAt"];
    public readonly deletedAt: User["deletedAt"];

    constructor(
        private readonly userData: User
    ) {
        this.id = userData.id;
        this.name = userData.name;
        this.email = userData.email;
        this.type = userData.type;
        this.createdAt = userData.createdAt;
        this.updatedAt = userData.updatedAt;
        this.deletedAt = userData.deletedAt;
    }
}