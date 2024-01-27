import React, { useRef } from 'react';

// react native
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Menu, MenuTrigger, MenuOptions } from 'react-native-popup-menu';
import uuid from 'react-native-uuid';

// redux
import { useSelector } from 'react-redux';

// expo
import * as Clipboard from 'expo-clipboard';
import { FontAwesome } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

// utils
import colors from '../utils/colors';
import { formatTime } from '../utils/dateTimeFormatter';
import { starMessage } from '../utils/actions/chatActions';

// components
import MenuItem from './MenuItem';

const Bubble = (props) => {
  const {
    text,
    type,
    messageId,
    chatId,
    userId,
    date,
    name,
    setReply,
    replyingTo,
    imageUrl,
  } = props;

  const starredMessages = useSelector(
    (state) => state.messages.starredMessages[chatId] ?? {}
  );
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const wrapperStyle = { ...styles.wrapper };
  const bubbleStyle = { ...styles.container };
  const textStyle = { ...styles.text };

  const menuRef = useRef(null);
  const id = useRef(uuid.v4());

  let Container = View;
  let isUserMessage = false;
  const dateString = date && formatTime(date);

  switch (type) {
    case 'system':
      bubbleStyle.backgroundColor = colors.beige;
      bubbleStyle.alignItems = 'center';
      bubbleStyle.marginTop = 10;
      bubbleStyle.padding = 8;
      textStyle.color = colors.darkGrey;
      textStyle.textAlign = 'center';
      break;
    case 'error':
      bubbleStyle.backgroundColor = colors.errorRed;
      bubbleStyle.marginTop = 10;
      bubbleStyle.padding = 8;
      textStyle.color = 'white';
      textStyle.textAlign = 'center';
      break;
    case 'myMessage':
      wrapperStyle.justifyContent = 'flex-end';
      bubbleStyle.backgroundColor = colors.bubbleGreen;
      bubbleStyle.maxWidth = '90%';
      textStyle.fontSize = 16;
      Container = TouchableWithoutFeedback;
      isUserMessage = true;
      break;
    case 'theirMessage':
      wrapperStyle.justifyContent = 'flex-start';
      bubbleStyle.maxWidth = '90%';
      textStyle.fontSize = 16;
      Container = TouchableWithoutFeedback;
      isUserMessage = true;
      break;
    case 'reply':
      bubbleStyle.backgroundColor = '#f2f2f2';
      bubbleStyle.borderColor = colors.grey;
      break;
    case 'info':
      bubbleStyle.backgroundColor = colors.whitish;
      bubbleStyle.alignItems = 'center';
      bubbleStyle.padding = 8;
      textStyle.color = colors.textColor;
      textStyle.textAlign = 'center';
      break;
    default:
      break;
  }

  const copyToClipboard = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
    } catch (err) {
      console.error(err);
    }
  };

  const isStarred = isUserMessage && starredMessages[messageId] !== undefined;
  const replyingToUser = replyingTo && storedUsers[replyingTo.sentBy];

  return (
    <View style={wrapperStyle}>
      <Container
        onLongPress={() => {
          menuRef.current.props.ctx.menuActions.openMenu(id.current);
        }}
        style={{ width: '100%' }}
      >
        <View style={bubbleStyle}>
          {name && type !== 'info' && <Text style={styles.name}>{name}</Text>}

          {replyingToUser && (
            <Bubble
              type='reply'
              text={replyingTo.text}
              name={`${replyingToUser.firstName} ${replyingToUser.lastName}`}
            />
          )}

          {!imageUrl && <Text style={textStyle}>{text}</Text>}

          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          )}

          {(dateString || isStarred) && (
            <View style={styles.timeContainer}>
              {dateString && type !== 'info' && (
                <Text style={styles.time}>{dateString}</Text>
              )}
              {isStarred && (
                <FontAwesome
                  name='star'
                  size={14}
                  color={colors.bubbleOrange}
                />
              )}
            </View>
          )}

          <Menu name={id.current} ref={menuRef}>
            <MenuTrigger />
            <MenuOptions>
              <MenuItem
                text='Copy to clipboard'
                onSelect={() => copyToClipboard(text)}
                icon='copy'
              />
              <MenuItem
                text={`${isStarred ? 'Unstar' : 'Star'} message`}
                onSelect={() => starMessage(messageId, chatId, userId)}
                icon={isStarred ? 'star-o' : 'star'}
                iconPack={FontAwesome}
              />
              <MenuItem
                text='Reply'
                onSelect={setReply}
                icon='reply'
                iconPack={Octicons}
              />
            </MenuOptions>
          </Menu>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 5,
    marginBottom: 10,
    borderColor: colors.bubbleOrange,
    borderWidth: 1,
  },
  text: {
    fontFamily: 'regular',
    letterSpacing: 0.2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  time: {
    fontFamily: 'regular',
    letterSpacing: 0.2,
    color: colors.grey,
    fontSize: 12,
  },
  name: {
    fontFamily: 'medium',
    letterSpacing: 0.2,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 5,
  },
});

export default Bubble;
