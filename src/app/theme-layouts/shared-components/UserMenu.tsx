import { useMsal } from '@azure/msal-react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { selectUser } from 'app/store/user/userSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import JwtService from 'src/app/auth/services/jwtService';

/**
 * The user menu.
 */
function UserMenu() {
	const user = useSelector(selectUser);

	const [userMenu, setUserMenu] = useState<HTMLElement | null>(null);
	const { instance } = useMsal();

	const userMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setUserMenu(event.currentTarget);
	};

	const userMenuClose = () => {
		setUserMenu(null);
	};

	function handleLogout() {
		instance.logoutPopup({
			postLogoutRedirectUri: "/login",
			mainWindowRedirectUri: "/login",
		})
		JwtService.logout()
	}

	return (
		<>
			<Button
				className="min-h-40 min-w-40 p-0 md:px-16 md:py-6"
				onClick={userMenuClick}
				color="inherit"
				sx={{ color: 'white' }}
			>
				<div className="mx-4 hidden flex-col items-end md:flex">
					<Typography
						component="span"
						className="flex font-semibold"
					>
						{user.data.displayName}
					</Typography>
					<Typography
						className="text-11 font-medium capitalize"
						color="HighlightText"
					>
						{user.role.toString()}
						{(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
					</Typography>
				</div>

				{user.data.photoURL ? (
					<Avatar
						className="md:mx-4"
						alt="user photo"
						src={user.data.photoURL}
					/>
				) : (
					<Avatar className="md:mx-4">{user.data.photoURL}</Avatar>
				)}
			</Button>

			<Popover
				open={Boolean(userMenu)}
				anchorEl={userMenu}
				onClose={userMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8'
				}}
			>
				{!user.role || user.role.length === 0 ? (
					<>
						<MenuItem
							component={Link}
							to="/sign-in"
							role="button"
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Login" />
						</MenuItem>
						<MenuItem
							component={Link}
							to="/sign-up"
							role="button"
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Sair" />
						</MenuItem>
					</>
				) : (
					<MenuItem
						onClick={handleLogout}
					>
						<ListItemIcon className="min-w-40">
							<FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
						</ListItemIcon>
						<ListItemText primary="Sign out" />
					</MenuItem>
				)}
			</Popover>
		</>
	);
}

export default UserMenu;
