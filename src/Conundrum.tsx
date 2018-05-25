import * as React from 'react';
import Worker from 'worker-loader!./ConundrumWorker';
import { Button } from './Button';
import { Clock } from './Clock';
import { musicStartPosition } from './Constants';
import { IConundrumSettings } from './GameSettings';
import { GameState } from './GameState';
import { shuffle } from './Random';
import './Screen.css';
import { TileSet } from './TileSet';

interface IConundrumProps {
    settings: IConundrumSettings;
    endGame: () => void;
    audio: HTMLAudioElement;
}

interface IConundrumState {
    state: GameState;
    conundrumLetters: string[];
    solutionLetters: string[];
    timeLeft: number;
}

export class Conundrum extends React.PureComponent<IConundrumProps, IConundrumState> {
    private timerID: number;
    private worker?: Worker;

    constructor(props: IConundrumProps) {
        super(props);

        this.state = {
            conundrumLetters: [],
            solutionLetters: [],
            state: GameState.Setup,
            timeLeft: 30,
        };
    }
    
    public componentDidMount() {
        if (this.props.settings.word === undefined) {
            this.worker = new Worker();

            this.worker.onmessage = (m) => {
                const data = m.data as [string, string];
                this.setState({
                    conundrumLetters: data[0].split(''),
                    solutionLetters: data[1].split(''),
                });
            };
            
            this.worker.postMessage(['generate', this.props.settings.numLetters]);
        }
        else {
            const scrambled = this.props.settings.scrambled === undefined
                ? shuffle(this.props.settings.word.split('')).join('')
                : this.props.settings.scrambled;

            this.setState({
                conundrumLetters: scrambled.split(''),
                solutionLetters: this.props.settings.word.split(''),
            });
        }
    }

    public componentWillUpdate(nextProps: IConundrumProps, nextState: IConundrumState) {
        if (this.state.state === GameState.WaitingForWorker
            && this.state.conundrumLetters.length === 0
            && nextState.conundrumLetters.length > 0
        ) {
            this.startGame();
        }
    }

    public render() {
        const clock = this.state.state === GameState.Active || this.state.state === GameState.Paused
            ? <Clock time={this.state.timeLeft} />
            : undefined;
        
        let screenClasses = 'screen screen--conundrum';

        let buttonsEtc: JSX.Element | undefined;
        switch (this.state.state) {
            case GameState.Setup:
            case GameState.WaitingForWorker:
                screenClasses += ' screen--setup';
                buttonsEtc = this.renderSetup();
                break;
            case GameState.Active:
                screenClasses += ' screen--active';
                buttonsEtc = this.renderPause();
                break;
            case GameState.Paused:
                screenClasses += ' screen--active';
                buttonsEtc = this.renderResume();
                break;
            case GameState.Finished:
                screenClasses += ' screen--finished';
                buttonsEtc = this.renderFinished();
                break;
            case GameState.Revealed:
                screenClasses += ' screen--finished';
                buttonsEtc = this.renderRevealed();
                break;
        }

        return (
            <div className={screenClasses}>
                {clock}
                <TileSet text={this.state.state === GameState.Setup ? [] : this.state.conundrumLetters} size={this.props.settings.numLetters} />
                <TileSet
                    className="tileset--solution"
                    text={this.state.state === GameState.Revealed ? this.state.solutionLetters : []}
                    size={this.props.settings.numLetters}
                />
                {buttonsEtc}
            </div>
        );
    }

    private renderSetup() {
        const startGame = () => this.tryStartGame();

        return (
            <div className="screen__actions">
                <Button
                    text="Start"
                    enabled={true}
                    onClick={startGame}
                />
            </div>
        );
    }

    private renderPause() {
        const pause = () => this.pauseGame();

        return (
            <div className="screen__actions">
                <Button
                    text="Pause"
                    enabled={true}
                    onClick={pause}
                />
                <Button
                    text="Reveal"
                    enabled={false}
                />
            </div>
        );
    }

    private renderResume() {
        const resume = () => this.resumeGame();
        const reveal = () => this.setState({ state: GameState.Revealed });

        return (
            <div className="screen__actions">
                <Button
                    text="Resume"
                    enabled={true}
                    onClick={resume}
                />
                <Button
                    text="Reveal"
                    enabled={true}
                    onClick={reveal}
                />
            </div>
        );
    }

    private renderFinished() {
        const reveal = () => this.setState({ state: GameState.Revealed });

        return (
            <div className="game--actions">
                <Button
                    text="Reveal"
                    enabled={true}
                    onClick={reveal}
                />
            </div>
        );
    }

    private renderRevealed() {
        const endGame = () => this.props.endGame();

        return (
            <div className="game--actions">
                <Button
                    text="End game"
                    enabled={true}
                    onClick={endGame}
                />
            </div>
        );
    }

    private tryStartGame() {
        // don't start until we have a conundrum. Wait for the worker...
        if (this.worker !== undefined && this.state.conundrumLetters.length === 0) {
            this.worker.postMessage(['respond', 0]);

            this.setState({
                state: GameState.WaitingForWorker,
            });
            return;
        }

        this.startGame()
    }

    private startGame() {
        if (this.worker !== undefined) {
            this.worker.terminate();
        }

        this.props.audio.currentTime = musicStartPosition;
        this.props.audio.play();

        this.setState({
            state: GameState.Active,
        });

        this.timerID = window.setInterval(() => this.tick(), 1000);
    }

    private tick() {
        this.setState(prevState => {
            const secsRemaining = prevState.timeLeft - 1;
            const finished = secsRemaining === -1;

            if (finished) {
                window.clearInterval(this.timerID);
            }

            return {
                state: finished ? GameState.Finished : GameState.Active,
                timeLeft: secsRemaining,
            };
        })
    }

    private pauseGame() {
        window.clearInterval(this.timerID);
        
        this.props.audio.pause();

        this.setState({
            state: GameState.Paused,
        });
    }

    private resumeGame() {
        // the clock starts/stops to the nearest second, so the music needs to do the same
        this.props.audio.currentTime = musicStartPosition + (30 - this.state.timeLeft);
        this.props.audio.play();

        this.setState({
            state: GameState.Active,
        });

        this.timerID = window.setInterval(() => this.tick(), 1000);
    }
}
