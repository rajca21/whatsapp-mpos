// react imports
import { useCallback, useEffect, useState } from 'react';

// react native imports
import { LogBox, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';

// expo imports
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// redux
import { Provider } from 'react-redux';
import { store } from './store/store';

// navigators
import AppNavigator from './navigation/AppNavigator';

// force logout (testing purposes)
AsyncStorage.clear();
// ignoring warnings
LogBox.ignoreLogs(['Selector unknown returned a different result']);

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsLoaded, setAppIsLoaded] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          'black': require('./assets/fonts/Roboto-Black.ttf'),
          'blackItalic': require('./assets/fonts/Roboto-BlackItalic.ttf'),
          'bold': require('./assets/fonts/Roboto-Bold.ttf'),
          'boldItalic': require('./assets/fonts/Roboto-BoldItalic.ttf'),
          'italic': require('./assets/fonts/Roboto-Italic.ttf'),
          'light': require('./assets/fonts/Roboto-Light.ttf'),
          'lightItalic': require('./assets/fonts/Roboto-LightItalic.ttf'),
          'medium': require('./assets/fonts/Roboto-Medium.ttf'),
          'mediumItalic': require('./assets/fonts/Roboto-MediumItalic.ttf'),
          'regular': require('./assets/fonts/Roboto-Regular.ttf'),
          'thin': require('./assets/fonts/Roboto-Thin.ttf'),
          'thinItalic': require('./assets/fonts/Roboto-ThinItalic.ttf'),
        });
      } catch (err) {
        console.log(err);
      } finally {
        setAppIsLoaded(true);
      }
    };
    prepare();
  }, []);

  const onLayout = useCallback(async () => {
    if (appIsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsLoaded]);

  if (!appIsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider style={styles.container} onLayout={onLayout}>
        <MenuProvider>
          <AppNavigator />
        </MenuProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontFamily: 'black',
  },
});
