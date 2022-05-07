import { Chat as AirgramChat, Message as AirgramMessage, UserUnion } from "@airgram/web";
import { useAppDispatch } from "../../app/hooks";
import { AirgramAuthenticatedState } from "../airgram/airgramSlice";
import { loadMoreMessagesForChatId, sendMessage } from "../airgram/messages";
import ChatMessage from "./ChatMessage";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./Chat.module.css";
import { useEffect, useState } from "react";
import { AppDispatch } from "../../app/store";

export type ChatProps = {
    authenticatedState: AirgramAuthenticatedState,
    chatId: number,
};

function buildLoadedChatView(
    chat: AirgramChat,
    chatMessages: AirgramMessage[],
    me: UserUnion,
    loadMoreMessagesCallback: () => void,
    dispatch: AppDispatch,
    textAreaValue: string,
    setTextAreaValue: React.Dispatch<React.SetStateAction<string>>,
) {
    const handleTextAreaKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") {
            return;
        }

        dispatch(sendMessage({
            chatId: chat.id,
            messageText: textAreaValue,
        }));
    }

    return (
        <div className={styles.chat}>
            <h1>Chatting with {chat.title}</h1>

            <div id="scrollable-chat-messages" className={styles.chatMessages} style={{
                display: "flex",
                overflow: "auto",
                flexDirection: "column-reverse",
            }}>
                <InfiniteScroll
                    dataLength={chatMessages.length}
                    next={loadMoreMessagesCallback}
                    style={{ display: "flex", flexDirection: "column-reverse" }}
                    inverse={true}
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="scrollable-chat-messages">
                    {chatMessages.slice().reverse().map((message) => <ChatMessage message={message} key={message.id} me={me}/>)}
                </InfiniteScroll>
            </div>

            <div className={styles.chatInput}>
                <input type="text" onKeyUp={handleTextAreaKeyPress} onChange={(e) => setTextAreaValue(e.target.value)}></input>
            </div>
        </div>
    );
}

export default function Chat({ authenticatedState, chatId }: ChatProps) {
    const dispatch = useAppDispatch();
    const { chats, messages, me } = authenticatedState
    const chat = chats.airgramChats.find((airgramChat) => airgramChat.id === chatId)
    const [textAreaValue, setTextAreaValue] = useState('');

    const chatMessages = messages.airgramMessagesByChatId[chatId]
    const loadMoreMessagesCallback = () => {
        dispatch(loadMoreMessagesForChatId({
            chatId,
            messages,
        }))
    }

    useEffect(() => {
        // FIXME isso aqui é tipo horrivel, mas precisa pq o InfiniteScroll so funciona se tiver
        // conteudo o suficiente pra ter alguma scrollbar... mas normalmente a gente só tem uma mensagem no
        // começo, então não tem msg o suficiente pra ter scroll dentro do componente
        // Ver: https://github.com/ankeetmaini/react-infinite-scroll-component/issues/286
        if (!chatMessages || chatMessages.length < 20) {
            loadMoreMessagesCallback()
        }
    }, [chatMessages])

    const contents = chat && chatMessages
        // FIXME tem tipo 90 parametros isso
        ? buildLoadedChatView(chat, chatMessages, me, loadMoreMessagesCallback, dispatch, textAreaValue, setTextAreaValue)
        : <p>Loading...</p>

    return contents
}