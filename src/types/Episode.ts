export type EpisodeOrderColumn = "id" | "name" | "position" | "updatedAt";

export interface Episode {
    readonly id: number

    readonly name: string
    readonly seasonId: number
    readonly duration: number
    readonly path: string
    readonly position: number

    readonly createdAt: Date
    readonly updatedAt: Date
    readonly deletedAt: Date | null
}

export class EpisodeBuilder implements Episode {
    public readonly id: Episode["id"]

    public readonly name: Episode["name"]
    public readonly seasonId: Episode["seasonId"]
    public readonly duration: Episode["duration"]
    public readonly path: Episode["path"]
    public readonly position: Episode["position"]

    public readonly createdAt: Episode["createdAt"]
    public readonly updatedAt: Episode["updatedAt"]
    public readonly deletedAt: Episode["deletedAt"]

    constructor(
        private readonly episodeData: Episode
    ) {
        this.id = episodeData.id
        this.name = episodeData.name
        this.seasonId = episodeData.seasonId
        this.duration = episodeData.duration
        this.path = episodeData.path
        this.position = episodeData.position
        this.createdAt = episodeData.createdAt
        this.updatedAt = episodeData.updatedAt
        this.deletedAt = episodeData.deletedAt
    }
}