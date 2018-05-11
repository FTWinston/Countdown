import * as React from 'react';
import { Button } from './Button';
import { Clock } from './Clock';
import { GameState } from './GameState';
import { shuffle } from './Random';
import './Screen.css';
import { TileSet } from './TileSet';

interface IConundrumProps {
    numLetters: number;
    endGame: () => void;
}

interface ILettersGameState {
    state: GameState;
    conundrumLetters: string[];
    solutionLetters: string[];
    timeLeft: number;
}

export class Conundrum extends React.PureComponent<IConundrumProps, ILettersGameState> {
    private timerID: number;

    constructor(props: IConundrumProps) {
        super(props);

        this.state = {
            conundrumLetters: [],
            solutionLetters: [],
            state: GameState.Setup,
            timeLeft: 30,
        };
    }
    
    public render() {
        const clock = this.state.state === GameState.Active ? <Clock time={this.state.timeLeft} /> : undefined;
        
        let buttonsEtc: JSX.Element | undefined;
        switch (this.state.state) {
            case GameState.Setup:
                buttonsEtc = this.renderSetup(); break;
            case GameState.Finished:
                buttonsEtc = this.renderFinished(); break;
            case GameState.Revealed:
                buttonsEtc = this.renderRevealed(); break;
        }

        return (
            <div className="screen screen--conundrum">
                {clock}
                <TileSet text={this.state.conundrumLetters} size={this.props.numLetters} />
                <TileSet
                    text={this.state.state === GameState.Revealed ? this.state.solutionLetters : []}
                    size={this.props.numLetters}
                />
                {buttonsEtc}
            </div>
        );
    }

    private renderSetup() {
        const startGame = () => this.startGame();

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

    private startGame() {
        const solution = 'COUNTDOWN'.split('');
        const conundrum = shuffle(solution.slice());

        this.setState({
            conundrumLetters: conundrum,
            solutionLetters: solution,
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
