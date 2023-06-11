import {
  IAction,
  IPayment,
  IPaymentListReducer,
  IRidersPaymentListReducer,
} from '../../interfaces';
import {
  SET_ADD_RIDERS_PAYMENT_LIST,
  SET_RIDERS_PAYMENT_LIST,
  SET_IS_LOADING_RIDERS_PAYMENT_LIST,
  RESET_RIDERS_PAYMENT_LIST,
  SET_DELETE_RIDERS_PAYMENT_LIST,
  SET_IS_HARD_RELOADING_RIDERS_PAYMENT_LIST,
  SET_LOADING_RIDERS_PAYMENT_LIST_ERROR,
} from '../actions/riders';

const initialState: IRidersPaymentListReducer = {
  isLoading: false,
  payments: [],
  hardReloading: false,
  loadingError: '',
};

const user = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SET_RIDERS_PAYMENT_LIST:
      return {...state, payments: action.payload};
    case SET_ADD_RIDERS_PAYMENT_LIST:
      return {
        ...state,
        payments: [action.payload, ...state.payments],
      };
    case SET_DELETE_RIDERS_PAYMENT_LIST:
      return {
        ...state,
        payments: state.payments.filter(item => item.id != action.payload.id),
      };
    case SET_IS_LOADING_RIDERS_PAYMENT_LIST:
      return {...state, isLoading: action.payload as boolean};
    case SET_IS_HARD_RELOADING_RIDERS_PAYMENT_LIST:
      return {...state, hardReloading: action.payload as boolean};
    case SET_LOADING_RIDERS_PAYMENT_LIST_ERROR:
      return {...state, loadingError: action.payload as string};
    case RESET_RIDERS_PAYMENT_LIST:
      return initialState;
    default:
      return state;
  }
};

export default user;
