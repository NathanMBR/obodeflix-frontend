import {
  Grid,
  TextField,
} from "@mui/material"
import {
  type ChangeEvent,
  type FormEvent,
  useState
} from "react"

import {
  DefaultHeader,
  SaveFAB
} from "../../components"
import type { Tag } from "../../types"

export interface AdminPanelUpsertTagFormProps {
  tag?: Tag
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  isRequestLoading: boolean
}

export const AdminPanelUpsertTagForm = (props: AdminPanelUpsertTagFormProps) => {
  const {
    tag,
    handleSubmit,
    isRequestLoading
  } = props

  const [name, setName] = useState(tag?.name || "")

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  return (
    <>
      <DefaultHeader style={{ textAlign: "center" }}>
        {
          tag
            ? "Editar tag"
            : "Cadastrar tag"
        }
      </DefaultHeader>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Nome"
              value={name}
              onChange={handleNameChange}
              required
              fullWidth
            />
          </Grid>

          <SaveFAB
            loading={isRequestLoading}
            submit
          />
        </Grid>
      </form>
    </>
  )
}
