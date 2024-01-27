import React from 'react';

// react native
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

// expo
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

// components
import ProfileImage from '../components/ProfileImage';

// utils
import colors from '../utils/colors';

const imageSize = 50;

const DataItem = (props) => {
  const { title, subTitle, image, type, isChecked, icon } = props;

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.container}>
        {!icon ? (
          <ProfileImage uri={image} size={imageSize} />
        ) : (
          <View style={styles.leftIconContainer}>
            {props.iconPack === 'feather' ? (
              <Feather name={icon} size={20} color={colors.blue} />
            ) : (
              <AntDesign name={icon} size={20} color={colors.blue} />
            )}
          </View>
        )}

        <View style={styles.textContainer}>
          <Text
            style={{
              ...styles.title,
              ...{
                color: type === 'button' ? colors.blue : colors.textColor,
              },
            }}
            numberOfLines={1}
          >
            {title}
          </Text>

          {subTitle && (
            <Text style={styles.subTitle} numberOfLines={1}>
              {subTitle}
            </Text>
          )}
        </View>

        {type === 'checkBox' && (
          <View
            style={{
              ...styles.iconContainer,
              ...(isChecked && styles.checkedStyle),
            }}
          >
            <Ionicons name='checkmark' size={18} color='white' />
          </View>
        )}

        {type === 'link' && (
          <View>
            <Ionicons
              name='chevron-forward-outline'
              size={18}
              color={colors.grey}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomColor: colors.extraLightGrey,
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 50,
  },
  leftIconContainer: {
    backgroundColor: colors.extraLightGrey,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: imageSize,
    height: imageSize,
  },
  textContainer: {
    marginLeft: 14,
    flex: 1,
  },
  title: {
    fontFamily: 'medium',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  subTitle: {
    fontFamily: 'regular',
    color: colors.grey,
    letterSpacing: 0.2,
  },
  iconContainer: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    backgroundColor: 'white',
  },
  checkedStyle: {
    backgroundColor: colors.primary,
    borderColor: 'transparent',
  },
});

export default DataItem;
