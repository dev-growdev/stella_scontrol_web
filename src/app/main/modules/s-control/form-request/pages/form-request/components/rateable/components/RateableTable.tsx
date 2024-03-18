import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect } from 'react';
import { UseFieldArrayRemove } from 'react-hook-form';
import { formattedNumeral } from '~/modules/s-control/utils/formatters/formatted-value';

interface CostCenters {
	costCenter: string;
	accountingAccount: string;
	value: string;
}

interface RateableProps {
	costCenters: CostCenters[];
	remove: UseFieldArrayRemove;
	totalApportionmentsValue: (value: string) => void;
}

export function RateableTable({ costCenters, remove, totalApportionmentsValue }: RateableProps) {
	useEffect(() => {
		totalApportionmentsValue(totalValue());
	}, [totalValue]);

	function totalValue() {
		let total = 0;

		costCenters.forEach(costCenter => {
			const value = parseFloat(costCenter.value.replace(',', '.'));

			if (Number(value)) {
				total += value;
			}
		});

		return formattedNumeral(total);
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
								<TableCell>R${formattedNumeral(item.value)}</TableCell>
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
