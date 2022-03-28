import { useAppDispatch } from "../../app/hooks";
import { AirgramAuthenticatedState } from "../airgram/airgramSlice";

type ChatsListProps = {
    authenticatedState: AirgramAuthenticatedState,
}

export default function ChatsList({ authenticatedState: state }: ChatsListProps) {
    const dispatch = useAppDispatch();

    return (
        <div>
            <h2>Chats List</h2>
        </div>
    )
}