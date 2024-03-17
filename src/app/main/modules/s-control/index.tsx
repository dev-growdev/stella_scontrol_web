import withReducer from 'app/store/withReducer';
import { Outlet } from 'react-router-dom';
import { scontrolReducers } from './store/rootReducer';

export const SControlModule = withReducer('scontrol', scontrolReducers)(Outlet);
