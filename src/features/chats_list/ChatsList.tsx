import { useAppDispatch } from "../../app/hooks";
import { AirgramAuthenticatedState } from "../airgram/airgramSlice";
import ChatsListElement from "./ChatsListElement";

type ChatsListProps = {
    authenticatedState: AirgramAuthenticatedState,
}

export default function ChatsList({ authenticatedState: state }: ChatsListProps) {
    const dispatch = useAppDispatch();
    const chats = state.chats.airgramChats.map((airgramChat) => (
        <ChatsListElement airgramChat={airgramChat} />
    ));

    return (
        <div>
            <h1>Chats List</h1>
            {chats}
        </div>
    )
}