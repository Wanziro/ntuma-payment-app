import {
  View,
  Text,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {
  INavigationPropWithRouteRequired,
  IPayment,
  TOAST_MESSAGE_TYPES,
} from '../../../../interfaces';
import {APP_COLORS} from '../../../constants/colors';
import ImageLoader from '../../../components/image-loader';
import {viewFlexCenter, viewFlexSpace} from '../../../constants/styles';
import Icon from 'react-native-vector-icons/AntDesign';
import {toastMessage} from '../../../helpers';
import {app} from '../../../constants/app';
import {useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import FullPageLoader from '../../../components/full-page-loader';
const {width, height} = Dimensions.get('window');

const Preview = ({route, navigation}: INavigationPropWithRouteRequired) => {
  const {token} = useSelector((state: RootState) => state.user);
  const {file, selectedPayment} = route.params as {
    file: {uri: string; type: string; name: string};
    selectedPayment: IPayment;
  };
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', selectedPayment.id);
      setIsLoading(true);
      const url = app.BACKEND_URL + '/suppliers/pay';
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.onload = function () {
        setIsLoading(false);
        try {
          const response = JSON.parse(xhr.response);
          if (xhr.status === 200) {
            setIsLoading(false);
            toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, response.msg);
            navigation.goBack();
          } else {
            toastMessage(TOAST_MESSAGE_TYPES.ERROR, response.msg);
          }
        } catch (error) {
          toastMessage(TOAST_MESSAGE_TYPES.ERROR, xhr.response);
        }
      };
      xhr.setRequestHeader('token', token);
      xhr.send(formData);
    } catch (error: any) {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, error.message);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: APP_COLORS.MAROON,
        position: 'relative',
      }}>
      <ImageLoader
        url={file.uri}
        height={height / 2 + 100}
        width={width}
        showLoader={true}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          width,
          zIndex: 2,
        }}>
        <View
          style={[
            viewFlexSpace,
            {
              padding: 10,
              paddingBottom: 20,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            },
          ]}>
          <Pressable
            style={{marginLeft: 10, opacity: isLoading ? 0.5 : 1}}
            onPress={() => handleSendMessage()}
            disabled={isLoading}>
            <View
              style={[
                viewFlexCenter,
                {
                  backgroundColor: APP_COLORS.MAROON,
                  borderRadius: 100,
                  padding: 10,
                },
              ]}>
              {isLoading ? (
                <ActivityIndicator size={20} color={APP_COLORS.WHITE} />
              ) : (
                <View style={[viewFlexSpace, {paddingHorizontal: 10}]}>
                  <Icon name="check" size={20} color={APP_COLORS.WHITE} />
                  <Text style={{color: APP_COLORS.WHITE, marginLeft: 10}}>
                    Approve
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </View>
      <FullPageLoader isLoading={isLoading} />
    </View>
  );
};

export default Preview;
