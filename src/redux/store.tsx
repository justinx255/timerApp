// import {configureStore, combineReducers} from '@reduxjs/toolkit';
// import {reducers} from './mainreducers.tsx';

// const resetStoreActionType = 'main/resetStore';

// const combinedReducer = combineReducers(reducers);
// export const rootReducer = (state: any, action: any) => {
//   // when a logout action is dispatched it will reset redux state
//   if (action.type === resetStoreActionType) {
//     // eslint-disable-next-line
//     state = undefined;
//   }
//   return combinedReducer(state, action);
// };

// const store = configureStore({
//   reducer: rootReducer,
// });

// export const resetStore = () => {
//   store.dispatch({type: resetStoreActionType});
// };

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// export type AppStore = typeof store;
// export default store;

import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {reducers} from './mainreducers.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';

const resetStoreActionType = 'main/resetStore';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['timers'], 
};

const combinedReducer = combineReducers(reducers);

export const rootReducer = (state: any, action: any) => {
  if (action.type === resetStoreActionType) {
    state = undefined;
  }
  return combinedReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);

export const resetStore = () => {
  store.dispatch({type: resetStoreActionType});
  persistor.purge();
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export default store;
