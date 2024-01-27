import React, { useState } from 'react';

// react native
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// components
import PageContainer from '../components/PageContainer';
import SignUpForm from '../components/SignUpForm';
import SignInForm from '../components/SingInForm';

// assets & utils
import logo from '../assets/images/logo.png';
import colors from '../utils/colors';

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <SafeAreaView style={styles.safearea}>
      <PageContainer>
        <ScrollView>
          <KeyboardAvoidingView
            style={styles.keyboardAvoiding}
            behavior={Platform.OS === 'ios' ? 'height' : undefined}
            keyboardVerticalOffset={100}
          >
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={logo} />
            </View>

            {isSignUp ? <SignUpForm /> : <SignInForm />}

            <TouchableOpacity
              onPress={() => setIsSignUp(!isSignUp)}
              style={styles.linkContainer}
            >
              {isSignUp ? (
                <Text style={styles.link}>
                  Already have an account? Sign in!
                </Text>
              ) : (
                <Text style={styles.link}>
                  Don't have an account? Create one!
                </Text>
              )}
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </PageContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '50%',
    resizeMode: 'contain',
  },
  linkContainer: {
    marginVertical: 15,
    marginLeft: 10,
  },
  link: {
    color: colors.darkGrey,
  },
});

export default AuthScreen;
