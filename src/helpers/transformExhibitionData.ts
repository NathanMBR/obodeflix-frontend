import { getDurationTime } from "./getDurationTime";

export const transformExhibitionData = (data: any, column: string = "") => {
    const stringifiedData = String(data);

    const parseDate = () => `${new Date(stringifiedData)
        .toLocaleDateString(
            "pt-BR",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        )
    }, ${new Date(stringifiedData)
        .toLocaleTimeString(
            "pt-BR",
            {
                hour: "numeric",
                minute: "numeric"
            }
        )
    }`;

    const transformers: Record<string, () => string> = {
        "duration": () => getDurationTime(Number(stringifiedData)),
        "createdAt": parseDate,
        "updatedAt": parseDate,
        "deletedAt": parseDate
    };

    const transformer = transformers[column] || (() => stringifiedData);
    const exhibitionData = transformer();

    return exhibitionData === "null"
        ? "(vazio)"
        : exhibitionData;
}