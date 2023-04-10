import {combineReducers} from 'redux';
import user from './user';
import markets from './markets';
import systemfees from './systemFees';
const rootReducer = combineReducers({
  user,
  markets,
  systemfees,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
