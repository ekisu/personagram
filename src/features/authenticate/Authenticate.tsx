import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { AirgramUnauthenticatedState, setAuthenticationCode, setAuthenticationPhoneNumber } from "../airgram/airgramSlice";

type AuthenticateProps = {
    unauthenticatedState: AirgramUnauthenticatedState,
}

export function Authenticate({ unauthenticatedState: state }: AuthenticateProps) {
    const dispatch = useAppDispatch();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');

    const insertPhoneNumberComponent =
        <div>
            <h2>Insert Phone Number:</h2>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <button onClick={() => dispatch(setAuthenticationPhoneNumber(phoneNumber))}>
                Send
            </button>
        </div>;
    
    const insertCodeComponent =
        <div>
            <h2>Insert Code:</h2>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
            <button onClick={() => dispatch(setAuthenticationCode(code))}>
                Send
            </button>
        </div>;

    const component = state.authorizationState === 'waiting_phone_number'
        ? insertPhoneNumberComponent
        : insertCodeComponent;
    
    return (
        <div>
            {component}
        </div>
    )
}