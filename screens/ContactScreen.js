import React, { useCallback, useEffect, useState } from 'react';

// react native
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

// redux
import { useSelector } from 'react-redux';

// components
import PageContainer from '../components/PageContainer';
import ProfileImage from '../components/ProfileImage';
import PageTitle from '../components/PageTitle';
import DataItem from '../components/DataItem';
import SubmitButton from '../components/SubmitButton';

// utils
import colors from '../utils/colors';
import { getUserChats } from '../utils/actions/userActions';
import { removeUserFromChat } from '../utils/actions/chatActions';

const ContactScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [mutualChats, setMutualChats] = useState([]);

  const storedUsers = useSelector((state) => state.users.storedUsers);
  const storedChats = useSelector((state) => state.chats.chatsData);
  const userData = useSelector((state) => state.auth.userData);

  const currentUser = storedUsers[props.route.params.uid];
  const chatId = props.route.params.chatId;

  const chatData = chatId && storedChats[chatId];

  useEffect(() => {
    const getMutualUserChats = async () => {
      const currentUserChats = await getUserChats(currentUser.userId);
      setMutualChats(
        Object.values(currentUserChats).filter(
          (cid) => storedChats[cid] && storedChats[cid].isGroupChat
        )
      );
    };

    getMutualUserChats();
  }, []);

  const removeFromChat = useCallback(async () => {
    try {
      setLoading(true);

      await removeUserFromChat(userData, currentUser, chatData);

      props.navigation.goBack();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [props.navigation, loading]);

  return (
    <PageContainer>
      <View style={styles.topContainer}>
        <ProfileImage
          uri={currentUser.profilePicture}
          size={80}
          style={{ marginBottom: 20 }}
        />

        <PageTitle text={`${currentUser.firstName} ${currentUser.lastName}`} />
        {currentUser.about && (
          <Text style={styles.about} numberOfLines={2}>
            {currentUser.about}
          </Text>
        )}
      </View>

      {mutualChats.length > 0 && (
        <>
          <Text style={styles.heading}>
            {mutualChats.length} mutual{' '}
            {mutualChats.length === 1 ? 'group' : 'groups'}
          </Text>
          {mutualChats.map((cid) => {
            const chatData = storedChats[cid];
            return (
              <DataItem
                key={cid}
                title={chatData.chatName}
                subTitle={chatData.latestMessageText}
                type='link'
                onPress={() =>
                  props.navigation.push('ChatScreen', { chatId: cid })
                }
                image={chatData.chatImage}
              />
            );
          })}
        </>
      )}

      {chatData &&
        chatData.isGroupChat &&
        (loading ? (
          <ActivityIndicator
            size='small'
            color={colors.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <SubmitButton
            title='Remove from chat'
            color={colors.dangerRed}
            onPress={removeFromChat}
            style={{ marginTop: 20 }}
          />
        ))}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  about: {
    fontFamily: 'medium',
    fontSize: 16,
    letterSpacing: 0.2,
    color: colors.grey,
  },
  heading: {
    fontFamily: 'bold',
    letterSpacing: 0.2,
    color: colors.textColor,
    marginVertical: 8,
  },
});

export default ContactScreen;
