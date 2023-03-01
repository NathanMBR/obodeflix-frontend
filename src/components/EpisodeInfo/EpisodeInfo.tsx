import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Link,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import { Episode } from "../../types";
import { API_URL } from "../../settings";

export interface EpisodeInfoProps {
    episode?: Episode
};

export const EpisodeInfo = (props: EpisodeInfoProps) => {
    const { episode } = props;

    if (!episode)
        return null;

    return (
        <>
            <Paper elevation={12}>
                    <Card>
                        <CardContent>
                            <Stack direction="row">
                                <Typography
                                    variant="h4"
                                    component="h2"
                                >
                                    Assistir {episode.name}
                                </Typography>

                                <Link
                                    href={`${API_URL}/episode/watch/${episode.id}`}
                                    sx={{ marginLeft: "32px" }}
                                >
                                    <Button variant="contained">Baixar episódio</Button>
                                </Link>
                            </Stack>

                            <Divider />

                            <Typography variant="body1">
                                Para assistir ao episódio sem precisar baixá-lo, siga os seguintes passos:
                            </Typography>
                            <ol>
                                <li>Copie o link do episódio clicando com o botão direito no botão "Baixar episódio" (acima), e em seguida clicando em "Copiar endereço do link" (ou similar)</li>
                                <li>Baixe e instale o VLC Media Player no seu computador</li>
                                <li>Abra o VLC e procure a aba "Media"</li>
                                <li>Vá até a opção "Open Network Stream"</li>
                                <li>Insira o link que você assistir </li>
                            </ol>

                            <img
                                src="/tutorial.png"
                                alt="Indicação da opção no VLC"
                                title="Indicação da opção no VLC"
                            />
                        </CardContent>
                    </Card>
            </Paper>
        </>
    );
};