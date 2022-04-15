import { Message as AirgramMessage } from "@airgram/web";

export type ChatMessageProps = {
    message: AirgramMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const content = message.content

    switch (content._) {
        case "messageText":
            return <p>{content.text.text}</p>
        default:
            return <p>Unknown</p>
    }
}