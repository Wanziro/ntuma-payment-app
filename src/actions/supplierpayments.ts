import {IAction, IPayment} from '../../interfaces';
import {app} from '../constants/app';
import {returnErroMessage, setHeaders} from '../helpers';
import axios from 'axios';

export const SET_PAYMENT_LIST = 'SET_PAYMENT_LIST';
export const SET_ADD_PAYMENT_LIST = 'SET_ADD_PAYMENT_LIST';
export const SET_DELETE_PAYMENT_LIST = 'SET_DELETE_PAYMENT_LIST';
export const SET_IS_LOADING_PAYMENT_LIST = 'SET_IS_LOADING_PAYMENT_LIST';
export const SET_LOADING_PAYMENT_LIST_ERROR = 'SET_LOADING_PAYMENT_LIST_ERROR';
export const SET_IS_HARD_RELOADING_PAYMENT_LIST =
  'SET_IS_HARD_RELOADING_PAYMENT_LIST';
export const RESET_PAYMENT_LIST = 'RESET_PAYMENT_LIST';

export const setPaymentList = (payments: IPayment[]): IAction => ({
  type: SET_PAYMENT_LIST,
  payload: payments,
});

export const addPaymentList = (payment: IPayment): IAction => ({
  type: SET_ADD_PAYMENT_LIST,
  payload: payment,
});

export const deletePaymentList = (payment: IPayment): IAction => ({
  type: SET_DELETE_PAYMENT_LIST,
  payload: payment,
});

export const setIsLoadingPaymentList = (trueOrFalse: boolean): IAction => ({
  type: SET_IS_LOADING_PAYMENT_LIST,
  payload: trueOrFalse,
});

export const setIsHardReLoadingPaymentList = (value: boolean): IAction => ({
  type: SET_IS_HARD_RELOADING_PAYMENT_LIST,
  payload: value,
});
export const setLoadingPaymentListError = (value: string): IAction => ({
  type: SET_LOADING_PAYMENT_LIST_ERROR,
  payload: value,
});

export const resetPaymentList = () => ({type: RESET_PAYMENT_LIST});

export const fetchPaymentList = (): any => (dispatch: any, getState: any) => {
  dispatch(setIsLoadingPaymentList(true));
  dispatch(setLoadingPaymentListError(''));
  const {user} = getState();
  axios
    .get(app.BACKEND_URL + '/suppliers/all/app', setHeaders(user.token))
    .then(res => {
      dispatch(setIsLoadingPaymentList(false));
      dispatch(setIsHardReLoadingPaymentList(false));
      dispatch(setPaymentList(res.data.paymentDetails));
    })
    .catch(error => {
      const err = returnErroMessage(error);
      dispatch(setIsLoadingPaymentList(false));
      dispatch(setIsHardReLoadingPaymentList(false));
      // errorHandler(error);
      dispatch(setLoadingPaymentListError(err));
    });
};
