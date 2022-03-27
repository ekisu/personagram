import { Airgram, AuthorizationStateUnion, isError, toObject, UserUnion } from "@airgram/web";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isString } from "typed-assert";
import { assert } from '../../utils';
import { AppDispatch, RootState } from "../../app/store";

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
};

export type AirgramState = AirgramLoadingState | AirgramUnauthenticatedState | AirgramAuthenticatedState;

isString(process.env.REACT_APP_APP_ID);
isString(process.env.REACT_APP_APP_HASH);

const airgram = new Airgram({
    apiId: parseInt(process.env.REACT_APP_APP_ID, 10),
    apiHash: process.env.REACT_APP_APP_HASH,
});

async function loadAuthenticatedState(): Promise<AirgramAuthenticatedState> {
    const me = toObject(await airgram.api.getMe());

    return {
        type: 'authenticated',
        me,
    };
}

export const loadInitialState = createAsyncThunk('airgram/loadInitialState', async (): Promise<AirgramState> => {
    const { response } = await airgram.api.getAuthorizationState();
    assert(!isError(response));

    if (response._ === 'authorizationStateReady') {
        // We're authorized, so load the authenticated state
        return await loadAuthenticatedState();
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
            if (newAuthorizationState === undefined) {
                throw new Error('ye');
            }

            return {
                type: 'unauthenticated',
                authorizationState: newAuthorizationState,
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadInitialState.fulfilled, (state, action) => {
                const newState = action.payload;

                // FIXME this is kinda wacky, the assertions are mostly to satisfy TS
                state.type = newState.type;
                if (state.type === 'authenticated') {
                    assert(state.type === newState.type);
                    state.me = newState.me;
                } else if (state.type === 'unauthenticated') {
                    assert(state.type === newState.type);
                    state.authorizationState = newState.authorizationState;
                }
            })
    },
});

export const configureAirgramEventListeners = (dispatch: AppDispatch, getState: () => RootState) => {
    airgram.on('updateAuthorizationState', async ({ update }) => {
        const authorizationState = update.authorizationState;

        dispatch(airgramSlice.actions.updateAuthorizationState(authorizationState));
    })
}

export const selectAirgramState = (state: RootState) => state.airgram;

export default airgramSlice.reducer;