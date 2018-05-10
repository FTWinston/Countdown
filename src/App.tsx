import * as React from 'react';
import { LettersGame } from './LettersGame';

class App extends React.Component {
  public render() {
    return (
      <LettersGame minLetters={9} maxLetters={9} />
    );
  }
}

export default App;
