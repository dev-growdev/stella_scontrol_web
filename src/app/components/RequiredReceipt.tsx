import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';

interface RequiredReceiptProps {
	formData: any;
	setFormData: (arg: any) => void;
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
