export type TrackTypes = "SUBTITLE" | "AUDIO"

export interface Track {
  readonly id: number

  readonly title: string
  readonly type: TrackTypes
  readonly index: number
  readonly seasonId: number

  readonly createdAt: Date
  readonly updatedAt: Date
  readonly deletedAt: Date | null
}

export class TrackBuilder implements Track {
  public readonly id: Track["id"]

  public readonly title: Track["title"]
  public readonly type: Track["type"]
  public readonly index: Track["index"]
  public readonly seasonId: Track["seasonId"]

  public readonly createdAt: Track["createdAt"]
  public readonly updatedAt: Track["updatedAt"]
  public readonly deletedAt: Track["deletedAt"]

  constructor(trackData: Track) {
    this.id = trackData.id

    this.title = trackData.title
    this.type = trackData.type
    this.index = trackData.index
    this.seasonId = trackData.seasonId

    this.createdAt = trackData.createdAt
    this.updatedAt = trackData.updatedAt
    this.deletedAt = trackData.deletedAt
  }
}
