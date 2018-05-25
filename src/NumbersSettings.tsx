import * as React from 'react';
import { Button } from './Button';
import { defaultSettingsName } from './Constants';
import { INumbersGameSettings } from './NumbersGame';
import './Screen.css';

interface INumbersSettingsProps {
    settings: INumbersGameSettings;
    settingsName?: string;
    cancel: () => void;
    save: (name: string) => void;
    delete: () => void;
}

interface INumbersSettingsState {
    name: string;
    smallNumbers: number[];
    bigNumbers: number[];
    numberCount: number;
    minTarget: number;
    maxTarget: number;
}

export class NumbersSettings extends React.PureComponent<INumbersSettingsProps, INumbersSettingsState> {
    constructor(props: INumbersSettingsProps) {
        super(props);

        this.state = {
            bigNumbers: props.settings.bigNumbers.slice(),
            maxTarget: props.settings.maxTarget,
            minTarget: props.settings.minTarget,
            name: props.settingsName === undefined ? '' : props.settingsName,
            numberCount: props.settings.numberCount,
            smallNumbers: props.settings.smallNumbers.slice(),
        };
    }
    
    public render() {
        const setName = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            name: e.target.value,
        });

        const setNumberCount = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            numberCount: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
        });

        const setMinTarget = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            minTarget: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
        });

        const setMaxTarget = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            maxTarget: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
        });

        const setBigNumbers = (e: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
            bigNumbers: e.target.value === '' ? [] : e.target.value.split(' ').map(v => parseInt(v, 10)).filter(v => !isNaN(v)),
        });

        const setSmallNumbers = (e: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
            smallNumbers: e.target.value === '' ? [] : e.target.value.split(' ').map(v => parseInt(v, 10)).filter(v => !isNaN(v)),
        });
        
        const cancel = () => this.props.cancel();
        const save = () => this.save();
        const deleteThis = () => this.props.delete();

        return (
            <div className="screen screen--editNumbers">
                <div className="settingsSection settingsSection--name">
                    <div className="settingsSection__name">Editing numbers game: </div>
                    <input type="text" className="settingsSection__input" placeholder="(enter name)" value={this.state.name} onChange={setName} />
                </div>

                <div className="settingsSection settingsSection--vertical settingsSection--detail screen__text">
                    <p>How many numbers do the players get?</p>
                    <input type="number"
                        className="settingsSection__input"
                        placeholder="(enter value)"
                        value={this.state.numberCount}
                        onChange={setNumberCount}
                    />

                    <p>What's the smallest allowed target?</p>
                    <input type="number"
                        className="settingsSection__input"
                        placeholder="(enter value)"
                        value={this.state.minTarget}
                        onChange={setMinTarget}
                    />

                    <p>What's the largest allowed target?</p>
                    <input type="number"
                        className="settingsSection__input"
                        placeholder="(enter value)"
                        value={this.state.maxTarget}
                        onChange={setMaxTarget}
                    />
                </div>

                <div className="settingsSection settingsSection--vertical settingsSection--detail screen__text">
                    <p>Specify all the big numbers, with a space between each</p>
                    <textarea
                        className="settingsSection__input"
                        placeholder="(enter value)"
                        value={this.state.bigNumbers.join(' ') + ' '}
                        onChange={setBigNumbers}
                    />
                </div>
                
                <div className="settingsSection settingsSection--vertical settingsSection--detail screen__text">
                    <p>Specify all the small numbers, with a space between each</p>
                    <textarea
                        className="settingsSection__input"
                        placeholder="(enter value)"
                        value={this.state.smallNumbers.join(' ') + ' '}
                        onChange={setSmallNumbers}
                    />
                </div>
                
                <div className="settingsSection settingsSection--actions">
                    <Button enabled={this.canSave()} text="Save" onClick={save} />
                    <Button enabled={true} text="Cancel" onClick={cancel} />
                    <Button enabled={this.props.settingsName !== undefined} text="Delete" onClick={deleteThis} />
                </div>
            </div>
        );
    }

    private canSave() {
        const name = this.state.name.trim();
        if (name.length === 0 || name === defaultSettingsName) {
            return false;
        }

        if (this.state.bigNumbers.length === 0) {
            return false;
        }

        if (this.state.smallNumbers.length === 0) {
            return false;
        }
            
        return true;
    }

    private save() {
        const settings = this.props.settings;
        
        settings.numberCount = this.state.numberCount;
        settings.minTarget = this.state.minTarget;
        settings.maxTarget = this.state.maxTarget;
        settings.bigNumbers = this.state.bigNumbers;
        settings.smallNumbers = this.state.smallNumbers;
        
        this.props.save(this.state.name);
    }
}
