import React from 'react';

// react native imports
import { StyleSheet, Text, View } from 'react-native';
import { MenuOption } from 'react-native-popup-menu';

// expo
import { Feather } from '@expo/vector-icons';

// utils
import colors from '../utils/colors';

const MenuItem = (props) => {
  const Icon = props.iconPack ?? Feather;

  return (
    <MenuOption onSelect={props.onSelect}>
      <View style={styles.menuItemContainer}>
        <Text style={styles.menuText}>{props.text}</Text>
        <Icon color={colors.textColor} name={props.icon} size={18} />
      </View>
    </MenuOption>
  );
};

const styles = StyleSheet.create({
  menuItemContainer: {
    flexDirection: 'row',
    padding: 5,
  },
  menuText: {
    flex: 1,
    fontFamily: 'regular',
    letterSpacing: 0.2,
    fontSize: 16,
    color: colors.textColor,
  },
});

export default MenuItem;
