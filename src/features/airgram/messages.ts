import { Message as AirgramMessage, toObject } from "@airgram/web";
import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../app/store";
import { airgram, AirgramState, updateMessages } from "./airgramSlice";

export type Messages = {
    airgramMessagesByChatId: Record<number, Array<AirgramMessage>>,
};

export function loadMessagesInitialState(): Messages {
    return {
        airgramMessagesByChatId: {},
    };
}

type LoadMoreMessagesForChatIdParams = {
    messages: Messages; 
    chatId: number;
} 

export const loadMoreMessagesForChatId = createAsyncThunk(
    'airgram/messages/loadMoreMessagesForChatId',
    async ({ messages, chatId }: LoadMoreMessagesForChatIdParams, { getState }): Promise<Messages> => {
        const existingMessages: Array<AirgramMessage> = messages.airgramMessagesByChatId[chatId] ?? [];
        const airgramMessagesResponse = await airgram.api.getChatHistory({
            chatId,
            fromMessageId: existingMessages[0]?.id,
            limit: 30,
        });
        const airgramMessages = toObject(airgramMessagesResponse);
        const foundMessages = airgramMessages.messages ?? [];

        if (foundMessages.length === 0) {
            // Avoid updating the state if there are no new messages, because it will cause a re-render
            // and a refetch.
            return messages;
        }

        const updatedMessagesForChatId = [
            ...new Array(...foundMessages).reverse(),
            ...existingMessages,
        ]

        const updatedMessages: Messages = {
            ...messages,
            airgramMessagesByChatId: {
                ...messages.airgramMessagesByChatId,
                [chatId]: updatedMessagesForChatId,
            },
        }

        return updatedMessages;
    }
)

type SendMessageParams = { chatId: number, messageText: string }

export const sendMessage = createAsyncThunk(
    'airgram/messages/sendMessage',
    async ({ chatId, messageText }: SendMessageParams): Promise<AirgramMessage> => {
        const response = await airgram.api.sendMessage({
            chatId,
            inputMessageContent: {
                _: "inputMessageText",
                text: {
                    _: "formattedText",
                    text: messageText,
                },
            },
        });

        return toObject(response);
    }
)

export function configureBuilder(builder: ActionReducerMapBuilder<AirgramState>) {
    builder
        .addCase(loadMoreMessagesForChatId.fulfilled, (state, action) => {
            if (state.type !== 'authenticated') {
                return
            }

            const updatedMessages = action.payload;

            return {
                ...state,
                messages: updatedMessages,
            }
        })
        .addCase(sendMessage.fulfilled, (state, action) => {
            // TODO maybe add it to the messages thingy?
        })
}

export const configureAirgramEventListeners = (dispatch: AppDispatch, getState: () => RootState) => {
    airgram.on('updateNewMessage', async ({ update }) => {
        const { airgram: airgramState } = getState();
        if (airgramState.type !== 'authenticated') {
            return
        }

        const { message } = update;

        const messages = airgramState.messages;
        const updatedMessages = {
            ...messages,
            airgramMessagesByChatId: {
                ...messages.airgramMessagesByChatId,
                [message.chatId]: [...messages.airgramMessagesByChatId[message.chatId] ?? [], message],
            },
        }

        dispatch(updateMessages(updatedMessages));
    })
}