import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useDispatchSQuality, useSelectorSQuality } from '../../store/hooks';
import { decrement, increment, selectCount, setLoading } from '../../store/slices/counterSlice';

export function Counter() {
	const counter = useSelectorSQuality(selectCount);
	const dispatchSQuality = useDispatchSQuality();

	useEffect(() => {
		dispatchSQuality(setLoading(true));
		setTimeout(() => {
			dispatchSQuality(setLoading(false));
		}, 2000);
	}, []);

	return counter.loading ? (
		<div className="flex h-full  justify-center items-center">
			<p className="text-xl font-bold p-10">Loading...</p>
		</div>
	) : (
		<div className="flex h-full  justify-center items-center">
			<Button
				variant="contained"
				type="button"
				onClick={() => dispatchSQuality(decrement())}
			>
				Decrement
			</Button>

			<p className="text-xl p-10">{counter.value}</p>
			<Button
				type="button"
				variant="contained"
				onClick={() => dispatchSQuality(increment())}
			>
				Increment
			</Button>
		</div>
	);
}
