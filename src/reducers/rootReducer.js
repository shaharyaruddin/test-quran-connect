import { combineReducers } from 'redux';
import apiSlice from './apiSlice';

const rootReducer = combineReducers({
  api: apiSlice,
});

export default rootReducer;