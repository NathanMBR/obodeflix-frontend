export type SeriesNameLanguages = "ENGLISH" | "JAPANESE";

export interface Series {
    readonly id: number;

    readonly mainName: string;
    readonly alternativeName: string | null;
    readonly mainNameLanguage: SeriesNameLanguages;
    readonly description: string | null;
    readonly imageAddress: string | null;

    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}

export class SeriesBuilder implements Series {
    public readonly id: Series["id"];

    public readonly mainName: Series["mainName"];
    public readonly alternativeName: Series["alternativeName"];
    public readonly mainNameLanguage: Series["mainNameLanguage"];
    public readonly description: Series["description"];
    public readonly imageAddress: Series["imageAddress"];

    public readonly createdAt: Series["createdAt"];
    public readonly updatedAt: Series["updatedAt"];
    public readonly deletedAt: Series["deletedAt"];

    constructor(
        private readonly seriesData: Series
    ) {
        this.id = seriesData.id;
        this.mainName = seriesData.mainName;
        this.alternativeName = seriesData.alternativeName;
        this.mainNameLanguage = seriesData.mainNameLanguage;
        this.description = seriesData.description;
        this.imageAddress = seriesData.imageAddress;
        this.createdAt = seriesData.createdAt;
        this.updatedAt = seriesData.updatedAt;
        this.deletedAt = seriesData.deletedAt;
    }
}