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
    editingSettingsName?: string;
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

    public componentDidUpdate(prevProps: ISettingsProps, prevState: ISettingsState) {
        if (prevState.selectedLettersSettingName !== this.state.selectedLettersSettingName) {
            this.props.setLettersSettings(this.state.selectedLettersSettingName, this.state.allLettersSettings[this.state.selectedLettersSettingName]);
        }
        
        if (prevState.selectedNumbersSettingName !== this.state.selectedNumbersSettingName) {
            this.props.setNumbersSettings(this.state.selectedNumbersSettingName, this.state.allNumbersSettings[this.state.selectedNumbersSettingName]);
        }
        
        if (prevState.selectedConundrumSettingName !== this.state.selectedConundrumSettingName) {
            this.props.setConundrumSettings(this.state.selectedConundrumSettingName, this.state.allConundrumSettings[this.state.selectedConundrumSettingName]);
        }
    }

    public render() {
        if (this.state.editingSettings !== undefined) {
            const saveEdit = (name: string) => this.saveEdit(name);
            const cancelEdit = () => this.cancelEdit();
            const deleteEdit = () => this.deleteEdit();

            if (this.state.editingSettings.game === 'LETTERS') {
                return (
                    <LettersSettings
                        settings={this.state.editingSettings}
                        settingsName={this.state.editingSettingsName}
                        save={saveEdit}
                        cancel={cancelEdit}
                        delete={deleteEdit}
                    />
                );
            }
            else if (this.state.editingSettings.game === 'NUMBERS') {
                return (
                    <NumbersSettings
                        settings={this.state.editingSettings}
                        settingsName={this.state.editingSettingsName}
                        save={saveEdit}
                        cancel={cancelEdit}
                        delete={deleteEdit}
                    />
                );
            }
            else if (this.state.editingSettings.game === 'CONUNDRUM') {
                return (
                    <ConundrumSettings
                        settings={this.state.editingSettings}
                        settingsName={this.state.editingSettingsName}
                        save={saveEdit}
                        cancel={cancelEdit}
                        delete={deleteEdit}
                    />
                );
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
            editingSettingsName: selectedSettingsName,
        });

        const showNew = () => this.setState({
            editingSettings: createNew(),
            editingSettingsName: undefined,
        });

        return (
            <div className="settingsSection settingsSection--main">
                <div className="settingsSection__nameAndSelect screen__text">
                    <div className="settingsSection__name">{sectionName} settings</div>
                    <select className="settingsSection__select" value={selectedSettingsName} onChange={changeSelected}>
                        {options}
                    </select>
                </div>
                <Button
                    text="Edit"
                    onClick={showEdit}
                    enabled={selectedSettingsName !== defaultSettingsName}
                />
                <Button
                    text="Add new"
                    onClick={showNew}
                    enabled={true}
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

    private cancelEdit() {
        this.setState({
            editingSettings: undefined,
            editingSettingsName: undefined,
        });
    }

    private saveEdit(name: string) {
        if (this.state.editingSettings === undefined) {
            return;
        }

        switch(this.state.editingSettings.game) {
            case 'LETTERS':
                this.saveEditLetters(name, this.state.editingSettings);
                break;
            
            case 'NUMBERS':
                this.saveEditNumbers(name, this.state.editingSettings);
                break;
            
            case 'CONUNDRUM':
                this.saveEditConundrum(name, this.state.editingSettings);
                break;
        }

        this.cancelEdit();
    }

    private deleteEdit() {
        if (this.state.editingSettings === undefined) {
            return;
        }

        switch(this.state.editingSettings.game) {
            case 'LETTERS':
                this.saveDeleteLetters();
                break;
            
            case 'NUMBERS':
                this.saveDeleteNumbers();
                break;
            
            case 'CONUNDRUM':
                this.saveDeleteConundrum();
                break;
        }

        this.cancelEdit();
    }

    private saveEditLetters(name: string, settings: ILettersGameSettings) {
        if (this.state.editingSettingsName !== undefined) {
            delete this.state.allLettersSettings[this.state.editingSettingsName];
        }

        this.state.allLettersSettings[name] = settings;
        this.setState({
            allLettersSettings: this.state.allLettersSettings,
            selectedLettersSettingName: name,
        });

        this.saveSettings('lettersSettings', this.state.allLettersSettings);
        this.props.setLettersSettings(name, settings);
    }

    private saveEditNumbers(name: string, settings: INumbersGameSettings) {
        if (this.state.editingSettingsName !== undefined) {
            delete this.state.allNumbersSettings[this.state.editingSettingsName];
        }

        this.state.allNumbersSettings[name] = settings;
        this.setState({
            allNumbersSettings: this.state.allNumbersSettings,
            selectedNumbersSettingName: name,
        });

        this.saveSettings('numbersSettings', this.state.allNumbersSettings);
        this.props.setNumbersSettings(name, settings);
    }

    private saveEditConundrum(name: string, settings: IConundrumSettings) {
        if (this.state.editingSettingsName !== undefined) {
            delete this.state.allConundrumSettings[this.state.editingSettingsName];
        }

        this.state.allConundrumSettings[name] = settings;
        this.setState({
            allConundrumSettings: this.state.allConundrumSettings,
            selectedConundrumSettingName: name,
        });
        
        this.saveSettings('conundrumSettings', this.state.allConundrumSettings);
        this.props.setConundrumSettings(name, settings);
    }

    private saveDeleteLetters() {
        if (this.state.editingSettingsName === undefined) {
            return;
        }

        delete this.state.allLettersSettings[this.state.editingSettingsName];
        this.setState({
            allLettersSettings: this.state.allLettersSettings,
            selectedLettersSettingName: defaultSettingsName,
        });
        
        this.saveSettings('lettersSettings', this.state.allLettersSettings);
        this.props.setLettersSettings(defaultSettingsName, this.state.allLettersSettings[defaultSettingsName]);
    }

    private saveDeleteNumbers() {
        if (this.state.editingSettingsName === undefined) {
            return;
        }

        delete this.state.allNumbersSettings[this.state.editingSettingsName];
        this.setState({
            allNumbersSettings: this.state.allNumbersSettings,
            selectedNumbersSettingName: defaultSettingsName,
        });
        
        this.saveSettings('numberssSettings', this.state.allNumbersSettings);
        this.props.setNumbersSettings(defaultSettingsName, this.state.allNumbersSettings[defaultSettingsName]);
    }

    private saveDeleteConundrum() {
        if (this.state.editingSettingsName === undefined) {
            return;
        }

        delete this.state.allConundrumSettings[this.state.editingSettingsName];
        this.setState({
            allConundrumSettings: this.state.allConundrumSettings,
            selectedConundrumSettingName: defaultSettingsName,
        });
        
        this.saveSettings('conundrumSettings', this.state.allConundrumSettings);
        this.props.setConundrumSettings(defaultSettingsName, this.state.allConundrumSettings[defaultSettingsName]);
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
    
    private saveSettings<TSetting>(keyName: string, settings: { [key:string]: TSetting }) {
        const defaultSettings = settings[defaultSettingsName];
        delete settings[defaultSettingsName];

        localStorage.setItem(keyName, JSON.stringify(settings));

        settings[defaultSettingsName] = defaultSettings;
    }
}
