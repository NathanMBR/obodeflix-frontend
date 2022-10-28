export const getDurationTime = (durationInSeconds: number) => {
    const oneHourInSeconds = 3600;
    const oneMinuteInSeconds = 60;

    const hours = Math.floor(durationInSeconds / oneHourInSeconds);
    const minutes = Math.floor((durationInSeconds % oneHourInSeconds) / oneMinuteInSeconds);
    const seconds = Math.floor(durationInSeconds % oneMinuteInSeconds);

    const hoursString = hours > 0
        ? (hours < 10 ? `0${hours}h` : `${hours}h`)
        : "";

    const minutesString = minutes > 0
        ? (minutes < 10 ? `0${minutes}min` : `${minutes}min`)
        : (hours > 0 ? "00min" : "");

    const secondsString = seconds > 0
        ? (seconds < 10 ? `0${seconds}s` : `${seconds}s`)
        : "00s";

    return `${hoursString}${minutesString}${secondsString}`;
}