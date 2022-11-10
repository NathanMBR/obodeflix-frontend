export type TagOrderColumn = "id" | "name" | "updatedAt";

export interface Tag {
    readonly id: number;

    readonly name: string;

    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}

export class TagBuilder implements Tag {
    public readonly id: Tag["id"];

    public readonly name: Tag["name"];

    public readonly createdAt: Tag["createdAt"];
    public readonly updatedAt: Tag["updatedAt"];
    public readonly deletedAt: Tag["deletedAt"];

    constructor(
        private readonly tagData: Tag
    ) {
        this.id = tagData.id;
        this.name = tagData.name;
        this.createdAt = tagData.createdAt;
        this.updatedAt = tagData.updatedAt;
        this.deletedAt = tagData.deletedAt;
    }
}