import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useState } from "react";
import DataTable from "../../components/DataTable";

export default function CategoriesPage() {
    const [categories, setCategories] = useState([])

    function handleSelectedCategory(selectedData: any) {
        console.log(selectedData)
    }

    function newCategory(newCategory: any) {
        console.log(newCategory)
    }

    return (
        <>
            <Box>
                <div className="p-32 mt-20">
                    <Paper elevation={4} className="p-28">
                        <Typography className="text-20 md:text-28" component='h1' variant="h4" fontWeight={400}>Cadastro de categorias</Typography>
                    </Paper>

                    <Paper elevation={4} className="mt-24 p-36 flex flex-col gap-24">
                        <Typography color='GrayText'>Adicione novas categorias.</Typography>

                        <div className="flex items-center gap-24 flex-col sm:flex-row">
                            <DataTable />
                            <Button className="w-full sm:w-144 pl-60 pr-64" sx={{ borderRadius: '7px' }} variant="contained" startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}>
                                ADICIONAR
                            </Button>
                        </div>
                    </Paper>
                </div>
            </Box>
        </>
    )
}