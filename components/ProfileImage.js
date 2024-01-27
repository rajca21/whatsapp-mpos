import React, { useState } from 'react';

// react native imports
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

// expo
import { Feather } from '@expo/vector-icons';

// redux
import { useDispatch } from 'react-redux';

// redux store
import { updateLoggedInUserData } from '../store/authSlice';

// assets & utils
import userImage from '../assets/images/userImage.jpeg';
import colors from '../utils/colors';
import {
  launchImagePicker,
  uploadImageAsync,
} from '../utils/imagePickerHelper';
import { updateSignedInUserData } from '../utils/actions/authActions';
import { updateChatData } from '../utils/actions/chatActions';

const ProfileImage = (props) => {
  const source = props.uri ? { uri: props.uri } : userImage;
  const [image, setImage] = useState(source);
  const [loading, setLoading] = useState(false);

  const showEditButton = props.showEditButton && props.showEditButton === true;
  const showRemoveButton =
    props.showRemoveButton && props.showRemoveButton === true;

  const userId = props.userId;
  const chatId = props.chatId;

  const dispatch = useDispatch();

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;

      setLoading(true);
      const uploadUrl = await uploadImageAsync(tempUri, chatId !== undefined);
      setLoading(false);

      if (!uploadUrl) {
        throw new Error('Could not upload the image');
      }

      if (chatId) {
        await updateChatData(chatId, userId, { chatImage: uploadUrl });
      } else {
        const newData = { profilePicture: uploadUrl };

        await updateSignedInUserData(userId, newData);
        dispatch(updateLoggedInUserData({ newData }));
      }

      setImage({ uri: uploadUrl });
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const Container = props.onPress || showEditButton ? TouchableOpacity : View;

  return (
    <Container style={props.style} onPress={props.onPress || pickImage}>
      {loading ? (
        <View
          height={props.size}
          width={props.size}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size={'small'} color={colors.primary} />
        </View>
      ) : (
        <Image
          style={{
            ...styles.image,
            ...{ width: props.size, height: props.size },
          }}
          source={image}
        />
      )}

      {showEditButton && !loading && (
        <View style={styles.editIconContainer}>
          <Feather name='edit' size={15} color={colors.darkGrey} />
        </View>
      )}

      {showRemoveButton && !loading && (
        <View style={styles.removeIconContainer}>
          <Feather name='x' size={10} color={colors.darkGrey} />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 50,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    height: 80,
    width: 80,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.lightGrey,
    borderRadius: 50,
    padding: 7,
  },
  removeIconContainer: {
    position: 'absolute',
    top: 0,
    right: -5,
    backgroundColor: colors.lightGrey,
    borderRadius: 50,
    padding: 5,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileImage;
