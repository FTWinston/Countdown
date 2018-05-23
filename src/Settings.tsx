import * as React from 'react';
import { Button } from './Button';
import { defaultSettingsName } from './Constants';
import { IConundrumSettings } from './Conundrum';
import { ConundrumSettings } from './ConundrumSettings';
import { defaultConundrumSettings, defaultLettersSettings, defaultNumbersSettings, GameSettings } from './GameSettings';
import { ILettersGameSettings } from './LettersGame';
import { LettersSettings } from './LettersSettings';
import { INumbersGameSettings } from './NumbersGame';
import { NumbersSettings } from './NumbersSettings';
import './Settings.css';

interface ISettingsProps {
    setLettersSettings: (name: string, settings: ILettersGameSettings) => void;
    setNumbersSettings: (name: string, settings: INumbersGameSettings) => void;
    setConundrumSettings: (name: string, settings: IConundrumSettings) => void;
    goBack: () => void;
}

interface ISettingsState {
    allLettersSettings: { [key:string]: ILettersGameSettings };
    allNumbersSettings: { [key:string]: INumbersGameSettings };
    allConundrumSettings: { [key:string]: IConundrumSettings };

    selectedLettersSettingName: string;
    selectedNumbersSettingName: string;
    selectedConundrumSettingName: string;

    editingSettings?: GameSettings;
}

export class Settings extends React.PureComponent<ISettingsProps, ISettingsState> {
    constructor(props: ISettingsProps) {
        super(props);

        this.state = {
            allConundrumSettings: this.loadConundrumSettings(),
            allLettersSettings: this.loadLettersSettings(),
            allNumbersSettings: this.loadNumbersSettings(),

            selectedConundrumSettingName: defaultSettingsName,
            selectedLettersSettingName: defaultSettingsName,
            selectedNumbersSettingName: defaultSettingsName,
        }
    }

    public render() {
        if (this.state.editingSettings !== undefined) {
            if (this.state.editingSettings.game === 'LETTERS') {
                return <LettersSettings settings={this.state.editingSettings} />;
            }
            else if (this.state.editingSettings.game === 'NUMBERS') {
                return <NumbersSettings settings={this.state.editingSettings} />;
            }
            else if (this.state.editingSettings.game === 'CONUNDRUM') {
                return <ConundrumSettings settings={this.state.editingSettings} />;
            }
        }
        
        const goBack = () => this.props.goBack();
        return (
            <div className="screen screen--settings">
                {this.renderLettersSection()}
                {this.renderNumbersSection()}
                {this.renderConundrumSection()}
                <div className="screen__section">
                    <Button enabled={true} text="Go back" onClick={goBack} />
                </div>
            </div>
        );
    }

    private renderSection<TSetting extends GameSettings>(
        sectionName: string,
        settings: { [key:string]: TSetting },
        selectedSettingsName: string,
        selectValue: (val: string) => void,
        createNew: () => TSetting,
    ) {
        const options = [];

        for (const key in settings) {
            if (settings.hasOwnProperty(key)) {
                options.push(<option key={key} value={key}>{key}</option>);
            }
        }

        const changeSelected = (event: React.ChangeEvent<HTMLSelectElement>) => selectValue(event.target.value);

        const showEdit = () => this.setState({
            editingSettings: settings[selectedSettingsName],
        });

        const showNew = () => this.setState({
            editingSettings: createNew(),
        });

        return (
            <div className="settingsSection">
                <div className="settingsSection__nameAndSelect">
                    <div className="settingsSection__name">{sectionName} settings</div>
                    <select className="settingsSection__select" value={selectedSettingsName} onChange={changeSelected}>
                        {options}
                    </select>
                </div>
                &nbsp;
                <Button
                    text="Edit"
                    onClick={showEdit}
                    enabled={selectedSettingsName !== defaultSettingsName}
                    className="button--short"
                />
                &nbsp;
                <Button
                    text="Add new"
                    onClick={showNew}
                    enabled={true}
                    className="button--short"
                />
            </div>
        );
    }

    private renderLettersSection() {
        return this.renderSection(
            'Letters',
            this.state.allLettersSettings,
            this.state.selectedLettersSettingName,
            val => this.setState({ selectedLettersSettingName: val }),
            () => this.createNewLettersSettings(),
        );
    }

    private renderNumbersSection() {
        return this.renderSection(
            'Numbers',
            this.state.allNumbersSettings, 
            this.state.selectedNumbersSettingName,
            val => this.setState({ selectedNumbersSettingName: val }),
            () => this.createNewNumbersSettings(),
        );
    }

    private renderConundrumSection() {
        return this.renderSection(
            'Conundrum',
            this.state.allConundrumSettings,
            this.state.selectedConundrumSettingName,
            val => this.setState({ selectedConundrumSettingName: val }),
            () => this.createNewConundrumSettings(),
        );
    }

    private createNewLettersSettings() {
        const settings = Object.assign({}, defaultLettersSettings);
        settings.consonants = defaultLettersSettings.consonants.slice();
        settings.vowels = defaultLettersSettings.vowels.slice();
        return settings;
    }

    private createNewNumbersSettings() {
        const settings = Object.assign({}, defaultNumbersSettings);
        settings.bigNumbers = defaultNumbersSettings.bigNumbers.slice();
        settings.smallNumbers = defaultNumbersSettings.smallNumbers.slice();
        return settings;
    }

    private createNewConundrumSettings() {
        return Object.assign({}, defaultConundrumSettings);
    }

    private loadSettings<TSetting>(keyName: string, defaultSettings: TSetting) {
        const strSettings = localStorage.getItem(keyName);
        const all: { [key:string]: TSetting } = strSettings === null ? {} : JSON.parse(strSettings);
        all[defaultSettingsName] = defaultSettings;
        return all;
    }

    private loadLettersSettings() {
        return this.loadSettings('lettersSettings', defaultLettersSettings);
    }

    private loadNumbersSettings() {
        return this.loadSettings('numbersSettings', defaultNumbersSettings);
    }

    private loadConundrumSettings() {
        return this.loadSettings('conundrumSettings', defaultConundrumSettings);
    }
/*
    private saveSettings<TSetting>(keyName: string, settings: { [key:string]: TSetting }) {
        localStorage.setItem(keyName, JSON.stringify(settings));
    }

    private saveLettersSettings() {
        this.saveSettings('lettersSettings', this.state.allLettersSettings);
    }

    private saveNumbersSettings() {
        this.saveSettings('numbersSettings', this.state.allNumbersSettings);
    }

    private saveConundrumSettings() {
        this.saveSettings('conundrumSettings', this.state.allConundrumSettings);
    }
*/
}
