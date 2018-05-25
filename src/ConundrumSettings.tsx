import * as React from 'react';
import { Button } from './Button';
import { defaultSettingsName } from './Constants';
import { IConundrumSettings } from './GameSettings';
import './Screen.css';

interface IConundrumSettingsProps {
    settingsName?: string;
    settings: IConundrumSettings;
    cancel: () => void;
    save: () => void;
    delete: () => void;
}

interface IConundrumSettingsState {
    name: string;
    useGivenWord: boolean;
    numLetters?: number;
    word: string;
    scrambled: string;
}

export class ConundrumSettings extends React.PureComponent<IConundrumSettingsProps, IConundrumSettingsState> {
    constructor(props: IConundrumSettingsProps) {
        super(props);

        this.state = {
            name: props.settingsName === undefined ? '' : props.settingsName,
            numLetters: props.settings.numLetters,
            scrambled: props.settings.scrambled === undefined ? '' : props.settings.scrambled,
            useGivenWord: props.settings.word !== undefined,
            word: props.settings.word === undefined ? '' : props.settings.word,
        };
    }
    public render() {
        const setName = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            name: e.target.value,
        });

        const showLength = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            useGivenWord: false,
        });

        const showWord = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            useGivenWord: true,
        });

        const cancel = () => this.props.cancel();
        const save = () => this.save();
        const deleteThis = () => this.props.delete();

        return (
            <div className="screen screen--editConundrum">
                <div className="settingsSection settingsSection--name">
                    <div className="settingsSection__name">Editing conundrum: </div>
                    <input type="text" className="settingsSection__input" placeholder="(enter name)" value={this.state.name} onChange={setName} />
                </div>
                <div className="settingsSection settingsSection--vertical settingsSection--detail screen__text">
                    <p>Should this conundrum pick a word itself, or use a specific word?</p>
                    <div>
                        <label className="settings__option">
                            Pick from a list 
                            <input type="radio" checked={!this.state.useGivenWord} onChange={showLength} />
                        </label>
                        <label className="settings__option">
                            Use specific word 
                            <input type="radio" checked={this.state.useGivenWord} onChange={showWord} />
                        </label>
                    </div>
                </div>
                {this.state.useGivenWord ? this.renderWordSection() : this.renderLengthSection()}
                
                <div className="settingsSection settingsSection--actions">
                    <Button enabled={this.canSave()} text="Save" onClick={save} />
                    <Button enabled={true} text="Cancel" onClick={cancel} />
                    <Button enabled={this.props.settingsName !== undefined} text="Delete" onClick={deleteThis} />
                </div>
            </div>
        );
    }

    private renderLengthSection() {
        const options = [];
        for (let i = 5; i <= 15; i++) {
            const length = i;
            const setLength = () => this.setState({ numLetters: length });
            options.push(<label key={i} className="settings__option">{i} <input type="radio" checked={this.state.numLetters === i} onChange={setLength} /></label>);
        }

        return (
            <div className="settingsSection settingsSection--vertical settingsSection--detail screen__text">
                <p>How many letters should this conundrum word have?</p>
                {options}
            </div>
        );
    }

    private renderWordSection() {
        const setWord = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            word: e.target.value.toUpperCase(),
        });
        
        const setScrambled = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            scrambled: e.target.value.toUpperCase(),
        });

        return (
            <div className="settingsSection settingsSection--vertical settingsSection--detail screen__text">
                <p>Enter the solution word.</p>
                <input type="text"
                    className="settingsSection__input"
                    placeholder="(enter word)"
                    value={this.state.word}
                    onChange={setWord}
                />

                <p>Optionally, enter the scrambled clue. Leave this blank to scramble automatically.</p>
                <input type="text"
                    className="settingsSection__input"
                    placeholder="(enter scrambled)"
                    value={this.state.scrambled}
                    onChange={setScrambled}
                />
            </div>
        );
    }

    private canSave() {
        const name = this.state.name.trim();
        if (name.length === 0 || name === defaultSettingsName) {
            return false;
        }

        if (this.state.useGivenWord) {
            const wordLength = this.state.word.trim().length;
            if (wordLength === 0) {
                return false;
            }

            const scrambledLength = this.state.scrambled.trim().length;
            if (scrambledLength !== 0 && scrambledLength !== wordLength) {
                return false;
            }
        }
            
        return true;
    }

    private save() {
        const settings = this.props.settings;
        if (this.state.useGivenWord) {
            const word = this.state.word.trim();
            const scrambled = this.state.scrambled.trim();

            settings.numLetters = word.length;
            settings.word = word;
            settings.scrambled = scrambled.length === 0 ? undefined : scrambled;
        }
        else {
            settings.numLetters = this.state.numLetters === undefined ? 9 : this.state.numLetters;
            settings.word = undefined;
            settings.scrambled = undefined;
        }
        
        this.props.save();
    }
}
