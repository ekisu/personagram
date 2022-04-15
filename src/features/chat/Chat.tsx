import { Chat as AirgramChat, Message as AirgramMessage } from "@airgram/web";
import { useAppDispatch } from "../../app/hooks";
import { AirgramAuthenticatedState } from "../airgram/airgramSlice";
import { loadMoreMessagesForChatId } from "../airgram/messages";
import ChatMessage from "./ChatMessage";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./Chat.module.css";
import { useEffect } from "react";

export type ChatProps = {
    authenticatedState: AirgramAuthenticatedState,
    chatId: number,
};

function buildLoadedChatView(chat: AirgramChat, chatMessages: AirgramMessage[], loadMoreMessagesCallback: () => void) {
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
                    {chatMessages.slice().reverse().map((message) => <ChatMessage message={message} key={message.id} />)}
                </InfiniteScroll>
            </div>
        </div>
    );
}

export default function Chat({ authenticatedState, chatId }: ChatProps) {
    const dispatch = useAppDispatch();
    const { chats, messages } = authenticatedState
    const chat = chats.airgramChats.find((airgramChat) => airgramChat.id === chatId)

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
        ? buildLoadedChatView(chat, chatMessages, loadMoreMessagesCallback)
        : <p>Loading...</p>

    return contents
}