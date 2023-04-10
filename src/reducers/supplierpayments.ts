import {IAction, IPayment, IPaymentListReducer} from '../../interfaces';
import {
  SET_ADD_PAYMENT_LIST,
  SET_PAYMENT_LIST,
  SET_IS_LOADING_PAYMENT_LIST,
  RESET_PAYMENT_LIST,
  SET_DELETE_PAYMENT_LIST,
  SET_IS_HARD_RELOADING_PAYMENT_LIST,
  SET_LOADING_PAYMENT_LIST_ERROR,
} from '../actions/supplierpayments';

const initialState: IPaymentListReducer = {
  isLoading: false,
  payments: [],
  hardReloading: false,
  loadingError: '',
};

const user = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SET_PAYMENT_LIST:
      return {...state, payments: action.payload as IPayment[]};
    case SET_ADD_PAYMENT_LIST:
      return {
        ...state,
        payments: [action.payload, ...state.payments] as IPayment[],
      };
    case SET_DELETE_PAYMENT_LIST:
      return {
        ...state,
        payments: state.payments.filter(
          item => item.id != action.payload.id,
        ) as IPayment[],
      };
    case SET_IS_LOADING_PAYMENT_LIST:
      return {...state, isLoading: action.payload as boolean};
    case SET_IS_HARD_RELOADING_PAYMENT_LIST:
      return {...state, hardReloading: action.payload as boolean};
    case SET_LOADING_PAYMENT_LIST_ERROR:
      return {...state, loadingError: action.payload as string};
    case RESET_PAYMENT_LIST:
      return initialState;
    default:
      return state;
  }
};

export default user;
