import { Airgram, Message as AirgramMessage, toObject } from "@airgram/web";
import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { airgram, AirgramState } from "./airgramSlice";

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

        const updatedMessagesForChatId = [
            ...new Array(...airgramMessages.messages ?? []).reverse(),
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
}