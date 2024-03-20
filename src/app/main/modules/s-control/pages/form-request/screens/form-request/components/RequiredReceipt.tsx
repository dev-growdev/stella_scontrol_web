import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';

interface RequiredReceiptProps {
	sendReceipt: boolean;
	setToggleCheck: (arg: boolean) => void;
}

export function RequiredReceipt({ sendReceipt, setToggleCheck }: RequiredReceiptProps) {
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
							checked={sendReceipt}
							color="primary"
						/>
					}
					label="Sim"
				/>
				<FormControlLabel
					control={
						<Checkbox
							onClick={() => setToggleCheck(false)}
							checked={!sendReceipt}
							color="primary"
						/>
					}
					label="Não"
				/>
			</FormGroup>
		</div>
	);
}
