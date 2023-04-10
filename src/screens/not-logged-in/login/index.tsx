import {
  View,
  Text,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {APP_COLORS} from '../../../constants/colors';
import {
  btnWithBgContainerStyles,
  btnWithBgTextStyles,
  btnWithoutBgContainerStyles,
  btnWithoutBgTextStyles,
  commonInput,
  viewFlexCenter,
  viewFlexSpace,
} from '../../../constants/styles';
import {INavigationProp, TOAST_MESSAGE_TYPES} from '../../../../interfaces';
import {errorHandler, returnErroMessage, toastMessage} from '../../../helpers';
import axios from 'axios';
import {app} from '../../../constants/app';
import {useDispatch} from 'react-redux';
import {
  saveAppToken,
  setUserEmail,
  setUserId,
  setUserImage,
  setUserNames,
  setUserPhone,
  setUserRole,
  setUserToken,
  setUserWalletAmount,
} from '../../../actions/user';
import FullPageLoader from '../../../components/full-page-loader';
import CustomErrorAlert from '../../../components/custom-error-alert';

const {height} = Dimensions.get('window');
const initialState = {
  app: true,
  emailOrPhone: '',
  password: '',
};
const Login = ({navigation}: INavigationProp) => {
  const dispatch = useDispatch();
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (state.emailOrPhone.trim() === '' || state.password.trim() === '') {
      toastMessage(TOAST_MESSAGE_TYPES.ERROR, 'All fields are required');
      return;
    }
    setIsLoading(true);
    axios
      .post(app.BACKEND_URL + '/users/login/', {...state})
      .then(res => {
        setIsLoading(false);
        const {role, walletAmounts, userId, names, phone, image, email, token} =
          res.data;
        if (role === 'admin') {
          dispatch(setUserNames(names));
          dispatch(setUserRole(role));
          dispatch(setUserWalletAmount(walletAmounts));
          dispatch(setUserId(userId));
          dispatch(setUserPhone(phone));
          dispatch(setUserEmail(email));
          dispatch(setUserImage(image));
          dispatch(setUserToken(token));
          toastMessage(TOAST_MESSAGE_TYPES.SUCCESS, res.data.msg);
          setTimeout(() => {
            dispatch(saveAppToken());
          }, 1000);
        } else {
          setState(initialState);
        }
      })
      .catch(error => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  return (
    <KeyboardAvoidingView style={{flex: 1, height: '100%'}}>
      <View style={{flex: 1, backgroundColor: APP_COLORS.WHITE}}>
        <View style={[viewFlexSpace, {alignItems: 'flex-start'}]}>
          <Image
            source={require('../../../assets/imigongo.png')}
            style={{width: 10, height}}
          />
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={{padding: 10, flex: 1}}>
              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: APP_COLORS.TEXT_GRAY,
                    fontWeight: '600',
                    fontSize: 16,
                  }}>
                  Email Address
                </Text>
                <TextInput
                  placeholder="Enter your email address"
                  style={commonInput}
                  onChangeText={text =>
                    setState({...state, emailOrPhone: text})
                  }
                />
              </View>
              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: APP_COLORS.TEXT_GRAY,
                    fontWeight: '600',
                    fontSize: 16,
                  }}>
                  Password
                </Text>
                <TextInput
                  secureTextEntry={true}
                  placeholder="Enter your password"
                  style={commonInput}
                  onChangeText={text => setState({...state, password: text})}
                />
              </View>

              <Pressable
                disabled={isLoading}
                style={{marginVertical: 10}}
                onPress={() => handleSubmit()}>
                <View style={[btnWithBgContainerStyles]}>
                  {isLoading && (
                    <ActivityIndicator
                      color={APP_COLORS.WHITE}
                      style={{marginRight: 10}}
                    />
                  )}
                  <Text style={[btnWithBgTextStyles]}>Sign in</Text>
                </View>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
      <FullPageLoader isLoading={isLoading} />
    </KeyboardAvoidingView>
  );
};

export default Login;
