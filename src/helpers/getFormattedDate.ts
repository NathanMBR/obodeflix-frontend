export const getFormattedDate = (date: Date | string) => new Date(date)
    .toLocaleString(
        "pt-BR",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric"
        }
    )