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

export type EpisodeOrderColumn = "id" | "name" | "position" | "updatedAt";