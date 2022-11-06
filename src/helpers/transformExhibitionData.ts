export const transformExhibitionData = (data: any) => {
    const transformedData = String(data);
    const isValidDate = !Number.isNaN(new Date(transformedData).getTime());

    const exhibitionData = isValidDate
        ? `${new Date(transformedData)
            .toLocaleDateString(
                "pt-BR",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            )
        }, ${new Date(transformedData)
            .toLocaleTimeString(
                "pt-BR",
                {
                    hour: "numeric",
                    minute: "numeric"
                }
            )
        }`
        : transformedData;

    return exhibitionData === "null"
        ? "(vazio)"
        : exhibitionData;
}