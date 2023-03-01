import { Series } from "../types";

export const SeasonTypesEnum = {
    TV: "Série de TV",
    MOVIE: "Filme",
    OTHER: "Outro"
};
export type SeasonTypes = keyof typeof SeasonTypesEnum;

export type SeasonOrderColumn = "id" | "name" | "updatedAt";

export interface Season {
    readonly id: number;

    readonly name: string;
    readonly type: SeasonTypes;
    readonly position: number;
    readonly seriesId: Series["id"];
    readonly imageAddress: string | null;

    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;

    readonly series: Series;
};

export class SeasonBuilder implements Season {
    public readonly id: Season["id"];

    public readonly name: Season["name"];
    public readonly type: Season["type"];
    public readonly position: Season["position"];
    public readonly seriesId: Season["seriesId"];
    public readonly imageAddress: string | null;

    public readonly createdAt: Season["createdAt"];
    public readonly updatedAt: Season["updatedAt"];
    public readonly deletedAt: Season["deletedAt"];

    public readonly series: Series;

    constructor(
        seasonData: Season
    ) {
        this.id = seasonData.id;

        this.name = seasonData.name;
        this.type = seasonData.type;
        this.position = seasonData.position;
        this.seriesId = seasonData.seriesId;
        this.imageAddress = seasonData.imageAddress;

        this.createdAt = seasonData.createdAt;
        this.updatedAt = seasonData.updatedAt;
        this.deletedAt = seasonData.deletedAt;

        this.series = seasonData.series;
    }
}