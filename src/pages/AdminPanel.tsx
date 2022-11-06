import {
    Divider,
    Grid,
    Typography
} from "@mui/material";

import { NotFound } from "../pages";
import { AdminPanelOption } from "../components";

export const AdminPanel = () => {
    const hasPermissionToAccess = localStorage.getItem("token") && localStorage.getItem("type") === "ADMIN";
    if (!hasPermissionToAccess)
        return <NotFound />;

    const panelOptions = [
        {
            title: "Séries",
            link: "/admin/series"
        },

        {
            title: "Tags",
            link: "/admin/tags"
        },

        {
            title: "Temporadas",
            link: "/admin/seasons"
        },

        {
            title: "Episódios",
            link: "/admin/episodes"
        }
    ];

    return (
        <>
            <Typography variant="h4" component="h2">Painel administrativo</Typography>
            <Divider />
            <Grid container spacing={2} style={{ marginTop: 2 }}>
                {
                    panelOptions.map(
                        (options, index) => <Grid item xs={6}>
                            <AdminPanelOption
                                title={options.title}
                                link={options.link}
                                key={index}
                            />
                        </Grid>
                    )
                }
            </Grid>
        </>
    )
}