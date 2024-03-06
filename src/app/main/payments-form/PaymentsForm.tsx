import { Box, Paper } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PaymentsFormTable from '../../components/PaymentsFormTable';
import { PaymentForm, disablePaymentsForm, getPaymentsForm, selectPaymentsForm } from './PaymentsFormSlice';

export default function PaymentsForm() {
	const dispatch = useAppDispatch();
	const paymentsFormRedux = useSelector(selectPaymentsForm);

	useEffect(() => {
		dispatch(getPaymentsForm());
	}, []);

	console.log(paymentsFormRedux);

	async function handleGetStatus(item: PaymentForm) {
		const itemToggleEnable = {
			uid: item.uid,
			name: item.name,
			enable: !item.enable
		};

		dispatch(disablePaymentsForm(itemToggleEnable));
	}

	return (
		<Box>
			<div className="p-32 mt-20">
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
