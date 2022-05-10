import React, { useEffect } from 'react';
import './App.css';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { configureAirgramEventListeners, loadInitialState, selectAirgramState } from './features/airgram/airgramSlice';
import { Authenticate } from './features/authenticate/Authenticate';
import { store } from './app/store';
import ChatsList from './features/chats_list/ChatsList';
import { selectAuthenticatedViewState } from './features/authenticated_view/authenticatedViewSlice';
import Chat from './features/chat/Chat';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => { 
    configureAirgramEventListeners(dispatch, store.getState);
    dispatch(loadInitialState())
  }, [dispatch]);

  const airgramState = useAppSelector(selectAirgramState);
  const authenticatedViewState = useAppSelector(selectAuthenticatedViewState);

  let topLevelComponent;

  if (airgramState.type === 'loading') {
    topLevelComponent = <h1>Loading</h1>;
  } else if (airgramState.type === 'unauthenticated') {
    topLevelComponent = <Authenticate unauthenticatedState={airgramState} />;
  } else {
    switch (authenticatedViewState.type) {
    case 'chats_list':
      topLevelComponent = <ChatsList authenticatedState={airgramState} />;
      break;
    case 'chat':
      topLevelComponent = <Chat authenticatedState={airgramState} chatId={authenticatedViewState.chatId} />;
      break;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {topLevelComponent}
      </header>
    </div>
  );
}

export default App;
