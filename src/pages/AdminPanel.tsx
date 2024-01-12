import {
  Divider,
  Grid,
  Typography
} from "@mui/material"

import { NotFound } from "../pages"
import { AdminPanelOption } from "../components"

export const AdminPanel = () => {
  const hasPermissionToAccess = localStorage.getItem("token") && localStorage.getItem("type") === "ADMIN"
  if (!hasPermissionToAccess)
    return <NotFound />

  interface PanelOption {
    title: string
    link: string
  }

  const panelOptions: Array<PanelOption> = [
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
    },

    {
      title: "Importação de Episódios",
      link: "/admin/episodes-import"
    },

    {
      title: "Pastas não importadas",
      link: "/admin/unused-folders"
    },

    {
      title: "Importação de Faixas",
      link: "/admin/tracks-import"
    },

    {
      title: "Temporadas sem faixas",
      link: "/admin/seasons-without-tracks"
    }
  ]

  return (
    <>
      <Typography
        variant="h4"
        component="h2"
      >
        Painel administrativo
      </Typography>

      <Divider />

      <Grid container
        spacing={2}
        mt={2}
      >
        {
          panelOptions.map(
            (options, index) => <Grid item
              key={index}
              xs={index === panelOptions.length - 1 && panelOptions.length % 2 === 1 ? 12 : 6}
            >
              <AdminPanelOption
                title={options.title}
                link={options.link}
              />
            </Grid>
          )
        }
      </Grid>
    </>
  )
}
