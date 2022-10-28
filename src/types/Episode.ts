export interface Episode {
    id: number
    name: string
    seasonId: number
    duration: number
    path: string
    position: number
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}

export type EpisodeOrderColumn = "id" | "name" | "position" | "updatedAt";