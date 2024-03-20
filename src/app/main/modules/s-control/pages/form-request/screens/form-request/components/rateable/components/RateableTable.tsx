import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect } from 'react';
import { UseFieldArrayRemove } from 'react-hook-form';
import { formattedNumeral } from '~/modules/s-control/utils/formatters/formatted-value';

interface Apportionments {
	costCenter: string;
	accountingAccount: string;
	value: string;
}

interface RateableProps {
	apportionments: Apportionments[];
	remove: UseFieldArrayRemove;
	totalApportionmentsValue: (value: number) => void;
}

export function RateableTable({ apportionments, remove, totalApportionmentsValue }: RateableProps) {
	useEffect(() => {
		totalApportionmentsValue(totalValue());
	}, [totalValue]);

	function totalValue() {
		let total = 0;

		apportionments.forEach(apportionment => {
			const value = parseFloat(apportionment.value.replace(',', '.'));

			if (value) {
				total += value;
			}
		});

		return total;
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
						{apportionments.map((item, index) => (
							<TableRow key={item.costCenter + Math.random()}>
								<TableCell>{item.costCenter}</TableCell>
								<TableCell>{item.accountingAccount}</TableCell>
								<TableCell>R${formattedNumeral(parseFloat(item.value))}</TableCell>
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
			<Typography className="text-right">Valor total: R${formattedNumeral(totalValue())}</Typography>
		</div>
	);
}