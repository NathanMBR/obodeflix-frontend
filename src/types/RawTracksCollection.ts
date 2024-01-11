export interface RawTrack {
  index: number
  title: string
}

export type RawTracksCollection = Record<"video" | "audio" | "subtitle", RawTrack>

export class RawTracksCollectionBuilder {
  public readonly video: RawTracksCollection["video"]
  public readonly audio: RawTracksCollection["audio"]
  public readonly subtitle: RawTracksCollection["subtitle"]

  constructor({ video, audio, subtitle }: RawTracksCollection) {
    this.video = video
    this.audio = audio
    this.subtitle = subtitle
  }
}
