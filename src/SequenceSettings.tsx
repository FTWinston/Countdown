import * as React from 'react';
import { Button } from './Button';
import { defaultSettingsName } from './Constants';
import { Game } from './Enums';
import { GameSettings, ISequenceSettings } from './GameSettings';
import './StepListItem.css';

interface ISequenceSettingsProps {
    settings: ISequenceSettings;
    settingsName?: string;
    allSettings: GameSettings[];
    cancel: () => void;
    save: () => void;
    delete: () => void;
}

interface ISequenceSettingsState {
    name: string;
    steps: GameSettings[];
    selectedSetting: GameSettings;
}

export class SequenceSettings extends React.PureComponent<ISequenceSettingsProps, ISequenceSettingsState> {
    constructor(props: ISequenceSettingsProps) {
        super(props);

        this.state = {
            name: props.settingsName === undefined ? '' : props.settingsName,
            selectedSetting: props.allSettings[0],
            steps: props.settings.games,
        };
    }
    
    public render() {
        const setName = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            name: e.target.value,
        });

        const addStep = () => this.addSelectedStep();

        const cancel = () => this.props.cancel();
        const save = () => this.save();
        const deleteThis = () => this.props.delete();

        return (
            <div className="screen screen--editLetters">
                <div className="settingsSection settingsSection--name">
                    <div className="settingsSection__name">Editing game sequence: </div>
                    <input type="text" className="settingsSection__input" placeholder="(enter name)" value={this.state.name} onChange={setName} />
                </div>
                
                <div className="settingsSection settingsSection--vertical settingsSection--stepList screen__text">
                    <p>Current sequence</p>
                    {this.state.steps.map((step, index) => this.renderSequenceStep(step, index))}
                </div>

                <div className="settingsSection settingsSection--vertical settingsSection--detail screen__text">
                    <p>Add steps to your sequence</p>
                    {this.renderStepSelection()}
                    <Button enabled={true} text="Add" onClick={addStep} />
                </div>
                
                <div className="settingsSection settingsSection--actions">
                    <Button enabled={this.canSave()} text="Save" onClick={save} />
                    <Button enabled={true} text="Cancel" onClick={cancel} />
                    <Button enabled={this.props.settingsName !== undefined} text="Delete" onClick={deleteThis} />
                </div>
            </div>
        );
    }

    private getName(type: Game) {
        return type === Game.Letters   ? 'Letters'
             : type === Game.Numbers   ? 'Numbers'
             : type === Game.Conundrum ? 'Conundrum'
             : '?'
    }

    private renderSequenceStep(step: GameSettings, index: number) {
        const moveUp = () => this.moveStep(index, -1);
        const moveDown = () => this.moveStep(index, 1);
        const remove = () => this.removeStep(index);

        return (
            <div className="stepListItem" key={index}>
                <div className="stepListItem__name">
                    <em>{this.getName(step.type)}</em>: {step.name}
                </div>
                <div className="stepListItem__moveUp" onClick={index === 0 ? undefined : moveUp} />
                <div className="stepListItem__moveDown" onClick={index === this.state.steps.length - 1 ? undefined : moveDown} />
                <div className="stepListItem__delete" onClick={remove} />
            </div>
        );
    }
    
    private renderStepSelection() {
        const options = [];

        let i = 0;
        for (const setting of this.props.allSettings) {
            options.push(<option key={i} value={i}>{this.getName(setting.type)}: {setting.name}</option>);
            i++;
        }

        const changeSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
            const newIndex = parseInt(event.target.value, 10);
            this.setState({
                selectedSetting: this.props.allSettings[newIndex],
            });
        };

        const selectedIndex = this.props.allSettings.indexOf(this.state.selectedSetting);

        return (
            <select className="settingsSection__select" value={selectedIndex} onChange={changeSelected}>
                {options}
            </select>
        );
    }

    private addSelectedStep() {
        this.setState(prevState => {
            const newSteps = prevState.steps.slice();
            newSteps.push(this.state.selectedSetting);

            return {
                steps: newSteps,
            };
        })
    }

    private moveStep(index: number, change: number) {
        this.setState(prevState => {
            const newSteps = prevState.steps.slice();
            const movingStep = newSteps.splice(index, 1)[0];

            newSteps.splice(index + change, 0, movingStep);

            return {
                steps: newSteps,
            };
        })
    }

    private removeStep(index: number) {
        this.setState(prevState => {
            const newSteps = prevState.steps.slice();
            newSteps.splice(index, 1);

            return {
                steps: newSteps,
            };
        })
    }

    private canSave() {
        const name = this.state.name.trim();
        if (name.length === 0 || name === defaultSettingsName) {
            return false;
        }

        if (this.state.steps.length < 1) {
            return false;
        }

        return true;
    }

    private save() {
        const settings = this.props.settings;
        
        settings.name = this.state.name;
        settings.games = this.state.steps.slice();
        
        this.props.save();
    }
}
