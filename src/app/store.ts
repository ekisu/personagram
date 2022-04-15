import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import airgramReducer from '../features/airgram/airgramSlice';
import authenticatedViewReducer from '../features/authenticated_view/authenticatedViewSlice';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    airgram: airgramReducer,
    counter: counterReducer,
    authenticatedView: authenticatedViewReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
