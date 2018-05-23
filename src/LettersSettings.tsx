import * as React from 'react';
import { Button } from './Button';
import { defaultSettingsName } from './Constants';
import { ILettersGameSettings } from './LettersGame';
import './Screen.css';

interface ILettersSettingsProps {
    settings: ILettersGameSettings;
    settingsName?: string;
    cancel: () => void;
    save: (name: string) => void;
}

interface ILettersSettingsState {
    name: string;
    minLetters: number;
    maxLetters: number;
    minConsonants: number;
    minVowels: number;
    consonants: string[];
    vowels: string[];
}

export class LettersSettings extends React.PureComponent<ILettersSettingsProps, ILettersSettingsState> {
    constructor(props: ILettersSettingsProps) {
        super(props);

        this.state = {
            consonants: props.settings.consonants.slice(),
            maxLetters: props.settings.maxLetters,
            minConsonants: props.settings.minConsonants,
            minLetters: props.settings.minLetters,
            minVowels: props.settings.minVowels,
            name: props.settingsName === undefined ? '' : props.settingsName,
            vowels: props.settings.vowels.slice(),
        };
    }
    
    public render() {
        const setName = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            name: e.target.value,
        });

        const setMinLetters = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            minLetters: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
        });

        const setMaxLetters = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            maxLetters: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
        });

        const setMinConsonants = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            minConsonants: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
        });

        const setMinVowels = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            minVowels: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
        });

        const setConsonants = (e: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
            consonants: e.target.value.split(''),
        });

        const setVowels = (e: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
            vowels: e.target.value.split(''),
        });

        const cancel = () => this.props.cancel();
        const save = () => this.save();
        return (
            <div className="screen screen--editLetters">
                <div className="settingsSection">
                    <div className="settingsSection__name">Editing letters game: </div>
                    <input type="text" className="settingsSection__input" placeholder="(enter name)" value={this.state.name} onChange={setName} />
                </div>
                
                <div className="settingsSection settingsSection--vertical screen__text">
                    <p>Minimum number of letters allowed</p>
                    <input type="number"
                        className="settingsSection__input"
                        placeholder="(enter value)"
                        value={this.state.minLetters}
                        onChange={setMinLetters}
                    />

                    <p>Maximum number of letters allowed</p>
                    <input type="number"
                        className="settingsSection__input"
                        placeholder="(enter value)"
                        value={this.state.maxLetters}
                        onChange={setMaxLetters}
                    />
                </div>
                
                <div className="settingsSection settingsSection--vertical screen__text">
                    <p>Minimum number of consonants allowed</p>
                    <input type="number"
                        className="settingsSection__input"
                        placeholder="(enter value)"
                        value={this.state.minConsonants}
                        onChange={setMinConsonants}
                    />

                    <p>Minimum number of vowels allowed</p>
                    <input type="number"
                        className="settingsSection__input"
                        placeholder="(enter value)"
                        value={this.state.minVowels}
                        onChange={setMinVowels}
                    />
                </div>

                <div className="settingsSection settingsSection--vertical screen__text">
                    <p>Specify the distribution of consonants to use</p>
                    <textarea
                        className="settingsSection__input"
                        placeholder="(enter values)"
                        value={this.state.consonants.join('')}
                        onChange={setConsonants}
                    />
                </div>

                <div className="settingsSection settingsSection--vertical screen__text">
                    <p>Specify the distribution of vowels to use</p>
                    <textarea
                        className="settingsSection__input"
                        placeholder="(enter values)"
                        value={this.state.vowels.join('')}
                        onChange={setVowels}
                    />
                </div>
                
                <div className="settingsSection">
                    <Button enabled={this.canSave()} text="Save" onClick={save} />
                    <Button enabled={true} text="Cancel" onClick={cancel} />
                </div>
            </div>
        );
    }

    private canSave() {
        const name = this.state.name.trim();
        if (name.length === 0 || name === defaultSettingsName) {
            return false;
        }

        if (this.state.consonants.length === 0) {
            return false;
        }

        if (this.state.vowels.length === 0) {
            return false;
        }
            
        return true;
    }

    private save() {
        const settings = this.props.settings;
        
        settings.minLetters = this.state.minLetters;
        settings.maxLetters = this.state.maxLetters;
        settings.minConsonants = this.state.minConsonants;
        settings.minVowels = this.state.minVowels;
        settings.consonants = this.state.consonants;
        settings.vowels = this.state.vowels;
        
        this.props.save(this.state.name);
    }
}
