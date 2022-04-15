import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type ChatsListViewState = {
    type: 'chats_list';
}

export type ChatViewState = {
    type: 'chat';
    chatId: number;
};

export type AuthenticatedViewState = ChatsListViewState | ChatViewState;

const initialState: AuthenticatedViewState = {
    type: 'chats_list',
};

export const authenticatedViewSlice = createSlice({
    name: 'authenticatedView',
    initialState: (): AuthenticatedViewState => initialState,
    reducers: {
        showChatsList: (state) => {
            return {
                type: 'chats_list',
            }
        },
        showChat: (state, action: PayloadAction<number>) => {
            const chatId = action.payload;

            return {
                type: 'chat',
                chatId,
            };
        }
    },
    extraReducers: {},
})

export const { showChatsList, showChat } = authenticatedViewSlice.actions;

export const selectAuthenticatedViewState = (state: RootState) => state.authenticatedView;

export default authenticatedViewSlice.reducer;
