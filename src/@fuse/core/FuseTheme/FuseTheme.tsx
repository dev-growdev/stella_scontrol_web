import GlobalStyles from '@mui/material/GlobalStyles';
import { alpha, ThemeProvider } from '@mui/material/styles';
import { Theme } from '@mui/material/styles/createTheme';
import { memo, ReactNode, useEffect, useLayoutEffect } from 'react';

/**
 * The useEnhancedEffect function is used to conditionally use the useLayoutEffect hook if the window object is defined.
 * Otherwise, it uses the useEffect hook.
 */
const useEnhancedEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type FuseThemeProps = {
	children: ReactNode;
	direction: 'rtl' | 'ltr';
	theme: Theme;
};

const inputGlobalStyles = (
	<GlobalStyles
		styles={theme => ({
			html: {
				backgroundColor: `${theme.palette.background.default}!important`,
				color: `${theme.palette.text.primary}!important`
			},
			body: {
				backgroundColor: theme.palette.background.default,
				color: theme.palette.text.primary,

				'& label.Mui-focused': {
					color: `${theme.palette.primary.main}!important`
				},
				'& .MuiInput-underline:after': {
					borderBottomColor: '#B2BAC2'
				},
				'& .MuiOutlinedInput-root': {
					'& fieldset': {
						borderColor: '#E0E3E7'
					},
					'&:hover fieldset': {
						borderColor: '#B2BAC2'
					},
					'&.Mui-focused fieldset': {
						borderColor: `${theme.palette.primary.main}!important`
					}
				},
				'& .MuiIconButton-edgeEnd': {
					color: `${theme.palette.primary.main}!important`
				},
				'& .MuiInputAdornment-positionStart': {
					color: `${theme.palette.primary.main}!important`
				},
				' & .muiltr-f6jxy6-MuiTypography-root': {
					color: `${theme.palette.primary.main}!important`
				}
			},
			'& .MuiTextField-root': {
				position: 'relative!important'
			},
			'& .MuiFormHelperText-root': {
				marginLeft: '0!important'
			},
			'table.simple tbody tr th': {
				borderColor: theme.palette.divider
			},
			'table.simple thead tr th': {
				borderColor: theme.palette.divider
			},
			'a:not([role=button]):not(.MuiButtonBase-root)': {
				color: theme.palette.secondary.main,
				textDecoration: 'underline',
				'&:hover': {}
			},
			'a.link, a:not([role=button])[target=_blank]': {
				background: alpha(theme.palette.secondary.main, 0.2),
				color: 'inherit',
				borderBottom: `1px solid ${theme.palette.divider}`,
				textDecoration: 'none',
				'&:hover': {
					background: alpha(theme.palette.secondary.main, 0.3),
					textDecoration: 'none'
				}
			},
			'[class^="border"]': {
				borderColor: theme.palette.divider
			},
			'[class*="border"]': {
				borderColor: theme.palette.divider
			},
			'[class*="divide-"] > :not([hidden]) ~ :not([hidden])': {
				borderColor: theme.palette.divider
			},
			hr: {
				borderColor: theme.palette.divider
			},

			'::-webkit-scrollbar-thumb': {
				boxShadow: `inset 0 0 0 20px ${
					theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
				}`
			},
			'::-webkit-scrollbar-thumb:active': {
				boxShadow: `inset 0 0 0 20px ${
					theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
				}`
			}
		})}
	/>
);

/**
 * The FuseTheme component is responsible for rendering the MUI ThemeProvider component with the specified theme and direction.
 * It also sets the direction of the document body and adds a class to the body based on the current theme mode.
 * The component is memoized to prevent unnecessary re-renders.
 */
function FuseTheme(props: FuseThemeProps) {
	const { direction, theme, children } = props;
	const { mode } = theme.palette;

	useEnhancedEffect(() => {
		document.body.dir = direction;
	}, [direction]);

	useEffect(() => {
		document.body.classList.add(mode === 'light' ? 'light' : 'dark');
		document.body.classList.remove(mode === 'light' ? 'dark' : 'light');
	}, [mode]);

	// console.warn('FuseTheme:: rendered',mainTheme);
	return (
		<ThemeProvider theme={theme}>
			{children}
			{inputGlobalStyles}
		</ThemeProvider>
	);
}

export default memo(FuseTheme);
