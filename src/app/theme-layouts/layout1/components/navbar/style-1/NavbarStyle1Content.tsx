import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
import { useLocation } from 'react-router';
import Logo from '../../../../shared-components/Logo';
import NavbarToggleButton from '../../../../shared-components/NavbarToggleButton';
import Navigation from '../../../../shared-components/Navigation';

const Root = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.grey[50],
	color: theme.palette.text.primary,
	'& ::-webkit-scrollbar-thumb': {
		boxShadow: `inset 0 0 0 20px ${
			theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
		}`
	},
	'& ::-webkit-scrollbar-thumb:active': {
		boxShadow: `inset 0 0 0 20px ${
			theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
		}`
	}
}));

const StyledContent = styled(FuseScrollbars)(() => ({
	overscrollBehavior: 'contain',
	overflowX: 'hidden',
	overflowY: 'auto',
	WebkitOverflowScrolling: 'touch',
	backgroundRepeat: 'no-repeat',
	backgroundSize: '100% 40px, 100% 10px',
	backgroundAttachment: 'local, scroll'
}));

type NavbarStyle1ContentProps = {
	className?: string;
};

/**
 * The navbar style 1 content.
 */
function NavbarStyle1Content(props: NavbarStyle1ContentProps) {
	const { className = '' } = props;
	const theme = useTheme();
	const location = useLocation();

	return (
		<Root className={clsx('flex h-full flex-auto flex-col overflow-hidden', className)}>
			<div className="flex h-48 shrink-0 flex-row items-center px-20 md:h-72">
				<div className="mx-4 flex flex-1">
					{location.pathname.includes('scontrol') ? (
						<Logo />
					) : (
						<h1 className="font-extrabold text-4xl text-blue-600">Squality</h1>
					)}
				</div>

				<NavbarToggleButton
					textColor="#00abc8"
					className="h-40 w-40 p-0"
				/>
			</div>

			<StyledContent
				className="flex min-h-0 flex-1 flex-col"
				option={{ suppressScrollX: true, wheelPropagation: false }}
			>
				{/* <UserNavbarHeader /> */}

				<Navigation layout="vertical" />
			</StyledContent>
		</Root>
	);
}

export default memo(NavbarStyle1Content);
