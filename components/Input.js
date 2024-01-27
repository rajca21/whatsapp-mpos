import React, { useState } from 'react';

// react native imports
import { Text, View, StyleSheet, TextInput } from 'react-native';

// utils
import colors from '../utils/colors';

const Input = (props) => {
  const [value, setValue] = useState(props.initialValue);

  const onChangeText = (text) => {
    setValue(text);
    props.onInputChanged(props.id, text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.inputContainer}>
        {props.icon && (
          <props.iconPack
            name={props.icon}
            size={props.iconSize || 15}
            style={styles.icon}
          />
        )}
        <TextInput
          {...props}
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
        />
      </View>

      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText[0]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginVertical: 8,
    fontFamily: 'bold',
    color: colors.textColor,
    letterSpacing: 0.2,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: colors.whitish,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    color: colors.grey,
  },
  input: {
    color: colors.textColor,
    flex: 1,
    fontFamily: 'regular',
    letterSpacing: 0.2,
    paddingTop: 0,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: colors.errorRed,
    fontSize: 13,
    fontFamily: 'regular',
    letterSpacing: 0.2,
  },
});

export default Input;
