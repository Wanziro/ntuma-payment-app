import {combineReducers} from 'redux';
import user from './user';
import markets from './markets';
import systemfees from './systemFees';
import paymentList from './supplierpayments';
import clients from './clients';
const rootReducer = combineReducers({
  user,
  markets,
  systemfees,
  paymentList,
  clients,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
