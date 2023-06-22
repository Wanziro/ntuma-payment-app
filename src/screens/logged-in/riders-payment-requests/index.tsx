import {View, Text, ScrollView, RefreshControl, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';

import {fetchClients} from '../../../actions/clients';
import {fetchMarkets} from '../../../actions/markets';
import {APP_COLORS} from '../../../constants/colors';
import CustomAlert from '../../../components/custom-alert';
import {commonInput, viewFlexCenter} from '../../../constants/styles';
import FastImage from 'react-native-fast-image';
import Loader from './loader';
import PaymentItem from './item';
import {
  INavigationProp,
  INavigationPropWithRouteRequired,
  IPayment,
  IPaymentListReducer,
  IRidersPaymentListReducer,
  PAYMENT_STATUS_ENUM,
  TOAST_MESSAGE_TYPES,
  WALLET_DEPOSIT_WITHDRAW_ENUM,
} from '../../../../interfaces';
import {errorHandler, setHeaders, toastMessage} from '../../../helpers';
import axios from 'axios';
import {app} from '../../../constants/app';
import FullPageLoader from '../../../components/full-page-loader';
import NotFound from '../../../components/not-found';
import DocumentPicker from 'react-native-document-picker';
import {
  fetchRidersPaymentList,
  setIsHardReLoadingRidersPaymentList,
} from '../../../actions/riders';
import {useFocusEffect} from '@react-navigation/native';
import {APPROVE_TYPES} from '../preview';

const RidersPaymentRequests = ({
  navigation,
  route,
}: INavigationPropWithRouteRequired) => {
  const dispatch = useDispatch();
  const {payments, isLoading, hardReloading, loadingError} = useSelector(
    (state: RootState) => state.riders as IRidersPaymentListReducer,
  );
  const {token} = useSelector((state: RootState) => state.user);
  const [showLoader, setShowLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<undefined | IPayment>(
    undefined,
  );
  const [reason, setReason] = useState('');
  useEffect(() => {
    let sub = true;
    if (sub) {
      loadingError.trim().length > 0 &&
        // &&  payments.length === 0
        setShowAlert(true);
    }
    return () => {
      sub = false;
    };
  }, [loadingError]);

  useEffect(() => {
    let sub = true;
    if (sub) {
      !isLoading && refreshing && setRefreshing(false);
    }
    return () => {
      sub = false;
    };
  }, [isLoading]);

  // useEffect(() => {
  //   dispatch(fetchRidersPaymentList());
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchRidersPaymentList());
    }, [route.name]),
  );

  const alertCallBack = () => {
    setShowAlert(false);
    dispatch(setIsHardReLoadingRidersPaymentList(true));
    dispatch(fetchRidersPaymentList());
    // dispatch(fetchClients());
    // dispatch(fetchMarkets());
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(setIsHardReLoadingRidersPaymentList(true));
    dispatch(fetchRidersPaymentList());
    // dispatch(fetchClients());
    // dispatch(fetchMarkets());
  };

  const handleRejectPayment = () => {
    if (selectedPayment === undefined) {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, 'Choose payment please');
      return;
    }
    if (reason.trim() === '') {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, 'Please enter rejection reason');
      return;
    }
    setShowAlert(false);
    setShowReject(false);
    setShowLoader(true);
    axios
      .post(
        app.BACKEND_URL + '/riderswallet/reject/',
        {...selectedPayment, reason},
        setHeaders(token),
      )
      .then(res => {
        toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
        setShowLoader(false);
        dispatch(fetchRidersPaymentList());
      })
      .catch(error => {
        setShowLoader(false);
        errorHandler(error);
      });
  };

  const handleDocumentSelect = async (selectedItem: IPayment) => {
    try {
      const results = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
        allowMultiSelection: false,
      });
      //   setState({...state, idNumberDocument: results as any});
      navigation.navigate('Preview', {
        file: results,
        selectedPayment,
        type: APPROVE_TYPES.RIDERS,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: APP_COLORS.WHITE}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{padding: 10, flex: 1}}>
          {isLoading ? (
            <Loader />
          ) : payments.filter(
              item =>
                item.paymentStatus === PAYMENT_STATUS_ENUM.PENDING &&
                item.transactionType === WALLET_DEPOSIT_WITHDRAW_ENUM.WITHDRAW,
            ).length > 0 ? (
            payments
              .filter(
                item =>
                  item.paymentStatus === PAYMENT_STATUS_ENUM.PENDING &&
                  item.transactionType ===
                    WALLET_DEPOSIT_WITHDRAW_ENUM.WITHDRAW,
              )
              .map((item, index) => (
                <PaymentItem
                  item={item}
                  key={index}
                  setSelectedPayment={setSelectedPayment}
                  handleDocumentSelect={handleDocumentSelect}
                  setShowReject={setShowReject}
                  setReason={setReason}
                />
              ))
          ) : (
            <NotFound title="No requests currently found." />
          )}
        </View>
      </ScrollView>
      <CustomAlert
        showAlert={showReject}
        setShowAlert={setShowReject}
        confirmationTitle="Reject"
        callBack={handleRejectPayment}>
        <Text
          style={{
            color: APP_COLORS.MAROON,
            textAlign: 'center',
            fontWeight: '600',
          }}>
          Confirmation
        </Text>
        <TextInput
          style={[commonInput, {maxHeight: 200}]}
          placeholder="Enter rejection reason"
          multiline={true}
          onChangeText={text => setReason(text)}
          value={reason}
        />
      </CustomAlert>
      <CustomAlert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        confirmationTitle="Try Again"
        callBack={alertCallBack}>
        <View style={[viewFlexCenter]}>
          <FastImage
            source={require('../../../assets/error-black.gif')}
            style={{width: 120, height: 120}}
          />
          <Text
            style={{
              color: APP_COLORS.MAROON,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Something Went Wrong
          </Text>
          <Text style={{color: APP_COLORS.TEXT_GRAY}}>{loadingError}</Text>
        </View>
      </CustomAlert>
      <FullPageLoader isLoading={showLoader} />
    </View>
  );
};

export default RidersPaymentRequests;
