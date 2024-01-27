import React, { useCallback, useEffect, useReducer, useState } from 'react';

// react native imports
import { ActivityIndicator, Alert } from 'react-native';

// expo
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

// redux
import { useDispatch, useSelector } from 'react-redux';

// components
import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';

// utils
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducer';
import { signUp } from '../utils/actions/authActions';
import colors from '../utils/colors';

const initialState = {
  inputValues: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  },
  inputValidities: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignUpForm = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert('Problem signing up', error, [{ text: 'Try again' }]);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    try {
      setLoading(true);
      const action = signUp(
        formState.inputValues.firstName,
        formState.inputValues.lastName,
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
        id='firstName'
        label='First name'
        icon='user-o'
        iconPack={FontAwesome}
        iconSize={20}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['firstName']}
      />
      <Input
        id='lastName'
        label='Last name'
        icon='house-user'
        iconPack={FontAwesome5}
        iconSize={18}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['lastName']}
      />
      <Input
        id='email'
        label='Email'
        autoCapitalize='none'
        keyboardType='email-address'
        icon='mail'
        iconPack={Feather}
        iconSize={20}
        onInputChanged={inputChangedHandler}
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
          title='Sign up'
          disabled={!formState.formIsValid}
          onPress={authHandler}
          style={{ marginTop: 20 }}
        />
      )}
    </>
  );
};

export default SignUpForm;
