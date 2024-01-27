import React, { useCallback, useEffect, useReducer, useState } from 'react';

// react native
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// redux
import { useSelector } from 'react-redux';

// components
import PageContainer from '../components/PageContainer';
import PageTitle from '../components/PageTitle';
import ProfileImage from '../components/ProfileImage';
import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';
import DataItem from '../components/DataItem';

// utils
import { reducer } from '../utils/reducers/formReducer';
import { validateInput } from '../utils/actions/formActions';
import {
  addUsersToChat,
  removeUserFromChat,
  updateChatData,
} from '../utils/actions/chatActions';
import colors from '../utils/colors';

const ChatSettingsScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const chatId = props.route.params.chatId;
  const selectedUsers = props.route.params && props.route.params.selectedUsers;

  const chatData = useSelector((state) => state.chats.chatsData[chatId] || {});
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const starredMessages = useSelector(
    (state) => state.messages.starredMessages[chatId] ?? {}
  );

  const initialState = {
    inputValues: {
      chatName: chatData.chatName,
    },
    inputValidities: {
      chatName: undefined,
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
      await updateChatData(chatId, userData.userId, updatedValues);

      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [formState]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return currentValues.chatName != chatData.chatName;
  };

  const leaveChat = useCallback(async () => {
    try {
      setLoading(true);

      await removeUserFromChat(userData, userData, chatData);

      props.navigation.popToTop();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [props.navigation, loading]);

  useEffect(() => {
    if (!selectedUsers) return;

    const selectedUserData = [];

    selectedUsers.forEach((uid) => {
      if (uid === userData.userId) return;

      if (!storedUsers[uid]) {
        console.error('No user data found in the database');
        return;
      }

      selectedUserData.push(storedUsers[uid]);
    });

    addUsersToChat(userData, selectedUserData, chatData);
  }, [selectedUsers]);

  if (!chatData.users) return null;

  return (
    <PageContainer>
      <PageTitle text='Chat Settings' />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <ProfileImage
          showEditButton={true}
          size={80}
          chatId={chatId}
          userId={userData.userId}
          uri={chatData.chatImage}
        />

        <Input
          id='chatName'
          label='Chat name'
          autoCapitalize='none'
          initialValue={chatData.chatName}
          allowEmpty={false}
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities['chatName']}
        />

        <View style={styles.sectionContainer}>
          <Text style={styles.heading}>
            {chatData.users.length} participants
          </Text>
          <DataItem
            title='Add users'
            icon='plus'
            type='button'
            onPress={() =>
              props.navigation.navigate('NewChat', {
                isGroupChat: true,
                existingUsers: chatData.users,
                chatId,
              })
            }
          />

          {chatData.users.slice(0, 4).map((uid) => {
            const currentUser = storedUsers[uid];
            return (
              <DataItem
                key={uid}
                image={currentUser.profilePicture}
                title={`${currentUser.firstName} ${currentUser.lastName}`}
                subTitle={currentUser.about}
                type={uid !== userData.userId && 'link'}
                onPress={() =>
                  uid !== userData.userId &&
                  props.navigation.navigate('Contact', { uid, chatId })
                }
              />
            );
          })}

          {chatData.users.length > 4 && (
            <DataItem
              type='link'
              title='View all participants'
              icon='users'
              iconPack='feather'
              onPress={() =>
                props.navigation.navigate('DataList', {
                  title: `${chatData.chatName} participants`,
                  data: chatData.users,
                  type: 'users',
                  chatId,
                })
              }
            />
          )}
        </View>

        {showSuccessMessage && (
          <View style={styles.saveContainer}>
            <Text style={styles.saveText}>Changes saved successfuly!</Text>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size={'small'} color={colors.primary} />
        ) : (
          hasChanges() && (
            <SubmitButton
              title='Save changes'
              color={colors.primary}
              onPress={saveHandler}
              disabled={!formState.formIsValid}
              style={{ marginTop: 20 }}
            />
          )
        )}
        <DataItem
          type='link'
          title='Starred messages'
          icon='star'
          onPress={() =>
            props.navigation.navigate('DataList', {
              title: `Starred messages in ${chatData.chatName}`,
              data: Object.values(starredMessages),
              type: 'messages',
            })
          }
        />
      </ScrollView>

      {
        <SubmitButton
          title='Leave chat'
          color={colors.dangerRed}
          onPress={leaveChat}
          style={{ marginBottom: 30 }}
        />
      }
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    width: '100%',
    marginTop: 10,
  },
  heading: {
    marginVertical: 8,
    color: colors.textColor,
    fontFamily: 'bold',
    letterSpacing: 0.2,
  },
  saveContainer: {
    justifyContent: 'flex-start',
  },
  saveText: {
    color: colors.success,
  },
});

export default ChatSettingsScreen;
