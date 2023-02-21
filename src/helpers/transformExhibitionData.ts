export const transformExhibitionData = (data: any, column: string = "") => {
    const dateColumns = [
        "createdAt",
        "updatedAt",
        "deletedAt"
    ];

    const transformedData = String(data);
    const isValidDate = dateColumns.includes(column);

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