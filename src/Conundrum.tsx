import * as React from 'react';
import { Button } from './Button';
import { Clock } from './Clock';
import workerScript from './ConundrumWorker';
import { GameState } from './GameState';
import './Screen.css';
import { TileSet } from './TileSet';

interface IConundrumProps {
    numLetters: number;
    endGame: () => void;
}

interface IConundrumState {
    state: GameState;
    conundrumLetters: string[];
    solutionLetters: string[];
    timeLeft: number;
}

export class Conundrum extends React.PureComponent<IConundrumProps, IConundrumState> {
    private timerID: number;
    private worker: Worker;

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
        this.worker = new Worker(workerScript);

        this.worker.onmessage = (m) => {
            const data = m.data as [string, string];
            this.setState({
                conundrumLetters: data[0].split(''),
                solutionLetters: data[1].split(''),
            });
        };
        
        this.worker.postMessage(['generate', this.props.numLetters]);
    }

    public componentWillUpdate(nextProps: IConundrumProps, nextState: IConundrumState) {
        if (this.state.conundrumLetters.length === 0 && nextState.conundrumLetters.length > 0) {
            this.startGame();
        }
    }

    public render() {
        const clock = this.state.state === GameState.Active ? <Clock time={this.state.timeLeft} /> : undefined;
        
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
                <TileSet text={this.state.conundrumLetters} size={this.props.numLetters} />
                <TileSet
                    className="tileset--solution"
                    text={this.state.state === GameState.Revealed ? this.state.solutionLetters : []}
                    size={this.props.numLetters}
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
        if (this.state.conundrumLetters.length === 0) {
            this.worker.postMessage(['respond', 0]);

            this.setState({
                state: GameState.WaitingForWorker,
            });
            return;
        }

        this.startGame()
    }

    private startGame() {
        this.worker.terminate();

        this.setState({
            state: GameState.Active,
        });

        this.timerID = window.setInterval(() => this.tick(), 1000);
    }

    private tick() {
        this.setState(prevState => {
            const secsRemaining = prevState.timeLeft - 1;
            const finished = secsRemaining === 0;

            if (finished) {
                window.clearInterval(this.timerID);
            }

            return {
                state: finished ? GameState.Finished : GameState.Active,
                timeLeft: secsRemaining,
            };
        })
    }
}
