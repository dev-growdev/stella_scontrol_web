import { Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { scontrolStore } from './store';

export function LayoutSControl() {
	return (
		<Provider store={scontrolStore}>
			<Outlet />;
		</Provider>
	);
}

// export default withReducer('scontrol', scontrolReducers)(LayoutSControl);
