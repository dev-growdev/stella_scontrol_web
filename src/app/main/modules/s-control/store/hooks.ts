import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatchScontrol, ReduxStateScontrol } from '.';

export const useDispatchSControl: () => AppDispatchScontrol = useDispatch;
export const useSelectorSControl: TypedUseSelectorHook<ReduxStateScontrol> = useSelector;
