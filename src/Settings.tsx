import * as React from 'react';
import { IConundrumSettings } from './Conundrum';
import { ILettersGameSettings } from './LettersGame';
import { INumbersGameSettings } from './NumbersGame';
import './Screen.css';

interface ISettingsProps {
    setLettersSettings: (settings: ILettersGameSettings) => void;
    setNumbersSettings: (settings: INumbersGameSettings) => void;
    setConundrumSettings: (settings: IConundrumSettings) => void;
}

export class Settings extends React.PureComponent<ISettingsProps, {}> {
    public render() {
        return (
            <div className="screen screen--settings">
                TO-DO
            </div>
        );
    }
}
