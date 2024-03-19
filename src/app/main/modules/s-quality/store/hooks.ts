import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatchSquality, ReduxStateSquality } from '.';

export const useDispatchSQuality: () => AppDispatchSquality = useDispatch;
export const useSelectorSQuality: TypedUseSelectorHook<ReduxStateSquality> = useSelector;
