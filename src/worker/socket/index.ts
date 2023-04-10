import {io} from 'socket.io-client';
import {
  EVENT_NAMES_ENUM,
  IMessage,
  INotificaton,
  IOrder,
  ISocketData,
  IWalletTransaction,
  USER_TYPE_ENUM,
} from '../../../interfaces';
import {app} from '../../constants/app';
import {
  addPaymentList,
  deletePaymentList,
} from '../../actions/supplierpayments';
import {Vibration} from 'react-native';

let mSocket: any = undefined;
let mStore: any = undefined;

export const subscribeToSocket = (store: any) => {
  mStore = store;
  if (mSocket !== undefined) {
    return;
  }

  const {user} = mStore.getState();

  mSocket = io(app.SOCKET_URL);
  mSocket.on('connect', () => {
    console.log('connected to socket');
  });
  emitSocket('addUser', {userType: 'admin', email: user.email});
  mSocket.on('NtumaEventNames', (data: ISocketData) => {
    // console.log(data);
    if (
      data.type !== undefined &&
      data.data !== undefined &&
      mStore !== undefined
    ) {
      dispatchBasicAppData(data, mStore);
    }
  });

  mSocket.on('disconnect', () => {
    console.log('disconnected from socket');
  });
  mSocket.on('connect_error', (err: any) => {
    // console.log(`socket connect_error due to ${err.message}`);
    // console.log(JSON.stringify(err));
  });
};

const dispatchBasicAppData = (data: ISocketData, store: any) => {
  //supplier payments
  if (data.type === EVENT_NAMES_ENUM.ADD_SUPPLIERS_PAYMENT_DETAILS) {
    store.dispatch(addPaymentList(data.data));
    Vibration.vibrate([500, 200, 500]);
  }
  if (data.type === EVENT_NAMES_ENUM.DELETE_SUPPLIERS_PAYMENT_DETAILS) {
    store.dispatch(deletePaymentList(data.data));
  }
};

export const unSubscribeToSocket = () => {
  mSocket !== undefined && mSocket.disconnect();
  console.log('Socket Disconnected');
};

export const emitSocket = (eventName: string, data: any) => {
  mSocket !== undefined && mSocket.emit(eventName, data);
};
