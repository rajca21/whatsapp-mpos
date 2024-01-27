import React from 'react';

// react navigation
import { HeaderButton } from 'react-navigation-header-buttons';

// expo
import { Ionicons } from '@expo/vector-icons';

// utils
import colors from '../utils/colors';

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={23}
      color={props.color ?? colors.blue}
    />
  );
};

export default CustomHeaderButton;
