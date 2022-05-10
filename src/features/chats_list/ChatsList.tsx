import { AirgramAuthenticatedState } from "../airgram/airgramSlice";
import ChatsListElement from "./ChatsListElement";
import styles from './ChatsList.module.css';
import snsImage from '../../assets/sns.png'

type ChatsListProps = {
    authenticatedState: AirgramAuthenticatedState,
}

export default function ChatsList({ authenticatedState: state }: ChatsListProps) {
    const chats = state.chats.airgramChats.map((airgramChat) => (
        <ChatsListElement airgramChat={airgramChat} me={state.me} key={airgramChat.id} />
    ));

    return (
        <div className={styles.chatsList}>
            <img className={styles.snsImage} src={snsImage} alt='' />

            <div className={styles.chats}>
                {chats}
            </div>
        </div>
    )
}