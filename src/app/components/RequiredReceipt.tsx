import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { FormDataProps } from '../main/form-request/FormRequest';

interface RequiredReceiptProps {
	formData: FormDataProps;
	setFormData: Dispatch<SetStateAction<FormDataProps>>;
}

export default function RequiredReceipt({ formData, setFormData }: RequiredReceiptProps) {
	return (
		<div className="flex flex-row items-center">
			<Typography
				className="mr-10"
				color="GrayText"
			>
				Necessita comprovante
			</Typography>
			<FormGroup className="flex flex-row flex-nowrap">
				<FormControlLabel
					control={
						<Checkbox
							onClick={() => setFormData(prevState => ({ ...prevState, requiredReceipt: true }))}
							checked={formData.requiredReceipt}
							color="primary"
						/>
					}
					label="Sim"
				/>
				<FormControlLabel
					control={
						<Checkbox
							onClick={() => setFormData(prevState => ({ ...prevState, requiredReceipt: false }))}
							checked={!formData.requiredReceipt}
							color="primary"
						/>
					}
					label="Não"
				/>
			</FormGroup>
		</div>
	);
}
