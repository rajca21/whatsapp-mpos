import React, { useEffect } from 'react';

// react native
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// redux
import { useDispatch } from 'react-redux';

// redux store
import { setDidTryAutoLogin } from '../store/authSlice';
import { authenticate } from '../store/authSlice';

// utils
import colors from '../utils/colors';
import commonStyles from '../utils/commonStyles';
import { getUserData } from '../utils/actions/userActions';

const StartUpScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const storedAuthInfo = await AsyncStorage.getItem('userData');

      if (!storedAuthInfo) {
        dispatch(setDidTryAutoLogin());
        return;
      }

      const parsedData = JSON.parse(storedAuthInfo);
      const { token, userId, expiryDate: expiryDateString } = parsedData;

      const expiryDate = new Date(expiryDateString);
      if (expiryDate <= new Date() || !token || !userId) {
        dispatch(setDidTryAutoLogin());
        return;
      }

      const userData = await getUserData(userId);
      dispatch(authenticate({ token, userData }));
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={commonStyles.center}>
      <ActivityIndicator size='large' color={colors.primary} />
    </View>
  );
};

export default StartUpScreen;
