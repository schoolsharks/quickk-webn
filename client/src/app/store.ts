import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import bidingReducer from '../features/biding/service/bidingSlice';
import onboardingReducer from '../features/onboarding/api/onboardingSlice';
import { api } from './api';
// import errorMiddleware from './middleware/errorMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    biding: bidingReducer,
    onboarding : onboardingReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      // .concat(errorMiddleware),
});

// Enable refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;