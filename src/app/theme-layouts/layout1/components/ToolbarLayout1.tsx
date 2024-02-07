import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { TextField, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import { ThemeProvider } from '@mui/material/styles';
import { selectFuseNavbar } from 'app/store/fuse/navbarSlice';
import { selectFuseCurrentLayoutConfig, selectToolbarTheme } from 'app/store/fuse/settingsSlice';
import { Layout1ConfigDefaultsType } from 'app/theme-layouts/layout1/Layout1Config';
import clsx from 'clsx';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import NavbarToggleButton from '../../shared-components/NavbarToggleButton';
import UserMenu from '../../shared-components/UserMenu';

type ToolbarLayout1Props = {
	className?: string;
};

/**
 * The toolbar layout 1.
 */
function ToolbarLayout1(props: ToolbarLayout1Props) {
	const { className } = props;
	const config = useSelector(selectFuseCurrentLayoutConfig) as Layout1ConfigDefaultsType;
	const navbar = useSelector(selectFuseNavbar);
	const toolbarTheme = useSelector(selectToolbarTheme);

	const theme = useTheme()


	return (
		<ThemeProvider theme={toolbarTheme}>
			<AppBar
				id="fuse-toolbar"
				className={clsx('relative z-20 flex shadow-md', className)}
				color="default"
				sx={{
					backgroundColor: theme =>
						theme.palette.mode === 'light'
							? theme.palette.primary.main
							: toolbarTheme.palette.background.default
				}}
				position="static"
			>
				<Toolbar className="min-h-48 p-0 md:min-h-64">
					<div className="flex flex-1 px-16 items-center">
						{config.navbar.display && config.navbar.position === 'left' && (
							<>
								<Hidden lgDown>
									{/* {(config.navbar.style === 'style-3' || config.navbar.style === 'style-3-dense') && (
										<NavbarToggleButton className="mx-0 h-40 w-40 p-0" />
									)} */}

									{config.navbar.style === 'style-1' && !navbar.open && (
										<NavbarToggleButton textColor={theme.palette.common.white} className="mx-0 h-40 w-40 p-0 justify-center" />
									)}
								</Hidden>

								<Hidden lgUp>
									<NavbarToggleButton textColor={theme.palette.common.white} className="mx-0 h-40 w-40 p-0 sm:mx-8 justify-center " />
								</Hidden>
							</>
						)}

						<div className='w-2/3 flex justify-center items-center'>
							<TextField fullWidth sx={{
								backgroundColor: theme =>
									theme.palette.mode === 'light'
										? theme.palette.primary.light
										: toolbarTheme.palette.background.default,
								borderRadius: '10px',
								height: '70%',
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										border: 'none',
									},
								},
							}} InputProps={{
								sx: {
									color: theme => theme.palette.common.white,
									borderColor: 'none',

								},
								startAdornment: (
									<FuseSvgIcon sx={{ marginRight: '10px', color: theme => theme.palette.common.white, }} >
										heroicons-outline:search
									</FuseSvgIcon>
								)
							}} />

						</div>
					</div>

					<div className="flex h-full items-center overflow-x-auto px-8">
						<FuseSvgIcon sx={{ color: theme => theme.palette.common.white }}>heroicons-outline:bell</FuseSvgIcon>
						<UserMenu />
					</div>

					{config.navbar.display && config.navbar.position === 'right' && (
						<>
							<Hidden lgDown>
								{!navbar.open && <NavbarToggleButton textColor={theme.palette.common.white} className="mx-0 h-40 w-40 p-0" />}
							</Hidden>

							<Hidden lgUp>
								<NavbarToggleButton textColor={theme.palette.primary.main} className="mx-0 h-40 w-40 p-0 sm:mx-8" />
							</Hidden>
						</>
					)}
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default memo(ToolbarLayout1);
