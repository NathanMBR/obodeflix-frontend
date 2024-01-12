export type RawTrackTypes = "VIDEO" | "AUDIO" | "SUBTITLE";

export interface RawTrack {
  title: string
  type: RawTrackTypes
  index: number
}
