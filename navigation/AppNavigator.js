import React from 'react';

// react navigation
import { NavigationContainer } from '@react-navigation/native';

// redux
import { useSelector } from 'react-redux';

// navigators
import MainNavigator from './MainNavigator';

// screens
import AuthScreen from '../screens/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';

const AppNavigator = () => {
  const isAuth = useSelector(
    (state) => state.auth.token !== null && state.auth.token !== ''
  );
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  return (
    <NavigationContainer>
      {isAuth && <MainNavigator />}
      {!isAuth && didTryAutoLogin && <AuthScreen />}
      {!isAuth && !didTryAutoLogin && <StartUpScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
