import React from 'react';

// react native imports
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// redux
import { useSelector } from 'react-redux';

// expo
import { Ionicons } from '@expo/vector-icons';

// utils
import colors from '../utils/colors';

const ReplyTo = (props) => {
  const { text, user, onCancel } = props;
  const loggedInUserData = useSelector((state) => state.auth.userData);
  const name =
    user.userId !== loggedInUserData.userId
      ? `${user.firstName} ${user.lastName}`
      : 'You';

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text numberOfLines={1}>{text}</Text>
      </View>
      <TouchableOpacity onPress={onCancel}>
        <Ionicons name='close-circle-outline' size={24} color={colors.blue} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.extraLightGrey,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftColor: colors.blue,
    borderLeftWidth: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 5,
  },
  name: {
    color: colors.blue,
    fontFamily: 'medium',
    letterSpacing: 0.2,
  },
});

export default ReplyTo;
