import * as React from 'react';
import { Button } from './Button';
import './Screen.css';
import { TileSet } from './TileSet';

interface IWelcomeProps {
    selectLetters: () => void;
    selectNumbers: () => void;
    selectConundrum: () => void;
    selectFullShow: () => void;
    selectAbout: () => void;
    selectSettings: () => void;
}

export class Welcome extends React.PureComponent<IWelcomeProps, {}> {
    public render() {
        return (
            <div className="screen screen--welcome">
                <TileSet text={['C','O','U','N','T','D','O','W','N']} />
                {this.renderActions()}
            </div>
        );
    }

    private renderActions() {
        const selectLetters = () => this.props.selectLetters();
        const selectNumbers = () => this.props.selectNumbers();
        const selectConundrum = () => this.props.selectConundrum();
        const selectFull = () => this.props.selectFullShow();
        const selectAbout = () => this.props.selectAbout();
        const selectSettings = () => this.props.selectSettings();

        return (
            <div className="screen__actions">
                <Button
                    text="Letters game"
                    enabled={true}
                    onClick={selectLetters}
                />
                <Button
                    text="Numbers game"
                    enabled={true}
                    onClick={selectNumbers}
                />
                <Button
                    text="Conundrum"
                    enabled={true}
                    onClick={selectConundrum}
                />
                <Button
                    text="Full session"
                    enabled={true}
                    onClick={selectFull}
                />
                <Button
                    text="⛭"
                    enabled={true}
                    onClick={selectSettings}
                />
                <Button
                    text="?"
                    enabled={true}
                    onClick={selectAbout}
                />
            </div>
        );
    }
}
