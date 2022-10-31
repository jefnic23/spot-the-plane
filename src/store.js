import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './components/counter/counterSlice';
import pregameReducer from './components/pregame/pregameSlice';
import timerReducer from './components/timer/timerSlice';

export default configureStore({
    reducer: {
        counter: counterReducer,
        timer: timerReducer,
        pregame: pregameReducer,
    },
});
