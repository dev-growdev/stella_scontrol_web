import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';

interface RequiredReceiptProps {
	requiredReceipt: boolean;
	setToggleCheck: (arg: boolean) => void;
}

export default function RequiredReceipt({ requiredReceipt, setToggleCheck }: RequiredReceiptProps) {
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
							onClick={() => setToggleCheck(true)}
							checked={requiredReceipt}
							color="primary"
						/>
					}
					label="Sim"
				/>
				<FormControlLabel
					control={
						<Checkbox
							onClick={() => setToggleCheck(false)}
							checked={!requiredReceipt}
							color="primary"
						/>
					}
					label="Não"
				/>
			</FormGroup>
		</div>
	);
}
