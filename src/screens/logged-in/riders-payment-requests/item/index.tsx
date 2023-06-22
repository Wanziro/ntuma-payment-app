import {View, Text, Linking, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  IAgentsPayment,
  IClient,
  IMarket,
  IPayment,
  IRidersPayment,
} from '../../../../../interfaces';
import WhiteCard from '../../../../components/white-card';
import {viewFlexCenter, viewFlexSpace} from '../../../../constants/styles';
import {APP_COLORS} from '../../../../constants/colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import {currencyFormatter, errorHandler} from '../../../../helpers';
import TimeAgo from '@andordavoti/react-native-timeago';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
interface IPaymentItemProps {
  item: IRidersPayment;
  setSelectedPayment: any;
  setShowReject: any;
  setReason: any;
  handleDocumentSelect: any;
}
const PaymentItem = ({
  item,
  setSelectedPayment,
  handleDocumentSelect,
  setShowReject,
  setReason,
}: IPaymentItemProps) => {
  const {clients} = useSelector((state: RootState) => state.clients);
  const {markets} = useSelector((state: RootState) => state.markets);
  const [market, setMarket] = useState<IMarket | undefined>(undefined);
  const [agent, setAgent] = useState<IClient | undefined>(undefined);

  const handlePay = (amount: number, momoCode: number) => {
    try {
      const money = parseInt(amount as any);
      const ussdCode = `*182*8*1*${momoCode}*${money}#`;
      const encodedUssdCode = encodeURIComponent(ussdCode);
      Linking.openURL('tel:' + encodedUssdCode);
    } catch (error) {
      errorHandler(error);
    }
  };
  const handleCall = (phone: any) => {
    try {
      Linking.openURL('tel:' + phone);
    } catch (error) {
      errorHandler(error);
    }
  };

  // useEffect(() => {
  //   const agent = clients.find(i => i.agentId === item.agentId);
  //   const market = markets.find(i => i.mId === item.marketId);
  //   setAgent(agent);
  //   setMarket(market);
  // }, [item]);
  const handleReject = () => {
    setSelectedPayment(item);
    setReason('');
    setShowReject(true);
  };

  const handleApprove = () => {
    setSelectedPayment(item);
    handleDocumentSelect(item);
  };
  return (
    <WhiteCard style={{marginBottom: 15, padding: 10}}>
      <View style={[viewFlexSpace]}>
        <Text
          style={{
            color: APP_COLORS.TEXT_GRAY,
            flex: 1,
            marginRight: 10,
          }}>
          TXID:{item.id}
        </Text>
        <TimeAgo
          style={{color: APP_COLORS.BLACK, fontWeight: '700'}}
          dateTo={new Date(item.createdAt)}
        />
      </View>
      <View style={[viewFlexSpace]}>
        <Text
          style={{color: APP_COLORS.BLACK, fontWeight: '600', marginRight: 10}}>
          Rider
        </Text>
        <Text style={{color: APP_COLORS.TEXT_GRAY, textAlign: 'right'}}>
          {item.rider?.names}
        </Text>
      </View>
      <View style={[viewFlexSpace]}>
        <Text
          style={{color: APP_COLORS.BLACK, fontWeight: '600', marginRight: 10}}>
          MOMO CODE
        </Text>
        <Text style={{color: APP_COLORS.TEXT_GRAY, textAlign: 'right'}}>
          {item.rider?.momoCode}
        </Text>
      </View>
      <View style={[viewFlexSpace]}>
        <Text
          style={{color: APP_COLORS.BLACK, fontWeight: '600', marginRight: 10}}>
          AMOUNT
        </Text>
        <Text style={{color: APP_COLORS.TEXT_GRAY, textAlign: 'right'}}>
          {currencyFormatter(item.amount)} RWF
        </Text>
      </View>
      <View
        style={{
          marginTop: 10,
          borderTopColor: APP_COLORS.BORDER_COLOR,
          borderTopWidth: 1,
        }}>
        <View style={[viewFlexSpace, {paddingTop: 10}]}>
          <Pressable
            onPress={() =>
              handlePay(Number(item.amount), Number(item.rider?.momoCode))
            }>
            <View style={[viewFlexCenter]}>
              <Icon name="send-to-mobile" color={APP_COLORS.BLACK} size={20} />
              <Text style={{color: APP_COLORS.BLACK}}>Pay</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => handleCall(item.rider?.phone)}>
            <View style={[viewFlexCenter]}>
              <Icon name="call" color={APP_COLORS.BLACK} size={20} />
              <Text style={{color: APP_COLORS.BLACK}}>Call Rider</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => handleReject()}>
            <View style={[viewFlexCenter]}>
              <Icon2 name="close-circle" color={APP_COLORS.MAROON} size={20} />
              <Text style={{color: APP_COLORS.MAROON}}>Reject</Text>
            </View>
          </Pressable>

          <Pressable onPress={handleApprove}>
            <View style={[viewFlexCenter]}>
              <Icon2 name="check-circle" color={APP_COLORS.GREEN} size={20} />
              <Text style={{color: APP_COLORS.GREEN}}>Approve</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </WhiteCard>
  );
};

export default PaymentItem;
