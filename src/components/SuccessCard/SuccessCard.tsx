import {
    Card,
    Container,
    Divider,
    Modal,
    Paper,
    Typography
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";

export interface SuccessCardProps {
    isOpen: boolean;
    handleClose: () => void;
    message: string;
}

export const SuccessCard = (props: SuccessCardProps) => {
    const {
        isOpen,
        handleClose,
        message
    } = props;

    return (
        <>
            <Modal open={isOpen} onClose={handleClose}>
                <Container maxWidth="sm">
                    <Paper elevation={12}>
                        <Card sx={{ padding: 8, marginTop: "50%", textAlign: "center" }}>
                            <CheckCircleOutline color="success" sx={{ fontSize: 64 }} />
                            <Typography variant="h4" component="h2">Sucesso</Typography>
                            {
                                message
                                    ? <>
                                        <Divider />
                                        <Typography variant="body1">
                                            {
                                                message
                                            }
                                        </Typography>
                                    </>
                                    : null
                            }
                        </Card>
                    </Paper>
                </Container>
            </Modal>
        </>
    );
}