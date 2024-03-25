import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ReduxStateSquality } from '..';

interface IInitialState {
  loading: boolean;
  value: number;
}

const initialState = {
  loading: false,
  value: 0
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      loading: action.payload
    }),
    increment: state => ({
      ...state,
      value: state.value + 1
    }),
    decrement: state => ({
      ...state,
      value: state.value - 1
    })
  }
});

export const { increment, decrement, setLoading } = counterSlice.actions;
export const selectCount = ({ squality }: ReduxStateSquality): IInitialState => squality.counter;
export default counterSlice.reducer;
