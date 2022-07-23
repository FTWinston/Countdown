import * as React from 'react';
import { Button } from './Button';
import { defaultSettingsName } from './Constants';
import { ConundrumSettings } from './ConundrumSettings';
import { defaultConundrumSettings, defaultGameSequence, defaultLettersSettings, defaultNumbersSettings } from './DefaultSettings';
import { Game, Sequence } from './Enums';
import { EditableSettings, IConundrumSettings, ILettersGameSettings, INumbersGameSettings, ISequenceSettings } from './GameSettings';
import { LettersSettings } from './LettersSettings';
import { NumbersSettings } from './NumbersSettings';
import { SequenceSettings } from './SequenceSettings';
import './Settings.css';

interface ISettingsProps {
    setLettersSettings: (settings: ILettersGameSettings) => void;
    setNumbersSettings: (settings: INumbersGameSettings) => void;
    setConundrumSettings: (settings: IConundrumSettings) => void;
    setSequenceSettings: (settings: ISequenceSettings) => void;
    goBack: () => void;
}

interface ISettingsState {
    allLettersSettings: { [key:string]: ILettersGameSettings };
    allNumbersSettings: { [key:string]: INumbersGameSettings };
    allConundrumSettings: { [key:string]: IConundrumSettings };
    allSequenceSettings: { [key:string]: ISequenceSettings };

    selectedLettersSettingName: string;
    selectedNumbersSettingName: string;
    selectedConundrumSettingName: string;
    selectedSequenceSettingName: string;

    editingSettings?: EditableSettings;
    editingSettingsName?: string;
}

interface IFlattenedSequenceSettings {
    name: string;
    games: Array<[Game, string]>;
}

export class Settings extends React.PureComponent<ISettingsProps, ISettingsState> {
    constructor(props: ISettingsProps) {
        super(props);

        const letters = this.loadLettersSettings();
        const numbers = this.loadNumbersSettings();
        const conundrums = this.loadConundrumSettings();
        const sequences = this.loadSequenceSettings(letters, numbers, conundrums);

        this.state = {
            allConundrumSettings: conundrums,
            allLettersSettings: letters,
            allNumbersSettings: numbers,
            allSequenceSettings: sequences,

            selectedConundrumSettingName: defaultSettingsName,
            selectedLettersSettingName: defaultSettingsName,
            selectedNumbersSettingName: defaultSettingsName,
            selectedSequenceSettingName: defaultSettingsName,
        }
    }

    public componentDidUpdate(prevProps: ISettingsProps, prevState: ISettingsState) {
        if (prevState.selectedLettersSettingName !== this.state.selectedLettersSettingName) {
            this.props.setLettersSettings(this.state.allLettersSettings[this.state.selectedLettersSettingName]);
        }
        
        if (prevState.selectedNumbersSettingName !== this.state.selectedNumbersSettingName) {
            this.props.setNumbersSettings(this.state.allNumbersSettings[this.state.selectedNumbersSettingName]);
        }
        
        if (prevState.selectedConundrumSettingName !== this.state.selectedConundrumSettingName) {
            this.props.setConundrumSettings(this.state.allConundrumSettings[this.state.selectedConundrumSettingName]);
        }
    }

    public render() {
        if (this.state.editingSettings !== undefined) {
            const saveEdit = () => this.saveEdit();
            const cancelEdit = () => this.cancelEdit();
            const deleteEdit = () => this.deleteEdit();

            if (this.state.editingSettings.type === Sequence.GameSequence) {
                return (
                    <SequenceSettings
                        settings={this.state.editingSettings}
                        settingsName={this.state.editingSettingsName}
                        allSettings={this.joinAllSettings()}
                        save={saveEdit}
                        cancel={cancelEdit}
                        delete={deleteEdit}
                    />
                );
            }
            else if (this.state.editingSettings.type === Game.Letters) {
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
            else if (this.state.editingSettings.type === Game.Numbers) {
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
            else if (this.state.editingSettings.type === Game.Conundrum) {
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
                {this.renderSequenceSection()}
                <div className="screen__section">
                    <Button enabled={true} text="Go back" onClick={goBack} />
                </div>
            </div>
        );
    }

    private renderSection<TSetting extends EditableSettings>(
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

    private renderSequenceSection() {
        return this.renderSection(
            'Game sequence',
            this.state.allSequenceSettings,
            this.state.selectedSequenceSettingName,
            val => this.setState({ selectedSequenceSettingName: val }),
            () => this.createNewSequenceSettings(),
        );
    }

    private joinAllSettings() {
        const allSettings = [];

        for (const key in this.state.allLettersSettings) {
            if (!this.state.allLettersSettings.hasOwnProperty(key)) {
                continue;
            }

            const item = this.state.allLettersSettings[key];
            allSettings.push(item);
        }
        
        for (const key in this.state.allNumbersSettings) {
            if (!this.state.allNumbersSettings.hasOwnProperty(key)) {
                continue;
            }

            const item = this.state.allNumbersSettings[key];
            allSettings.push(item);
        }

        for (const key in this.state.allConundrumSettings) {
            if (!this.state.allConundrumSettings.hasOwnProperty(key)) {
                continue;
            }

            const item = this.state.allConundrumSettings[key];
            allSettings.push(item);
        }

        return allSettings;
    }

    private cancelEdit() {
        this.setState({
            editingSettings: undefined,
            editingSettingsName: undefined,
        });
    }

    private saveEdit() {
        if (this.state.editingSettings === undefined) {
            return;
        }

        switch(this.state.editingSettings.type) {
            case Game.Letters:
                this.saveEditLetters(this.state.editingSettings);
                break;
            
            case Game.Numbers:
                this.saveEditNumbers(this.state.editingSettings);
                break;
            
            case Game.Conundrum:
                this.saveEditConundrum(this.state.editingSettings);
                break;

            case Sequence.GameSequence:
                this.saveEditSequence(this.state.editingSettings);
                break;
        }

        this.cancelEdit();
    }

    private deleteEdit() {
        if (this.state.editingSettings === undefined) {
            return;
        }

        if (this.state.editingSettings.type !== Sequence.GameSequence) {
            // if we delete something, remove it from every sequence its in
            let wasInSequence = false;
            for (const key in this.state.allSequenceSettings) {
                if (!this.state.allSequenceSettings.hasOwnProperty(key)) {
                    const sequence = this.state.allSequenceSettings[key];

                    while (true) {
                        const index = sequence.games.indexOf(this.state.editingSettings);
                        if (index === -1) {
                            break;
                        }

                        sequence.games.splice(index, 1);
                        wasInSequence = true;
                    }
                }
            }

            if (wasInSequence) {
                this.saveSequenceSettings();
            }
        }

        switch(this.state.editingSettings.type) {
            case Game.Letters:
                this.saveDeleteLetters();
                break;
            
            case Game.Numbers:
                this.saveDeleteNumbers();
                break;
            
            case Game.Conundrum:
                this.saveDeleteConundrum();
                break;

            case Sequence.GameSequence:
                this.saveDeleteSequence();
                break;
        }

        this.cancelEdit();
    }

    private saveEditLetters(settings: ILettersGameSettings) {
        const updatedSettings = Object.assign({}, this.state.allLettersSettings);

        if (this.state.editingSettingsName !== undefined) {
            delete updatedSettings[this.state.editingSettingsName];
        }

        updatedSettings[settings.name] = settings;
        this.setState({
            allLettersSettings: updatedSettings,
            selectedLettersSettingName: settings.name,
        });

        this.saveSettings('lettersSettings', updatedSettings);
        this.props.setLettersSettings(settings);
    }

    private saveEditNumbers(settings: INumbersGameSettings) {
        const updatedSettings = Object.assign({}, this.state.allNumbersSettings);

        if (this.state.editingSettingsName !== undefined) {
            delete updatedSettings[this.state.editingSettingsName];
        }

        updatedSettings[settings.name] = settings;
        this.setState({
            allNumbersSettings: updatedSettings,
            selectedNumbersSettingName: settings.name,
        });

        this.saveSettings('numbersSettings', updatedSettings);
        this.props.setNumbersSettings(settings);
    }

    private saveEditConundrum(settings: IConundrumSettings) {
        const updatedSettings = Object.assign({}, this.state.allConundrumSettings);

        if (this.state.editingSettingsName !== undefined) {
            delete updatedSettings[this.state.editingSettingsName];
        }

        updatedSettings[settings.name] = settings;
        this.setState({
            allConundrumSettings: updatedSettings,
            selectedConundrumSettingName: settings.name,
        });
        
        this.saveSettings('conundrumSettings', updatedSettings);
        this.props.setConundrumSettings(settings);
    }

    private saveEditSequence(settings: ISequenceSettings) {
        if (this.state.editingSettingsName !== undefined) {
            delete this.state.allSequenceSettings[this.state.editingSettingsName];
        }

        const allSequenceSettings = {
            ...this.state.allSequenceSettings,
            [settings.name]: settings,
        }
        this.setState({
            allSequenceSettings: allSequenceSettings,
            selectedSequenceSettingName: settings.name,
        });
        
        this.saveSequenceSettings();
        this.props.setSequenceSettings(settings);
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
        this.props.setLettersSettings(this.state.allLettersSettings[defaultSettingsName]);
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
        
        this.saveSettings('numbersSettings', this.state.allNumbersSettings);
        this.props.setNumbersSettings(this.state.allNumbersSettings[defaultSettingsName]);
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
        this.props.setConundrumSettings(this.state.allConundrumSettings[defaultSettingsName]);
    }

    private saveDeleteSequence() {
        if (this.state.editingSettingsName === undefined) {
            return;
        }

        delete this.state.allSequenceSettings[this.state.editingSettingsName];
        this.setState({
            allSequenceSettings: this.state.allSequenceSettings,
            selectedSequenceSettingName: defaultSettingsName,
        });
        
        this.saveSequenceSettings();
        this.props.setSequenceSettings(this.state.allSequenceSettings[defaultSettingsName]);
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

    private createNewSequenceSettings() {
        const settings = Object.assign({}, defaultGameSequence);
        settings.games = defaultGameSequence.games.slice();
        return settings;
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

    private loadSequenceSettings(
        letters: { [key:string]: ILettersGameSettings },
        numbers: { [key:string]: INumbersGameSettings },
        conundrums: { [key:string]: IConundrumSettings },
    ) {
        // replace each [type, name] with actual GameSettings
        const strSettings = localStorage.getItem('sequenceSettings');
        const allFlattenedSettings: { [key:string]: IFlattenedSequenceSettings } = strSettings === null ? {} : JSON.parse(strSettings);
        const allFullSettings = {};
        
        for (const key in allFlattenedSettings) {
            if (!allFlattenedSettings.hasOwnProperty(key)) {
                continue;
            }

            const flattenedSettings = allFlattenedSettings[key];
            const fullSettings: ISequenceSettings = {
                games: flattenedSettings.games.map(game => {
                    switch (game[0]) {
                        case Game.Letters:
                            return letters[game[1]];
                        case Game.Numbers:
                            return numbers[game[1]];
                        case Game.Conundrum:
                        default:
                            return conundrums[game[1]];
                    }
                }),
                name: flattenedSettings.name,
                type: Sequence.GameSequence,
            };

            allFullSettings[key] = fullSettings;
        }
        
        allFullSettings[defaultSettingsName] = defaultGameSequence;

        return allFullSettings;
    }
    
    private saveSettings<TSetting>(keyName: string, settings: { [key: string]: TSetting }) {
        const defaultSettings = settings[defaultSettingsName];
        delete settings[defaultSettingsName];

        localStorage.setItem(keyName, JSON.stringify(settings));

        settings[defaultSettingsName] = defaultSettings;
    }

    private saveSequenceSettings() {
        // replace each GameSettings with [type, name]
        const allFlattenedSettings: { [key: string]: IFlattenedSequenceSettings } = {};
        const allFullSettings = this.state.allSequenceSettings;

        for (const key in allFullSettings) {
            if (!allFullSettings.hasOwnProperty(key)) {
                continue;
            }

            const fullSettings = allFullSettings[key];
            const flattenedSettings: IFlattenedSequenceSettings = {
                games: fullSettings.games.map(game => [game.type, game.name] as [Game, string]),
                name: fullSettings.name,
            };

            allFlattenedSettings[key] = flattenedSettings;
        }

        this.saveSettings('sequenceSettings', allFlattenedSettings);
    }
}
