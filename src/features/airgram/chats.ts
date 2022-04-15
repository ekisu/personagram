import { Airgram, Chat as AirgramChat, toObject } from "@airgram/web";

export type Chats = {
    airgramChats: AirgramChat[],
};

export async function loadChats(airgram: Airgram): Promise<Chats> {
    const getChatsResponse = toObject(await airgram.api.getChats({
        limit: 30,
    }));

    const getChatResponses = await Promise.all(getChatsResponse.chatIds.map((chatId) => airgram.api.getChat({ chatId })))
    const chatObjects = getChatResponses.map(toObject);

    return {
        airgramChats: chatObjects,
    };
}
