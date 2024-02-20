import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { FormDataProps } from '../main/form-request/FormRequest';

interface RatiableProps {
	formData: FormDataProps;
	setFormData: Dispatch<SetStateAction<FormDataProps>>;
}

export default function IsRatiable({ formData, setFormData }: RatiableProps) {
	return (
		<div className="flex items-center">
			<Typography
				className="mr-10"
				color="GrayText"
			>
				Rateio
			</Typography>
			<FormGroup className="flex flex-row">
				<FormControlLabel
					control={
						<Checkbox
							onClick={() => setFormData(prevState => ({ ...prevState, isRatiable: true }))}
							checked={formData.isRatiable}
						/>
					}
					label="Sim"
				/>
				<FormControlLabel
					control={
						<Checkbox
							onClick={() => setFormData(prevState => ({ ...prevState, isRatiable: false }))}
							checked={!formData.isRatiable}
						/>
					}
					label="Não"
				/>
			</FormGroup>
		</div>
	);
}
