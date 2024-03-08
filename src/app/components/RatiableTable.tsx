import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { CostCenters } from '../main/form-request/FormRequest';

interface RatiableProps {
	costCenters: CostCenters[];
}

export default function RatiableTable({ costCenters }: RatiableProps) {
	return (
		<TableContainer
			className="my-36"
			component={Paper}
			elevation={3}
		>
			<Table
				sx={{ minWidth: 700 }}
				aria-label="customized table"
			>
				<TableHead>
					<TableRow>
						<TableCell sx={{ backgroundColor: '#ffffff' }}>CENTRO DE CUSTOS</TableCell>
						<TableCell sx={{ backgroundColor: '#ffffff' }}>CONTA CONTÁBIL</TableCell>
						<TableCell
							align="right"
							sx={{ backgroundColor: '#ffffff' }}
						>
							VALOR
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{costCenters.map(item => (
						<TableRow key={item.costCenter + Math.random()}>
							<TableCell>{item.costCenter}</TableCell>
							<TableCell>{item.accountingAccount}</TableCell>
							<TableCell align="right">{item.value}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
