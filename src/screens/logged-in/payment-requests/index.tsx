import {View, Text, ScrollView, RefreshControl} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {
  fetchPaymentList,
  setIsHardReLoadingPaymentList,
} from '../../../actions/supplierpayments';
import {fetchClients} from '../../../actions/clients';
import {fetchMarkets} from '../../../actions/markets';
import {APP_COLORS} from '../../../constants/colors';
import CustomAlert from '../../../components/custom-alert';
import {viewFlexCenter} from '../../../constants/styles';
import FastImage from 'react-native-fast-image';
import Loader from './loader';
import PaymentItem from './item';

const PaymentRequests = () => {
  const dispatch = useDispatch();
  const {payments, isLoading, hardReloading, loadingError} = useSelector(
    (state: RootState) => state.paymentList,
  );
  const [showLoader, setShowLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    let sub = true;
    if (sub) {
      loadingError.trim().length > 0 &&
        payments.length === 0 &&
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

  const alertCallBack = () => {
    setShowAlert(false);
    dispatch(setIsHardReLoadingPaymentList(true));
    dispatch(fetchPaymentList());
    dispatch(fetchClients());
    dispatch(fetchMarkets());
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(setIsHardReLoadingPaymentList(true));
    dispatch(fetchPaymentList());
    dispatch(fetchClients());
    dispatch(fetchMarkets());
  };
  return (
    <View style={{flex: 1, backgroundColor: APP_COLORS.WHITE}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{padding: 10}}>
          {isLoading ? (
            <Loader />
          ) : (
            payments.map((item, index) => (
              <PaymentItem item={item} key={index} />
            ))
          )}
        </View>
      </ScrollView>
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
    </View>
  );
};

export default PaymentRequests;
