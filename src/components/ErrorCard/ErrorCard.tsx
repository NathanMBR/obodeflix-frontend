import {
  Card,
  Container,
  Divider,
  Modal,
  Paper,
  Typography
} from "@mui/material"
import { ErrorOutline } from "@mui/icons-material"
import type { CSSProperties } from "react"

export type ErrorCardStatusCodeProp = 400 | 401 | 403 | 404 | 500 | null

export interface ErrorCardProps {
  isOpen: boolean
  handleClose: () => void
  statusCode: ErrorCardStatusCodeProp
  reasons?: string | Array<string>
}

export const ErrorCard = (props: ErrorCardProps) => {
  const {
    isOpen,
    handleClose,
    statusCode,
    reasons
  } = props

  const closeModal = () => {
    handleClose()

    if (statusCode === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("id")
      localStorage.removeItem("type")
      window.location.href = "/login"
    }
  }

  const errorOutlineStyle: CSSProperties = {
    fontSize: 64
  }

  const errorMessages = new Map<typeof statusCode, JSX.Element>()
    .set(
      400,
      <>
        <ErrorOutline
          color="error"
          sx={errorOutlineStyle}
        />

        <Typography
          variant="h4"
          component="h2"
        >
          Erro de validação
        </Typography>

        {
          reasons &&
          Array.isArray(reasons) &&
          reasons.length > 0
            ? <>
              <Divider />
              <Typography variant="body1">Razões:</Typography>
              {
                reasons.map(
                  (reason, index) => <span
                    style={{ display: "block" }}
                    key={index}
                  >
                    {reason}
                  </span>
                )
              }
            </>
            : null
        }
      </>
    )
    .set(
      401,
      <>
        <ErrorOutline
          color="warning"
          sx={errorOutlineStyle}
        />

        <Typography
          variant="h4"
          component="h2"
        >
          Erro de autenticação
        </Typography>

        <Divider />

        <Typography variant="body1">É necessário refazer o login.</Typography>
      </>
    )
    .set(
      403,
      <>
        <ErrorOutline
          color="error"
          sx={errorOutlineStyle}
        />
        <Typography
          variant="h4"
          component="h2"
        >
          Não autorizado
        </Typography>

        <Divider />

        <Typography variant="body1">Você não possui as permissões necessárias para acessar este recurso.</Typography>
      </>
    )
    .set(
      404,
      <>
        <ErrorOutline
          color="warning"
          sx={errorOutlineStyle}
        />

        <Typography
          variant="h4"
          component="h2"
        >
          Não encontrado
        </Typography>

        <Divider />

        <Typography variant="body1">
          {
            reasons &&
            !Array.isArray(reasons)
              ? reasons
              : "O recurso requisitado não foi encontrado."
          }
        </Typography>
      </>
    )
    .set(
      500,
      <>
        <ErrorOutline
          color="error"
          sx={errorOutlineStyle}
        />

        <Typography
          variant="h4"
          component="h2"
        >
          Erro interno no servidor
        </Typography>

        <Divider />

        <Typography variant="body1">Por favor, tente novamente mais tarde.</Typography>
      </>
    )

  return (
    <>
      <Modal
        open={isOpen}
        onClose={closeModal}
      >
        <Container maxWidth="sm">
          <Paper elevation={12}>
            <Card sx={{
              padding: 8,
              marginTop: "50%",
              textAlign: "center"
            }}>
              {
                errorMessages.get(statusCode)
              }
            </Card>
          </Paper>
        </Container>
      </Modal>
    </>
  )
}
