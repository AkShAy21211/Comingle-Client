import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; 
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer ,FLUSH,REGISTER,REHYDRATE,PAUSE,PURGE,PERSIST} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: storage,

};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck:false
    }),
});

export type RootState = ReturnType<typeof store.getState>;


export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default  store 
