import React, { useEffect } from 'react';

// react native
import { FlatList } from 'react-native';

// redux
import { useSelector } from 'react-redux';

// components
import PageContainer from '../components/PageContainer';
import DataItem from '../components/DataItem';

const DataListScreen = (props) => {
  const { title, data, type, chatId } = props.route.params;

  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userData = useSelector((state) => state.auth.userData);
  const messagesData = useSelector((state) => state.messages.messagesData);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: title,
    });
  }, [title, data]);

  return (
    <PageContainer>
      <FlatList
        data={data}
        keyExtractor={(item) => item.messageId || item}
        renderItem={(itemData) => {
          let key, onPress, image, title, subTitle, itemType;

          if (type === 'users') {
            const uid = itemData.item;
            const currentUser = storedUsers[uid];

            if (!currentUser) return;

            const isLoggedInUser = uid === userData.userId;

            key = uid;
            image = currentUser.profilePicture;
            title = `${currentUser.firstName} ${currentUser.lastName}`;
            subTitle = currentUser.about;
            icon = ''
            itemType = isLoggedInUser ? undefined : 'link';
            onPress = isLoggedInUser
              ? undefined
              : () =>
                  props.navigation.navigate('Contact', {
                    uid,
                    chatId,
                  });
          } else if (type === 'messages') {
            const starData = itemData.item;
            const { chatId, messageId } = starData;

            const messagesForChat = messagesData[chatId];
            if (!messagesForChat) return;

            const messageData = messagesForChat[messageId];
            const sender =
              messageData.sentBy && storedUsers[messageData.sentBy];
            const name = sender && `${sender.firstName} ${sender.lastName}`;

            key = messageId;
            title = name;
            subTitle = messageData.text;
            itemType = '';
            icon = 'staro';
            onPress = () => {};
          }

          return (
            <DataItem
              key={key}
              onPress={onPress}
              image={image}
              title={title}
              subTitle={subTitle}
              icon={icon}
              type={itemType}
            />
          );
        }}
      />
    </PageContainer>
  );
};

export default DataListScreen;
