import React, { useEffect, useRef, useState } from 'react';

// react native
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// react navigation
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// redux
import { useDispatch, useSelector } from 'react-redux';

// redux store
import { setStoredUsers } from '../store/userSlice';

// expo
import { FontAwesome } from '@expo/vector-icons';

// components
import CustomHeaderButton from '../components/CustomHeaderButton';
import PageContainer from '../components/PageContainer';
import DataItem from '../components/DataItem';
import ProfileImage from '../components/ProfileImage';

// utils
import colors from '../utils/colors';
import commonStyles from '../utils/commonStyles';
import { searchUsers } from '../utils/actions/userActions';

const NewChatScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState();
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatName, setChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const dispatch = useDispatch();

  const selectedUsersFlatList = useRef();

  const isGroupChat = props.route.params && props.route.params.isGroupChat;
  const isGroupChatDisabled =
    selectedUsers.length === 0 || (isNewChat && chatName === '');

  const chatId = props.route.params && props.route.params.chatId;
  const existingUsers = props.route.params && props.route.params.existingUsers;

  const isNewChat = !chatId;

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item title='Close' onPress={() => props.navigation.goBack()} />
          </HeaderButtons>
        );
      },
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            {isGroupChat && (
              <Item
                title={isNewChat ? 'Create' : 'Add'}
                disabled={isGroupChatDisabled}
                color={isGroupChatDisabled ? colors.lightGrey : undefined}
                onPress={() => {
                  const screenName = isNewChat ? 'ChatList' : 'ChatSettings';
                  props.navigation.navigate(screenName, {
                    selectedUsers,
                    chatName,
                    chatId,
                  });
                }}
              />
            )}
          </HeaderButtons>
        );
      },
      headerTitle: isGroupChat ? 'Add participants' : 'New chat',
    });
  }, [chatName, selectedUsers]);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchTerm || searchTerm === '') {
        setUsers();
        setNoResultsFound(false);
        return;
      }
      setLoading(true);

      const usersResult = await searchUsers(searchTerm);
      delete usersResult[userData.userId];
      setUsers(usersResult);

      if (Object.keys(usersResult).length === 0) {
        setNoResultsFound(true);
      } else {
        setNoResultsFound(false);

        dispatch(setStoredUsers({ newUsers: usersResult }));
      }

      setLoading(false);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const userPressed = (userId) => {
    if (isGroupChat) {
      const newSelectedUsers = selectedUsers.includes(userId)
        ? selectedUsers.filter((id) => id !== userId)
        : selectedUsers.concat(userId);

      setSelectedUsers(newSelectedUsers);
    } else {
      props.navigation.navigate('ChatList', {
        selectedUserId: userId,
      });
    }
  };

  return (
    <PageContainer>
      {isNewChat && isGroupChat && (
        <View style={styles.chatNameContainer}>
          <View style={styles.groupChatInputContainer}>
            <TextInput
              style={styles.groupChatTextbox}
              placeholder='Enter a name for group chat'
              autoCorrect={false}
              autoComplete='off'
              value={chatName}
              onChangeText={(text) => setChatName(text)}
            />
          </View>
        </View>
      )}

      {isGroupChat && (
        <View style={styles.selectedUsersContainer}>
          <FlatList
            style={styles.selectedUsersList}
            data={selectedUsers}
            horizontal={true}
            keyExtractor={(item) => item}
            contentContainerStyle={{ alignItems: 'center' }}
            ref={(ref) => (selectedUsersFlatList.current = ref)}
            onContentSizeChange={() =>
              selectedUsersFlatList.current.scrollToEnd()
            }
            renderItem={(itemData) => {
              const userId = itemData.item;
              const userData = storedUsers[userId];
              return (
                <ProfileImage
                  style={styles.selectedUserStyle}
                  uri={userData.profilePicture}
                  size={50}
                  onPress={() => userPressed(userId)}
                  showRemoveButton={true}
                />
              );
            }}
          />
        </View>
      )}

      <View style={styles.searchContainer}>
        <FontAwesome name='search' size={15} color={colors.lightGrey} />
        <TextInput
          placeholder='Search'
          style={styles.searchBox}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      {loading && (
        <View style={commonStyles.center}>
          <ActivityIndicator size={'large'} color={colors.primary} />
        </View>
      )}
      {!loading && !noResultsFound && users && (
        <FlatList
          data={Object.keys(users)}
          renderItem={(itemData) => {
            const userId = itemData.item;
            const userData = users[userId];

            if (existingUsers && existingUsers.includes(userId)) {
              return;
            }

            return (
              <DataItem
                title={`${userData.firstName} ${userData.lastName}`}
                subTitle={userData.about}
                image={userData.profilePicture}
                onPress={() => userPressed(userId)}
                type={isGroupChat ? 'checkBox' : ''}
                isChecked={selectedUsers.includes(userId)}
              />
            );
          }}
        />
      )}
      {!loading && noResultsFound && (
        <View style={commonStyles.center}>
          <FontAwesome
            name='question'
            size={55}
            color={colors.lightGrey}
            style={styles.noResultsIcon}
          />
          <Text style={styles.noResultsText}>No users found</Text>
        </View>
      )}
      {!loading && !users && (
        <View style={commonStyles.center}>
          <FontAwesome
            name='users'
            size={55}
            color={colors.lightGrey}
            style={styles.noResultsIcon}
          />
          <Text style={styles.noResultsText}>
            Enter a name to search for a user
          </Text>
        </View>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.extraLightGrey,
    height: 30,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  searchBox: {
    marginLeft: 8,
    fontSize: 15,
    width: '100%',
  },
  noResultsIcon: {
    marginBottom: 20,
  },
  noResultsText: {
    color: colors.textColor,
    fontFamily: 'regular',
    letterSpacing: 0.2,
  },
  chatNameContainer: {
    paddingVertical: 10,
  },
  groupChatInputContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: colors.whitish,
    flexDirection: 'row',
    borderRadius: 5,
  },
  groupChatTextbox: {
    color: colors.textColor,
    width: '100%',
    fontFamily: 'regular',
    letterSpacing: 0.2,
  },
  selectedUsersContainer: {
    height: 60,
    justifyContent: 'center',
  },
  selectedUsersList: {
    height: '100%',
  },
  selectedUserStyle: {
    marginRight: 5,
  },
});

export default NewChatScreen;
