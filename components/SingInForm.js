import React, { useCallback, useEffect, useReducer, useState } from 'react';

// react native imports
import { ActivityIndicator, Alert } from 'react-native';

// expo
import { Feather } from '@expo/vector-icons';

// redux
import { useDispatch } from 'react-redux';

// components
import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';

// utils
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducer';
import { signIn } from '../utils/actions/authActions';
import colors from '../utils/colors';

const testMode = true;

const initialState = {
  inputValues: {
    email: !testMode ? '' : '2nikolar1@gmail.com',
    password: !testMode ? '' : 'password',
  },
  inputValidities: {
    email: testMode,
    password: testMode,
  },
  formIsValid: !testMode ? false : true,
};

const SignInForm = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert('Problem signing in', error, [{ text: 'Try again' }]);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    try {
      setLoading(true);
      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      );
      setError(null);
      await dispatch(action);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  }, [dispatch, formState]);

  return (
    <>
      <Input
        id='email'
        label='Email'
        autoCapitalize='none'
        keyboardType='email-address'
        icon='mail'
        iconPack={Feather}
        iconSize={20}
        onInputChanged={inputChangedHandler}
        initialValue={formState.inputValues.email}
        errorText={formState.inputValidities['email']}
      />
      <Input
        id='password'
        label='Password'
        autoCapitalize='none'
        secureTextEntry
        icon='lock'
        iconPack={Feather}
        iconSize={20}
        onInputChanged={inputChangedHandler}
        initialValue={formState.inputValues.password}
        errorText={formState.inputValidities['password']}
      />
      {loading ? (
        <ActivityIndicator
          size={'small'}
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      ) : (
        <SubmitButton
          title='Sign in'
          disabled={!formState.formIsValid}
          onPress={authHandler}
          style={{ marginTop: 20 }}
        />
      )}
    </>
  );
};

export default SignInForm;
