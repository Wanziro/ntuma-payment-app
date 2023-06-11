import {IAction, IPayment} from '../../interfaces';
import {app} from '../constants/app';
import {returnErroMessage, setHeaders} from '../helpers';
import axios from 'axios';

export const SET_AGENTS_PAYMENT_LIST = 'SET_AGENTS_PAYMENT_LIST';
export const SET_ADD_AGENTS_PAYMENT_LIST = 'SET_ADD_AGENTS_PAYMENT_LIST';
export const SET_DELETE_AGENTS_PAYMENT_LIST = 'SET_DELETE_AGENTS_PAYMENT_LIST';
export const SET_IS_LOADING_AGENTS_PAYMENT_LIST =
  'SET_IS_LOADING_AGENTS_PAYMENT_LIST';
export const SET_LOADING_AGENTS_PAYMENT_LIST_ERROR =
  'SET_LOADING_AGENTS_PAYMENT_LIST_ERROR';
export const SET_IS_HARD_RELOADING_AGENTS_PAYMENT_LIST =
  'SET_IS_HARD_RELOADING_AGENTS_PAYMENT_LIST';
export const RESET_AGENTS_PAYMENT_LIST = 'RESET_AGENTS_PAYMENT_LIST';

export const setAgentsPaymentList = (payments: IPayment[]): IAction => ({
  type: SET_AGENTS_PAYMENT_LIST,
  payload: payments,
});

export const addAgentsPaymentList = (payment: IPayment): IAction => ({
  type: SET_ADD_AGENTS_PAYMENT_LIST,
  payload: payment,
});

export const deleteAgentsPaymentList = (payment: IPayment): IAction => ({
  type: SET_DELETE_AGENTS_PAYMENT_LIST,
  payload: payment,
});

export const setIsLoadingAgentsPaymentList = (
  trueOrFalse: boolean,
): IAction => ({
  type: SET_IS_LOADING_AGENTS_PAYMENT_LIST,
  payload: trueOrFalse,
});

export const setIsHardReLoadingAgentsPaymentList = (
  value: boolean,
): IAction => ({
  type: SET_IS_HARD_RELOADING_AGENTS_PAYMENT_LIST,
  payload: value,
});
export const setLoadingAgentsPaymentListError = (value: string): IAction => ({
  type: SET_LOADING_AGENTS_PAYMENT_LIST_ERROR,
  payload: value,
});

export const resetAgentsPaymentList = () => ({type: RESET_AGENTS_PAYMENT_LIST});

export const fetchAgentsPaymentList =
  (): any => (dispatch: any, getState: any) => {
    dispatch(setIsLoadingAgentsPaymentList(true));
    dispatch(setLoadingAgentsPaymentListError(''));
    const {user} = getState();
    axios
      .get(app.BACKEND_URL + '/agentswallet/all', setHeaders(user.token))
      .then(res => {
        dispatch(setIsLoadingAgentsPaymentList(false));
        dispatch(setIsHardReLoadingAgentsPaymentList(false));
        dispatch(setAgentsPaymentList(res.data.transactions));
      })
      .catch(error => {
        const err = returnErroMessage(error);
        dispatch(setIsLoadingAgentsPaymentList(false));
        dispatch(setIsHardReLoadingAgentsPaymentList(false));
        // errorHandler(error);
        dispatch(setLoadingAgentsPaymentListError(err));
      });
  };
