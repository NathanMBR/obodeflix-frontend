import {
    Box,
    Typography
} from "@mui/material"

export const Footer = () => {
    return (
        <Box sx={{ backgroundColor: "primary.main" }} textAlign="center">
            <Typography variant="body1" color="white" sx={{ padding: 4 }}>OBODE &copy; {new Date().getFullYear()}</Typography>
        </Box>
    )
}