import React from 'react';
import { RecoilRoot } from 'recoil';
import './App.scss';
import { Momentum } from './momentum/momentum';

function App() {
  return (
    <>
      <RecoilRoot>
        <Momentum />
      </RecoilRoot>
    </>
  );
}

export default App;
