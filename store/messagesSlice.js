// redux
import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messagesData: {},
    starredMessages: {},
  },
  reducers: {
    setChatMessages: (state, action) => {
      const existingMessages = state.messagesData;
      const { chatId, messagesData } = action.payload;
      existingMessages[chatId] = messagesData;
      state.messagesData = existingMessages;
    },
    setStarredMessages: (state, action) => {
      const { starredMessages } = action.payload;
      state.starredMessages = { ...starredMessages };
    },
    addStarredMessage: (state, action) => {
      const { starredMessageData } = action.payload;
      state.starredMessages[starredMessageData.messageId] = starredMessageData;
    },
    removeStarredMessage: (state, action) => {
      const { messageId } = action.payload;
      delete state.starredMessages[messageId];
    },
  },
});

export const setChatMessages = messagesSlice.actions.setChatMessages;
export const setStarredMessages = messagesSlice.actions.setStarredMessages;
export const addStarredMessage = messagesSlice.actions.addStarredMessage;
export const removeStarredMessage = messagesSlice.actions.removeStarredMessage;
export default messagesSlice.reducer;
