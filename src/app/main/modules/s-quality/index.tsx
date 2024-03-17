import withReducer from 'app/store/withReducer';
import { Outlet } from 'react-router-dom';
import { squalityReducers } from './store/rootReducer';

export const SQualityModule = withReducer('squality', squalityReducers)(Outlet);
