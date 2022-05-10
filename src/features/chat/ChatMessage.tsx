import { Message as AirgramMessage, UserUnion, MessageContentUnion } from "@airgram/web";
import { useRef } from "react";
import useIntersection from "../../utils/useIntersection";
import styles from './ChatMessage.module.css';
import avatarFutaba from '../../assets/futaba.png';
import avatarMakoto from '../../assets/makoto.png';
import ChatMessageBubble from "./ChatMessageBubble";

export type ChatMessageProps = {
    message: AirgramMessage;
    me: UserUnion;
}

function buildMessageComponent(ref: React.MutableRefObject<HTMLParagraphElement>, content: MessageContentUnion) {
    switch (content._) {
        case "messageText":
            return <p ref={ref}>{content.text.text}</p>
        default:
            return <p ref={ref}>Unknown</p>
    }
}

type AvatarProps = {
    avatar: string
    background: string
}

function isMyMessage(message: AirgramMessage, me: UserUnion) {
    if (message.senderId._ !== 'messageSenderUser') {
        return false
    }

    return message.senderId.userId === me.id
}

export default function ChatMessage({ message, me }: ChatMessageProps) {
    const content = message.content
    const ref = useRef() as React.MutableRefObject<HTMLParagraphElement>
    const inViewport = useIntersection(ref, '0px')
    const messageComponent = buildMessageComponent(ref, content)

    const avatarProps: AvatarProps = isMyMessage(message, me)
        ? { avatar: avatarFutaba, background: 'pink' }
        : { avatar: avatarMakoto, background: 'purple' }

    if (inViewport) {
        console.log(`${message.id} is in viewport`)
    }

    return (
        <div className={styles.chatMessage}>
            <div className={styles.avatar}>
                <div className={styles.outerBlackBorder}>
                    <div className={styles.innerWhiteBorder}>
                        <div className={styles.background} style={{ background: avatarProps.background }}>
                        </div>
                    </div>
                </div>

                <img className={styles.avatarImage} src={avatarProps.avatar} alt=''></img>
            </div>

            {/*<div className={styles.message}>
                <div className={styles.outerWhiteBorder}>
                    {messageComponent}
                </div>
            </div>*/}

            <ChatMessageBubble className={styles.message}>
                {messageComponent}
            </ChatMessageBubble>
        </div>
    )
}