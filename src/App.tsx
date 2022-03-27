import React, { useEffect } from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { loadInitialState, selectAirgramState } from './features/airgram/airgramSlice';
import { Authenticate } from './features/authenticate/Authenticate';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => { dispatch(loadInitialState()) }, [dispatch]);

  const airgramState = useAppSelector(selectAirgramState);
  let topLevelComponent;

  if (airgramState.type === 'loading') {
    topLevelComponent = <h1>Loading</h1>;
  } else if (airgramState.type === 'unauthenticated') {
    topLevelComponent = <Authenticate unauthenticatedState={airgramState} />;
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
