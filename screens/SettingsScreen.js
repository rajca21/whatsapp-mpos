import React, { useCallback, useMemo, useReducer, useState } from 'react';

// react native
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// expo
import {
  FontAwesome,
  FontAwesome5,
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

// redux
import { useDispatch, useSelector } from 'react-redux';

// redux store
import { updateLoggedInUserData } from '../store/authSlice';

// components
import PageTitle from '../components/PageTitle';
import PageContainer from '../components/PageContainer';
import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';
import ProfileImage from '../components/ProfileImage';
import DataItem from '../components/DataItem';

// utils
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducer';
import colors from '../utils/colors';
import {
  updateSignedInUserData,
  userLogout,
} from '../utils/actions/authActions';

const SettingsScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.userData);
  const starredMessages = useSelector(
    (state) => state.messages.starredMessages ?? {}
  );

  const sortedStarredMessages = useMemo(() => {
    let result = [];

    const chats = Object.values(starredMessages);

    chats.forEach((chat) => {
      const chatMessages = Object.values(chat);
      result = result.concat(chatMessages);
    });

    return result;
  }, [starredMessages]);

  const firstName = userData.firstName || '';
  const lastName = userData.lastName || '';
  const email = userData.email || '';
  const about = userData.about || '';

  const initialState = {
    inputValues: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      about: about,
    },
    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      about: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;
    try {
      setLoading(true);
      await updateSignedInUserData(userData.userId, updatedValues);
      dispatch(updateLoggedInUserData({ newData: updatedValues }));

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [formState, dispatch]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;

    return (
      currentValues.firstName != firstName ||
      currentValues.lastName != lastName ||
      currentValues.email != email ||
      currentValues.about != about
    );
  };

  return (
    <PageContainer>
      <PageTitle text='Settings' />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <ProfileImage
          size={80}
          userId={userData.userId}
          uri={userData.profilePicture}
          showEditButton={true}
        />
        <Input
          id='firstName'
          label='First name'
          icon='user-o'
          iconPack={FontAwesome}
          iconSize={20}
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities['firstName']}
          initialValue={userData.firstName}
        />
        <Input
          id='lastName'
          label='Last name'
          icon='house-user'
          iconPack={FontAwesome5}
          iconSize={18}
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities['lastName']}
          initialValue={userData.lastName}
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
          initialValue={userData.email}
        />
        <Input
          id='about'
          label='About'
          icon='bio'
          iconPack={MaterialCommunityIcons}
          iconSize={20}
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities['about']}
          initialValue={userData.about}
        />
        <View style={styles.saveView}>
          {showSuccessMessage && (
            <Text style={styles.saveText}>Changes saved successfuly!</Text>
          )}
          {loading ? (
            <ActivityIndicator
              size={'small'}
              color={colors.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
            hasChanges() && (
              <SubmitButton
                title='Save'
                disabled={!formState.formIsValid}
                onPress={saveHandler}
                style={{ marginTop: 20 }}
              />
            )
          )}
        </View>

        <DataItem
          type='link'
          title='Starred messages'
          icon='star'
          onPress={() =>
            props.navigation.navigate('DataList', {
              title: 'All starred messages',
              data: sortedStarredMessages,
              type: 'messages',
            })
          }
        />

        <SubmitButton
          title='Logout'
          color={colors.dangerRed}
          onPress={() => dispatch(userLogout(userData))}
          style={{ marginTop: 20 }}
        />
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    alignItems: 'center',
  },
  saveView: {
    marginTop: 20,
  },
  saveText: {
    color: colors.success,
  },
});

export default SettingsScreen;
