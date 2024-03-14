import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { UseFieldArrayRemove } from 'react-hook-form';
import { CostCenters } from '../main/form-request/FormRequest';
import { formatedNumeral } from '../main/utils/formated-value';

interface RatiableProps {
	costCenters: CostCenters[];
	remove: UseFieldArrayRemove;
	totalApportionmentsValue: (value: string) => void;
}

export default function RatiableTable({ costCenters, remove }: RatiableProps) {
	function totalValue() {
		let total = 0;

		costCenters.forEach(costCenter => {
			const value = parseFloat(costCenter.value.replace(',', '.'));

			if (Number(value)) {
				total += value;
			}
		});

		return formatedNumeral(total);
	}

	return (
		<div className="">
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
							<TableCell sx={{ backgroundColor: '#ffffff' }}>VALOR</TableCell>
							<TableCell
								align="right"
								sx={{ backgroundColor: '#ffffff' }}
							>
								AÇÕES
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{costCenters.map((item, index) => (
							<TableRow key={item.costCenter + Math.random()}>
								<TableCell>{item.costCenter}</TableCell>
								<TableCell>{item.accountingAccount}</TableCell>
								<TableCell>R${formatedNumeral(item.value)}</TableCell>
								<TableCell className="flex justify-end">
									<FuseSvgIcon
										color="primary"
										onClick={() => remove(index)}
									>
										heroicons-outline:trash
									</FuseSvgIcon>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Typography className="text-right">Valor total: R${totalValue()}</Typography>
		</div>
	);
}
