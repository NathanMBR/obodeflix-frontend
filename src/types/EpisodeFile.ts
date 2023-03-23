export interface EpisodeFile {
    readonly filename: string;
    readonly path: string;
    readonly duration: number;
};

export class EpisodeFileBuilder implements EpisodeFile {
    public readonly filename: EpisodeFile["filename"];
    public readonly path: EpisodeFile["path"];
    public readonly duration: EpisodeFile["duration"];

    constructor(
        episodeFileData: EpisodeFile
    ) {
        this.filename = episodeFileData.filename;
        this.path = episodeFileData.path;
        this.duration = episodeFileData.duration;
    }
};