import * as React from 'react';
import { ILettersGameSettings } from './LettersGame';
import './Screen.css';

interface ILettersSettingsProps {
    settings: ILettersGameSettings;
}

export class LettersSettings extends React.PureComponent<ILettersSettingsProps, {}> {
    public render() {
        return (
            <div className="screen screen--editLetters">
                Letters editor
            </div>
        );
    }
}
