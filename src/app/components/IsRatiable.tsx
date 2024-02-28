import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';

interface RatiableProps {
	isRatiable: boolean;
	setToggleRatiable: (arg: boolean) => void;
}

export default function IsRatiable({ isRatiable, setToggleRatiable }: RatiableProps) {
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
							onClick={() => setToggleRatiable(true)}
							checked={isRatiable}
							color="primary"
						/>
					}
					label="Sim"
				/>
				<FormControlLabel
					control={
						<Checkbox
							onClick={() => setToggleRatiable(false)}
							checked={!isRatiable}
							color="primary"
						/>
					}
					label="Não"
				/>
			</FormGroup>
		</div>
	);
}
