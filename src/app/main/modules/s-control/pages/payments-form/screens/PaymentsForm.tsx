import { Box, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { PaymentsFormTable } from '../../../components/payment-form-table/PaymentsFormTable';
import {
	HolderType,
	PaymentForm,
	disablePaymentsForm,
	getPaymentsForm,
	selectPaymentsForm
} from '../../../store/slices/PaymentsFormSlice';
import { useDispatchSControl, useSelectorSControl } from '../../../store/hooks';

export default function PaymentsForm() {
	const dispatchScontrol = useDispatchSControl();
	const paymentsFormRedux = useSelectorSControl(selectPaymentsForm);

	useEffect(() => {
		dispatchScontrol(getPaymentsForm());
	}, []);

	async function handleGetStatus(item: PaymentForm | HolderType) {
		dispatchScontrol(disablePaymentsForm(item));
	}

	return (
		<Box>
			<div className="p-32 mt-20">
				<Paper
					elevation={4}
					className="p-28"
				>
					<Typography
						className="text-20 md:text-28"
						component="h1"
						variant="h4"
						fontWeight={500}
						sx={{ color: theme => theme.palette.secondary.main }}
					>
						Formas de pagamento
					</Typography>
				</Paper>
				<Paper
					elevation={4}
					className="mt-24 flex flex-col gap-24"
				>
					<div className="flex items-center gap-24 flex-col sm:flex-row">
						<PaymentsFormTable
							paymentsFormData={paymentsFormRedux}
							handleStatus={handleGetStatus}
						/>
					</div>
				</Paper>
			</div>
		</Box>
	);
}
