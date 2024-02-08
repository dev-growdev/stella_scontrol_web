import { useMsal } from "@azure/msal-react";
import { Box, Button, Typography } from "@mui/material";

export default function Requests() {
    const { instance } = useMsal();

    function handleLogoutMicrosoft() {
        instance.logoutPopup({
            postLogoutRedirectUri: "/login",
            mainWindowRedirectUri: "/login",
        })
    }

    return (

        <Box className="flex flex-col w-full">
            <Typography variant="h1" component="h1">Solicitações</Typography>
            <Button variant="contained" onClick={handleLogoutMicrosoft}>Logout</Button>
        </Box >

    )
}