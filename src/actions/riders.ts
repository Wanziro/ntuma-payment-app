import {IAction, IRidersPayment} from '../../interfaces';
import {app} from '../constants/app';
import {returnErroMessage, setHeaders} from '../helpers';
import axios from 'axios';

export const SET_RIDERS_PAYMENT_LIST = 'SET_RIDERS_PAYMENT_LIST';
export const SET_ADD_RIDERS_PAYMENT_LIST = 'SET_ADD_RIDERS_PAYMENT_LIST';
export const SET_DELETE_RIDERS_PAYMENT_LIST = 'SET_DELETE_RIDERS_PAYMENT_LIST';
export const SET_IS_LOADING_RIDERS_PAYMENT_LIST =
  'SET_IS_LOADING_RIDERS_PAYMENT_LIST';
export const SET_LOADING_RIDERS_PAYMENT_LIST_ERROR =
  'SET_LOADING_RIDERS_PAYMENT_LIST_ERROR';
export const SET_IS_HARD_RELOADING_RIDERS_PAYMENT_LIST =
  'SET_IS_HARD_RELOADING_RIDERS_PAYMENT_LIST';
export const RESET_RIDERS_PAYMENT_LIST = 'RESET_RIDERS_PAYMENT_LIST';

export const setRidersPaymentList = (payments: IRidersPayment[]): IAction => ({
  type: SET_RIDERS_PAYMENT_LIST,
  payload: payments,
});

export const addRidersPaymentList = (payment: IRidersPayment): IAction => ({
  type: SET_ADD_RIDERS_PAYMENT_LIST,
  payload: payment,
});

export const deleteRidersPaymentList = (payment: IRidersPayment): IAction => ({
  type: SET_DELETE_RIDERS_PAYMENT_LIST,
  payload: payment,
});

export const setIsLoadingRidersPaymentList = (
  trueOrFalse: boolean,
): IAction => ({
  type: SET_IS_LOADING_RIDERS_PAYMENT_LIST,
  payload: trueOrFalse,
});

export const setIsHardReLoadingRidersPaymentList = (
  value: boolean,
): IAction => ({
  type: SET_IS_HARD_RELOADING_RIDERS_PAYMENT_LIST,
  payload: value,
});
export const setLoadingRidersPaymentListError = (value: string): IAction => ({
  type: SET_LOADING_RIDERS_PAYMENT_LIST_ERROR,
  payload: value,
});

export const resetRidersPaymentList = () => ({type: RESET_RIDERS_PAYMENT_LIST});

export const fetchRidersPaymentList =
  (): any => (dispatch: any, getState: any) => {
    dispatch(setIsLoadingRidersPaymentList(true));
    dispatch(setLoadingRidersPaymentListError(''));
    const {user} = getState();
    axios
      .get(app.BACKEND_URL + '/riderswallet/all', setHeaders(user.token))
      .then(res => {
        dispatch(setIsLoadingRidersPaymentList(false));
        dispatch(setIsHardReLoadingRidersPaymentList(false));
        dispatch(setRidersPaymentList(res.data.transactions));
      })
      .catch(error => {
        const err = returnErroMessage(error);
        dispatch(setIsLoadingRidersPaymentList(false));
        dispatch(setIsHardReLoadingRidersPaymentList(false));
        // errorHandler(error);
        dispatch(setLoadingRidersPaymentListError(err));
      });
  };
