import { Airgram, AuthorizationStateUnion, isError, toObject, UserUnion } from "@airgram/web";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isString } from "typed-assert";
import { assert } from '../../utils';
import { AppDispatch, RootState } from "../../app/store";
import { Chats, loadChats } from "./chats";
import { configureBuilder, loadMessagesInitialState, Messages } from "./messages";

export type AirgramLoadingState = {
    type: 'loading';
};

export type AirgramUnauthenticatedState = {
    type: 'unauthenticated';

    authorizationState: 'waiting_phone_number' | 'waiting_code'; 
}

export type AirgramAuthenticatedState = {
    type: 'authenticated';
    me: UserUnion;
    chats: Chats;
    messages: Messages;
};

export type AirgramState = AirgramLoadingState | AirgramUnauthenticatedState | AirgramAuthenticatedState;

isString(process.env.REACT_APP_APP_ID);
isString(process.env.REACT_APP_APP_HASH);

export const airgram = new Airgram({
    apiId: parseInt(process.env.REACT_APP_APP_ID, 10),
    apiHash: process.env.REACT_APP_APP_HASH,
});

async function innerLoadAuthenticatedState(): Promise<AirgramAuthenticatedState> {
    const me = toObject(await airgram.api.getMe());
    const chats = await loadChats(airgram);

    return {
        type: 'authenticated',
        me,
        chats,
        messages: loadMessagesInitialState(),
    }
}

const loadAuthenticatedState = createAsyncThunk('airgram/loadAuthenticatedState', async () => {
    return await innerLoadAuthenticatedState();
});

export const loadInitialState = createAsyncThunk('airgram/loadInitialState', async (): Promise<AirgramState> => {
    const { response } = await airgram.api.getAuthorizationState();
    assert(!isError(response));

    console.log(response);

    if (response._ === 'authorizationStateReady') {
        // We're authorized, so load the authenticated state
        return await innerLoadAuthenticatedState();
    }

    const telegramAuthorizationStateToOursMapping: Partial<Record<AuthorizationStateUnion['_'], AirgramUnauthenticatedState['authorizationState']>> = {
        'authorizationStateWaitPhoneNumber': 'waiting_phone_number',
        'authorizationStateWaitCode': 'waiting_code',
    };

    const newAuthorizationState = telegramAuthorizationStateToOursMapping[response._];
    assert(newAuthorizationState !== undefined);

    return {
        type: 'unauthenticated',
        authorizationState: newAuthorizationState,
    }
})

export const setAuthenticationPhoneNumber = createAsyncThunk('airgram/setAuthenticationPhoneNumber', async (phoneNumber: string): Promise<void> => {
    await airgram.api.setAuthenticationPhoneNumber({ phoneNumber });
})

export const setAuthenticationCode = createAsyncThunk('airgram/setAuthenticationCode', async (code: string): Promise<void> => {
    await airgram.api.checkAuthenticationCode({ code });
})

const initialState: AirgramState = {
    type: 'loading',
};

export const airgramSlice = createSlice({
    name: 'airgram',
    initialState: (): AirgramState => initialState,
    reducers: {
        updateAuthorizationState: (state, action: PayloadAction<AuthorizationStateUnion>) => {
            const telegramAuthorizationState = action.payload;
            const telegramAuthorizationStateToOursMapping: Partial<Record<AuthorizationStateUnion['_'], AirgramUnauthenticatedState['authorizationState']>> = {
                'authorizationStateWaitPhoneNumber': 'waiting_phone_number',
                'authorizationStateWaitCode': 'waiting_code',
            };

            const newAuthorizationState = telegramAuthorizationStateToOursMapping[telegramAuthorizationState._];
            assert(newAuthorizationState !== undefined);

            return {
                type: 'unauthenticated',
                authorizationState: newAuthorizationState,
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadInitialState.fulfilled, (state, action) => action.payload)
            .addCase(loadAuthenticatedState.fulfilled, (state, action) => action.payload)
        
        configureBuilder(builder);
    },
});

export const configureAirgramEventListeners = (dispatch: AppDispatch, getState: () => RootState) => {
    airgram.on('updateAuthorizationState', async ({ update }) => {
        const authorizationState = update.authorizationState;
        const filteredEventTypes: AuthorizationStateUnion['_'][] = [
            'authorizationStateWaitTdlibParameters',
            'authorizationStateWaitEncryptionKey',
            'authorizationStateClosing',
            'authorizationStateClosed',
        ];

        console.log(update);

        if (filteredEventTypes.includes(authorizationState._)) {
            return;
        }

        if (authorizationState._ === 'authorizationStateReady') {
            dispatch(loadAuthenticatedState());

            return;
        }

        dispatch(airgramSlice.actions.updateAuthorizationState(authorizationState));
    })
}

export const selectAirgramState = (state: RootState) => state.airgram;

export default airgramSlice.reducer;