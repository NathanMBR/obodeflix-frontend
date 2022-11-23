import { Series } from "../types";

export type SeasonTypes = "TV" | "MOVIE" | "OTHER";

export type SeasonOrderColumn = "id" | "name" | "updatedAt";

export interface Season {
    readonly id: number;

    readonly name: string;
    readonly type: SeasonTypes;
    readonly position: number;
    readonly seriesId: Series["id"];

    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
};

export class SeasonBuilder implements Season {
    public readonly id: Season["id"];

    public readonly name: Season["name"];
    public readonly type: Season["type"];
    public readonly position: Season["position"];
    public readonly seriesId: Season["seriesId"];

    public readonly createdAt: Season["createdAt"];
    public readonly updatedAt: Season["updatedAt"];
    public readonly deletedAt: Season["deletedAt"];

    constructor(
        seasonData: Season
    ) {
        this.id = seasonData.id;

        this.name = seasonData.name;
        this.type = seasonData.type;
        this.position = seasonData.position;
        this.seriesId = seasonData.seriesId;

        this.createdAt = seasonData.createdAt;
        this.updatedAt = seasonData.updatedAt;
        this.deletedAt = seasonData.deletedAt;
    }
}