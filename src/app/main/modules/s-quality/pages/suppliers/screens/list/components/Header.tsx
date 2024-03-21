import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Typography, TextField, InputAdornment, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router';

interface PropsHeader {
	searchValue: string;
	setSearchValue: (value: string) => void;
}

export function Header({ searchValue, setSearchValue }: PropsHeader) {
	const navigate = useNavigate();

	const handleNavigateCreateSupplier = () => {
		navigate('cadastro');
	};

	return (
		<Grid
			container
			className="px-20"
		>
			<Grid
				item
				xs={12}
				className="flex flex-col sm:flex-row items-center justify-between gap-20"
			>
				<Typography
					className="text-20 md:text-28"
					component="h1"
					variant="h4"
					fontWeight={500}
					color={theme => theme.palette.secondary.main}
				>
					Suppliers
				</Typography>
				<Button
					id="basic-button"
					aria-haspopup="true"
					className="w-full sm:w-256 shadow-lg py-24"
					variant="contained"
					startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
					onClick={handleNavigateCreateSupplier}
				>
					New supplier registration
				</Button>
			</Grid>
			<Grid
				item
				xs={12}
				className="flex justify-end mt-20"
			>
				<TextField
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
					className="sm:w-512"
					label="Search for suppliers"
					fullWidth
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<FuseSvgIcon color="primary">heroicons-outline:search</FuseSvgIcon>
							</InputAdornment>
						)
					}}
				/>
			</Grid>
		</Grid>
	);
}
