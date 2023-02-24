import { SeasonTypes } from '../types';

export const getSeasonTypeString = (seasonType: SeasonTypes) => {
    const seasonTypes = new Map<SeasonTypes, string>(
        [
            ["TV", "TV"],
            ["MOVIE", "Filme"],
            ["OTHER", "Outro"]
        ]
    );

    return seasonTypes.get(seasonType) || "Outro";
};