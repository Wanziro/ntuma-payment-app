import React, {useEffect} from 'react';
import {LogBox, SafeAreaView} from 'react-native';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import messaging from '@react-native-firebase/messaging';
import Navigation from './src/navigation';
import {store} from './src/store';
import {subscribeToSocket, unSubscribeToSocket} from './src/worker/socket';
import {saveAppToken, setFbToken} from './src/actions/user';
import PushNotification from 'react-native-push-notification';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const requestCloudMessagingNotificationPermissionFromUser = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    //get tokent
    const token = await messaging().getToken();
    console.log({token});
    if (token) {
      //subscribe to broadcast topic
      const subscription = await messaging().subscribeToTopic('broadcast');
      console.log({subscription});
      //save token to db
      store.dispatch(setFbToken(token));
      store.dispatch(saveAppToken());
    }
  }
};

function App(): JSX.Element {
  const {user}: any = store.getState();

  const createLocalPushNotificationChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'ntumaPaymentChannelId',
        channelName: 'ntumaPaymentChannel',
      },
      created => {
        console.log('channel created: ' + created);
      },
    );
  };

  useEffect(() => {
    subscribeToSocket(store);
    requestCloudMessagingNotificationPermissionFromUser();
    createLocalPushNotificationChannel();

    const fcmUnsubscribe = messaging().onMessage(async remoteMessage => {
      // console.log({remoteMessage});
      if (remoteMessage.notification?.body) {
        PushNotification.localNotification({
          channelId: 'ntumaPaymentChannelId',
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body,
        });
      }
    });

    // window.addEventListener("online", handleOnline);
    // window.addEventListener("offline", handleOffline);

    return () => {
      unSubscribeToSocket();
      fcmUnsubscribe();
      // window.removeEventListener("online", handleOnline);
      // window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    let sub = true;
    if (sub) {
      store.dispatch(saveAppToken());
    }
    return () => {
      sub = false;
    };
  }, [user.fbToken]);

  return (
    <AlertNotificationRoot theme="dark">
      <Navigation />
    </AlertNotificationRoot>
  );
}

export default App;
