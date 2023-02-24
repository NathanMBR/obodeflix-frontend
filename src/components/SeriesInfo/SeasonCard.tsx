import {
    Button,
    Card,
    CardActions,
    CardContent,
    Paper,
    Typography
} from "@mui/material";
import { Link } from "react-router-dom";

import { getSeasonTypeString } from "../../helpers";
import { Season } from "../../types";

export interface SeasonCardProps {
    season: Season;
};

export const SeasonCard = (props: SeasonCardProps) => {
    const { season } = props;

    return (
        <>
            <Paper elevation={6}>
                <Card
                    sx={{ marginTop: 2 }}    
                >
                    <CardContent>
                        <Typography variant="h5">
                            {season.name}
                        </Typography>


                        <Typography variant="body1">
                            Tipo: {getSeasonTypeString(season.type)}
                        </Typography>
                    </CardContent>

                    <CardActions>
                        <Link to={`/seasons/${season.id}`}>
                            <Button variant="contained">
                                Ver temporada
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
            </Paper>
        </>
    );
};