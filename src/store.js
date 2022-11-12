import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './store/counterSlice';
import gameReducer from './store/gameSlice';
import mainReducer from './store/mainSlice';
import timerReducer from './store/timerSlice';
import pregameReducer from './store/pregameSlice';

export default configureStore({
    reducer: {
        counter: counterReducer,
        game: gameReducer,
        main: mainReducer,
        timer: timerReducer,
        pregame: pregameReducer
    },
});
