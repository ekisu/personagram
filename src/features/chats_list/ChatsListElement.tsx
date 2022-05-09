import { Chat, Message } from '@airgram/web';
import { useAppDispatch } from '../../app/hooks';
import { showChat } from '../authenticated_view/authenticatedViewSlice';
import styles from './ChatsListElement.module.css';

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
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 599.037 180.702"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.chatsListElement}
            >
                <path
                    style={{
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "#000",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                    }}
                    d="m84.361 754.036 47.51 112.729 66.07-22.478 441.38-34.057 42.57-122.946-339.888 43.593 5.62-23.329-42.232-3.405-66.922 12.6.852 4.428-44.274 5.96 5.62 32.865Z"
                    transform="translate(-83.591 -686.686)"
                />
                <path
                    style={{
                    fill: "#fff",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                    }}
                    d="m100.422 760.99 41.662 87.177 103.552-25.527-17.553-50.21-23.5 5.105-2.923-14.8Z"
                    transform="translate(-83.591 -686.686)"
                />
                <path
                    style={{
                    fill: "#676767",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                    }}
                    d="m110.585 771.065 34.909 71.009 94.678-24.862-16.087-43.858-19.502 4.181-1.897-10.08Z"
                    transform="translate(-83.591 -686.686)"
                />
                <path
                    style={{
                    fill: "#fff",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                    }}
                    d="m198.292 730.424 9.867 39.619 22.477-4.002 16.944.937 1.617-6.471 1.277 4.768 53.555-8.685-.3-6.629 29.111 1.712 6.75-39.739-35.05-3.534-3.746 18.22-2.895-16.517-53.81 9.365 1.873 10.728-5.79-.34-1.192-4.598c-7.931 2.49-40.688 5.166-40.688 5.166Z"
                    transform="translate(-83.591 -686.686)"
                />
                <path
                    style={{
                    fill: "#fd1301",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                    }}
                    d="m303.73 749.961 29.11 1.712 6.75-39.739-35.05-3.534-3.746 18.22Z"
                    transform="translate(-83.591 -686.686)"
                />

                <foreignObject x="28%" y="42%" width="65%" height="50%" className={styles.foreignContent}>
                    <div className={styles.content}>
                        {lastMessageElement}
                    </div>
                </foreignObject>
            </svg>
        </div>
    )
}