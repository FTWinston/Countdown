import * as React from 'react';
import { INumbersGameSettings } from './NumbersGame';
import './Screen.css';

interface INumbersSettingsProps {
    settings: INumbersGameSettings;
}

export class NumbersSettings extends React.PureComponent<INumbersSettingsProps, {}> {
    public render() {
        return (
            <div className="screen screen--editNumbers">
                Numbers editor
            </div>
        );
    }
}
