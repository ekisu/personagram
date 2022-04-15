import { Chat, Message } from '@airgram/web';
import { useAppDispatch } from '../../app/hooks';
import { showChat } from '../authenticated_view/authenticatedViewSlice';

function buildLastMessageElement(message: Message) {
    const { content } = message

    switch (content._) {
        case 'messageText':
            return <p>{content.text.text}</p>
        default:
            return <p>Unsupported message.</p>
    }
}

export type ChatsListElementProps = {
    airgramChat: Chat
}

export default function ChatsListElement({ airgramChat }: ChatsListElementProps) {
    const dispatch = useAppDispatch();
    const { title, lastMessage } = airgramChat

    const lastMessageElement = lastMessage ? buildLastMessageElement(lastMessage) : <p>No messages.</p>

    return (
        <div onClick={() => dispatch(showChat(airgramChat.id))}>
            <h2>{title}</h2>
            {lastMessageElement}
        </div>
    )
}