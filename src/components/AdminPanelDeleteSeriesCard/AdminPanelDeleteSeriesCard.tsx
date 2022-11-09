import {
    Button,
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Divider,
    Modal,
    Paper,
    Stack,
    Switch,
    Tooltip,
    Typography
} from "@mui/material";
import { WarningAmber } from "@mui/icons-material";
import {
    CSSProperties,
    useState
} from "react";

import { Series } from "../../types";

export interface AdminPanelDeleteSeriesCardProps {
    series: Series | null;
    isOpen: boolean;
    handleClose: () => void;
    handleDelete: () => void;
}

export const AdminPanelDeleteSeriesCard = (props: AdminPanelDeleteSeriesCardProps) => {
    const {
        series,
        isOpen,
        handleClose,
        handleDelete
    } = props;

    const [showAlternativeName, setShowAlternativeName] = useState(false);

    const handleAlternativeNameToggle = () => {
        setShowAlternativeName(!showAlternativeName);
    };

    if (!series)
        return null;

    const containerStyle: CSSProperties = {
        paddingTop: "50vh"
    };

    const paperStyle: CSSProperties = {
        textAlign: "center",
        transform: "translateY(-50%)"
    };

    const imageStyle: CSSProperties = {
        maxWidth: "25%",
        maxHeight: "25%"
    };

    const toggleNameStyle: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

    return (
        <>
            <Modal
                open={isOpen}
                onClose={handleClose}
            >
                <Container maxWidth="sm" sx={containerStyle}>
                    <Paper elevation={12} sx={paperStyle}>
                        <Card>
                            <CardContent>
                                <Stack
                                    direction="column"
                                    sx={{ alignItems: "center" }}
                                >
                                    <WarningAmber
                                        color="error"
                                        sx={{ fontSize: 64 }}
                                    />
                                    <Typography
                                        variant="h4"
                                        component="h2"
                                    >
                                        Aviso
                                    </Typography>
                                    <Typography variant="body1">Você tem certeza de que deseja excluir a série abaixo? <br /> Esta ação é irreversível.</Typography>

                                    {
                                        series.imageAddress ?
                                            <CardMedia
                                                component="img"
                                                sx={imageStyle}
                                                src={series.imageAddress || ""}
                                                alt="Série a ser excluída"
                                            />
                                            : null
                                    }


                                    <Typography
                                        variant="h5"
                                        component="h3"
                                    >
                                        {
                                            showAlternativeName
                                                ? series.alternativeName
                                                : series.mainName
                                        }
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        sx={toggleNameStyle}
                                    >
                                        <Typography>Exibir nome alternativo</Typography>
                                        <Tooltip title={series.alternativeName ? "" : "Não há nome alternativo"}>
                                            <Box>
                                                <Switch
                                                    onChange={handleAlternativeNameToggle}
                                                    disabled={!series.alternativeName}
                                                />
                                            </Box>
                                        </Tooltip>
                                    </Stack>
                                </Stack>
                            </CardContent>

                            <Divider />

                            <CardActions style={{ display: "block", width: "auto" }}>
                                <Stack
                                    direction="row"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={handleClose}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleDelete}
                                    >
                                        Excluir série
                                    </Button>
                                </Stack>
                            </CardActions>
                        </Card>
                    </Paper>
                </Container>
            </Modal>
        </>
    );
}