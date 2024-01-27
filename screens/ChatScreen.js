import React, { useCallback, useEffect, useRef, useState } from 'react';

// react native
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// redux
import { useSelector } from 'react-redux';

// expo
import { Feather } from '@expo/vector-icons';

// components
import PageContainer from '../components/PageContainer';
import Bubble from '../components/Bubble';
import ReplyTo from '../components/ReplyTo';
import CustomHeaderButton from '../components/CustomHeaderButton';

// assets & utils
import backgroundImage from '../assets/images/chat-background.jpg';
import colors from '../utils/colors';
import {
  createChat,
  sendImageMessage,
  sendTextMessage,
} from '../utils/actions/chatActions';
import {
  launchImagePicker,
  openCamera,
  uploadImageAsync,
} from '../utils/imagePickerHelper';

const ChatScreen = (props) => {
  const [messageText, setMessageText] = useState('');
  const [chatUsers, setChatUsers] = useState([]);
  const [chatId, setChatId] = useState(props.route?.params?.chatId);
  const [errorBannerText, setErrorBannerText] = useState('');
  const [replyingTo, setReplyingTo] = useState();
  const [tempImageUri, setTempImageUri] = useState('');
  const [loading, setLoading] = useState(false);

  const flatList = useRef();

  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const storedChats = useSelector((state) => state.chats.chatsData);
  const chatMessages = useSelector((state) => {
    if (!chatId) return [];

    const chatMessagesData = state.messages.messagesData[chatId];

    if (!chatMessagesData) return [];

    const messageList = [];
    for (const key in chatMessagesData) {
      const message = chatMessagesData[key];

      messageList.push({
        key,
        ...message,
      });
    }

    return messageList;
  });

  const chatData =
    (chatId && storedChats[chatId]) || props.route?.params?.newChatData || {};

  const getChatTitleFromName = () => {
    const otherUserId = chatUsers.find((uid) => uid !== userData.userId);
    const otherUserData = storedUsers[otherUserId];

    return (
      otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`
    );
  };

  useEffect(() => {
    if (!chatData) return;

    props.navigation.setOptions({
      headerTitle: chatData.chatName ?? getChatTitleFromName(),
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            {chatId && (
              <Item
                title='Chat settings'
                iconName='settings-outline'
                onPress={() =>
                  chatData.isGroupChat
                    ? props.navigation.navigate('ChatSettings', {
                        chatId,
                      })
                    : props.navigation.navigate('Contact', {
                        uid: chatUsers.find((uid) => uid !== userData.userId),
                      })
                }
              />
            )}
          </HeaderButtons>
        );
      },
    });
    setChatUsers(chatData.users);
  }, [chatUsers]);

  const sendMessage = useCallback(async () => {
    try {
      let id = chatId;
      if (!id) {
        // No chat ID, creating the chat
        id = await createChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }

      // Already existing chat
      await sendTextMessage(
        id,
        userData,
        messageText,
        replyingTo && replyingTo.key,
        chatUsers
      );

      setMessageText('');
      setReplyingTo(null);
    } catch (err) {
      console.error(err);
      setErrorBannerText('Message failed to send');
      setTimeout(() => setErrorBannerText(''), 5000);
    }
  }, [messageText, chatId]);

  const pickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;

      setTempImageUri(tempUri);
    } catch (err) {
      console.error(err);
    }
  }, [tempImageUri]);

  const takePhoto = useCallback(async () => {
    try {
      const tempUri = await openCamera();
      if (!tempUri) return;

      setTempImageUri(tempUri);
    } catch (err) {
      console.error(err);
    }
  }, [tempImageUri]);

  const uploadImage = useCallback(async () => {
    setLoading(true);
    try {
      let id = chatId;
      if (!id) {
        // No chat ID, creating the chat
        id = await createChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }

      const uploadUrl = await uploadImageAsync(tempImageUri, true);
      setLoading(false);

      await sendImageMessage(
        id,
        userData,
        uploadUrl,
        replyingTo && replyingTo.key,
        chatUsers
      );

      setReplyingTo(null);
      setTimeout(() => setTempImageUri(''), 500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [loading, tempImageUri, chatId]);

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <PageContainer style={styles.pageContainer}>
          {!chatId && (
            <Bubble
              text={`You and ${getChatTitleFromName()} still haven't sent each other a message. Butterflies in your stomach?`}
              type='system'
            ></Bubble>
          )}

          {errorBannerText !== '' && (
            <Bubble text={errorBannerText} type='error'></Bubble>
          )}

          {chatId && (
            <FlatList
              ref={(ref) => (flatList.current = ref)}
              style={styles.messageList}
              onContentSizeChange={() =>
                flatList.current.scrollToEnd({ animated: false })
              }
              onLayout={() => flatList.current.scrollToEnd({ animated: false })}
              data={chatMessages}
              renderItem={(itemData) => {
                const message = itemData.item;

                const isOwnMessage = message.sentBy === userData.userId;

                let messageType;
                if (message.type && message.type === 'info') {
                  messageType = 'info';
                } else if (isOwnMessage) {
                  messageType = 'myMessage';
                } else {
                  messageType = 'theirMessage';
                }

                const sender = message.sentBy && storedUsers[message.sentBy];
                const name = sender && `${sender.firstName} ${sender.lastName}`;
                return (
                  <Bubble
                    type={messageType}
                    text={message.text}
                    messageId={message.key}
                    userId={userData.userId}
                    chatId={chatId}
                    date={message.sentAt}
                    name={
                      !chatData.isGroupChat || isOwnMessage ? undefined : name
                    }
                    setReply={() => setReplyingTo(message)}
                    replyingTo={
                      message.replyTo &&
                      chatMessages.find((i) => i.key === message.replyTo)
                    }
                    imageUrl={message.imageUrl}
                  />
                );
              }}
            />
          )}
        </PageContainer>

        {replyingTo && (
          <ReplyTo
            text={replyingTo.text}
            user={storedUsers[replyingTo.sentBy]}
            onCancel={() => setReplyingTo(null)}
          />
        )}
      </ImageBackground>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
          <Feather name='plus' size={24} color={colors.blue} />
        </TouchableOpacity>

        <TextInput
          style={styles.textbox}
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
          onSubmitEditing={sendMessage}
        />

        {messageText !== '' ? (
          <TouchableOpacity
            style={{ ...styles.mediaButton, ...styles.sendButton }}
            onPress={sendMessage}
          >
            <Feather name='send' size={20} color='white' />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
            <Feather name='camera' size={24} color={colors.blue} />
          </TouchableOpacity>
        )}

        <AwesomeAlert
          show={tempImageUri !== ''}
          title='Send media'
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText='Cancel'
          confirmText='Send image'
          confirmButtonColor={colors.primary}
          cancelButtonColor={colors.errorRed}
          titleStyle={styles.popupTitle}
          onCancelPressed={() => setTempImageUri('')}
          onConfirmPressed={uploadImage}
          onDismiss={() => setTempImageUri('')}
          customView={
            <View>
              {loading && (
                <ActivityIndicator size='small' color={colors.primary} />
              )}
              {!loading && tempImageUri !== '' && (
                <Image
                  source={{ uri: tempImageUri }}
                  style={styles.popupImage}
                />
              )}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  pageContainer: {
    backgroundColor: 'transparent',
  },
  messageList: {
    marginTop: 10,
  },
  backgroundImage: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'space-between',
  },
  textbox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    marginHorizontal: 15,
    paddingHorizontal: 12,
  },
  mediaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
  },
  sendButton: {
    backgroundColor: colors.blue,
    borderRadius: 50,
    paddingRight: 2,
    paddingTop: 2,
  },
  popupTitle: {
    fontFamily: 'medium',
    letterSpacing: 0.2,
    color: colors.textColor,
  },
  popupImage: {
    width: 250,
    height: 250,
    borderRadius: 5,
  },
  messageList: {
    marginTop: 10,
  },
});

export default ChatScreen;
