import { Box, Typography, useTheme } from "@mui/material";


export default function Requests() {
    const theme = useTheme();

    return (

        <Box className="flex flex-col w-full">
            <Typography variant="h1" component="h1">Solicitações</Typography>

        </Box >

    )
}