import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import _ from '@lodash';
import IconButton from '@mui/material/IconButton';
import { useAppDispatch, useAppSelector } from 'app/store';
import { navbarToggle, navbarToggleMobile } from 'app/store/fuse/navbarSlice';
import { selectFuseCurrentSettings, setDefaultSettings } from 'app/store/fuse/settingsSlice';

type NavbarToggleButtonProps = {
	className?: string;
	children?: React.ReactNode;
	textColor?: string
};

/**
 * The navbar toggle button.
 */
function NavbarToggleButton(props: NavbarToggleButtonProps) {
	const {
		className = '',
		children = (
			<FuseSvgIcon
				size={20}
				color='inherit'
				sx={{ color: props.textColor }}
			>
				heroicons-outline:view-list
			</FuseSvgIcon>
		)
	} = props;


	const dispatch = useAppDispatch();
	const isMobile = useThemeMediaQuery(theme => theme.breakpoints.down('lg'));
	const settings: FuseSettingsConfigType = useAppSelector(selectFuseCurrentSettings);
	const { config } = settings.layout;

	return (
		<IconButton
			className={className}
			color="inherit"
			size="small"
			onClick={() => {
				if (isMobile) {
					dispatch(navbarToggleMobile());
				} else if (config?.navbar?.style === 'style-2') {
					dispatch(
						setDefaultSettings(
							_.set({}, 'layout.config.navbar.folded', !settings?.layout?.config?.navbar?.folded)
						)
					);
				} else {
					dispatch(navbarToggle());
				}
			}}
		>
			{children}
		</IconButton>
	);
}

export default NavbarToggleButton;
