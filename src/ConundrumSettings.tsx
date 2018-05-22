import * as React from 'react';
import { IConundrumSettings } from './Conundrum';
import './Screen.css';

interface IConundrumSettingsProps {
    settings: IConundrumSettings;
}

export class ConundrumSettings extends React.PureComponent<IConundrumSettingsProps, {}> {
    public render() {
        return (
            <div className="screen screen--editConundrum">
                Conundrum editor
            </div>
        );
    }
}
