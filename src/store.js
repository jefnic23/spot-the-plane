import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './store/counterSlice';
import gameReducer from './store/gameSlice';
import mainReducer from './store/mainSlice';
import resultsReducer from './store/resultsSlice';
import timerReducer from './store/timerSlice';
import pregameReducer from './store/pregameSlice';
import quoteReducer from './store/quoteSlice';

export default configureStore({
    reducer: {
        counter: counterReducer,
        game: gameReducer,
        main: mainReducer,
        results: resultsReducer,
        timer: timerReducer,
        pregame: pregameReducer,
        quote: quoteReducer
    },
});
