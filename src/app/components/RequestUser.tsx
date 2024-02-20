import { TextField } from '@mui/material';
import UserType from 'app/store/user/UserType';

interface RequestUserProps {
	user: UserType;
}

export default function RequestUser({ user }: RequestUserProps) {
	return (
		<div className="flex flex-col gap-24 sm:flex-row">
			<TextField
				fullWidth
				disabled
				label="Usuário solicitante"
				value={user.data.displayName}
			/>
			<TextField
				fullWidth
				disabled
				label="Email"
				value={user.data.email}
			/>
			<TextField
				fullWidth
				disabled
				label="Centro de custo"
				value={user.role}
			/>
		</div>
	);
}
