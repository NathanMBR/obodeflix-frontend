import { Series } from "./Series"
import { Track } from "./Track"

export const SeasonTypesEnum = {
  TV: "Série de TV",
  MOVIE: "Filme",
  OTHER: "Outro"
}
export type SeasonTypes = keyof typeof SeasonTypesEnum

export type SeasonOrderColumn = "id" | "name" | "position" | "updatedAt"

export interface Season {
  readonly id: number

  readonly name: string
  readonly description: string | null
  readonly type: SeasonTypes
  readonly position: number
  readonly seriesId: Series["id"]
  readonly imageAddress: string | null
  readonly excludeFromMostRecent: boolean

  readonly createdAt: Date
  readonly updatedAt: Date
  readonly deletedAt: Date | null

  readonly series: Series
  readonly tracks: Array<Track>
}

export class SeasonBuilder implements Season {
  public readonly id: Season["id"]

  public readonly name: Season["name"]
  public readonly description: Season["description"]
  public readonly type: Season["type"]
  public readonly position: Season["position"]
  public readonly seriesId: Season["seriesId"]
  public readonly imageAddress: Season["imageAddress"]
  public readonly excludeFromMostRecent: Season["excludeFromMostRecent"]

  public readonly createdAt: Season["createdAt"]
  public readonly updatedAt: Season["updatedAt"]
  public readonly deletedAt: Season["deletedAt"]

  public readonly series: Series
  public readonly tracks: Array<Track>

  constructor(
    seasonData: Season
  ) {
    this.id = seasonData.id

    this.name = seasonData.name
    this.description = seasonData.description
    this.type = seasonData.type
    this.position = seasonData.position
    this.seriesId = seasonData.seriesId
    this.imageAddress = seasonData.imageAddress
    this.excludeFromMostRecent = seasonData.excludeFromMostRecent

    this.createdAt = seasonData.createdAt
    this.updatedAt = seasonData.updatedAt
    this.deletedAt = seasonData.deletedAt

    this.series = seasonData.series
    this.tracks = seasonData.tracks
  }
}
