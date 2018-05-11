import * as React from 'react';
import { Button } from './Button';
import { Clock } from './Clock';
import { GameState } from './GameState';
import { randomInt, shuffle } from './Random';
import './Screen.css';
import { TileSet } from './TileSet';

interface INumbersGameProps {
    smallNumbers: number[];
    bigNumbers: number[];
    numberCount: number;
    minTarget: number;
    maxTarget: number;
    endGame: () => void;
}

interface INumbersGameState {
    state: GameState;
    numbers: number[];
    target: number;
    timeLeft: number;
    solution?: string
    hasChosen: boolean;
}

export class NumbersGame extends React.PureComponent<INumbersGameProps, INumbersGameState> {
    private timerID: number;

    constructor(props: INumbersGameProps) {
        super(props);

        this.state = {
            hasChosen: false,
            numbers: [],
            state: GameState.Setup,
            target: 0,
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
                buttonsEtc = this.renderFinished(false); break;
            case GameState.Revealed:
                buttonsEtc = this.renderFinished(true); break;
        }

        const target = this.state.target === 0
            ? undefined
            : <div className="screen__target">{this.state.target}</div>;

        return (
            <div className="screen screen--letters">
                {clock}
                {target}
                <TileSet text={this.state.numbers.map(n => n.toString())} size={this.props.numberCount} />
                {buttonsEtc}
            </div>
        );
    }

    private renderSetup() {
        const buttons: JSX.Element[] = [];
        for (let i = 0 ; i <= this.props.bigNumbers.length; i++) {
            const text = i === 1 ? '1 big number' : `${i} big numbers`;
            const action = () => this.chooseNumbers(i);
            
            buttons.push(<Button text={text} enabled={!this.state.hasChosen} onClick={action} key={i} />);
        }

        return (
            <div className="screen__actions">
                {buttons}
            </div>
        );
    }

    private renderFinished(showSolutions: boolean) {
        const endGame = () => this.props.endGame();
        const revealSolution = () => this.showSolutions();

        const solutions = showSolutions
            ? this.renderSolution()
            : <Button text="Show solution" enabled={true} onClick={revealSolution} />;

        return (
            <div className="screen__actions">
                {solutions}

                <Button text="End game" enabled={true} onClick={endGame} />
            </div>
        );
    }

    private renderSolution() {
        return (
            <div className="game__solution">
                {this.state.solution}
            </div>
        );
    }

    private showSolutions() {
        // TODO: retrieve from background thread somewhere

        this.setState({
            solution: 'Sorry, cannot yet solve these',
            state: GameState.Revealed,
        });
    }

    private async chooseNumbers(numBig: number) {
        this.setState({
            hasChosen: true,
        });

        const big = shuffle(this.props.bigNumbers.slice());
        const small = shuffle(this.props.smallNumbers.slice());

        let numAdded = 0;
        for (numAdded=0; numAdded<numBig; numAdded++) {
            await this.delay(750);
            this.addNumber(big.pop() as number);
        }

        for (numAdded; numAdded<this.props.numberCount; numAdded++) {
            await this.delay(750);
            this.addNumber(small.pop() as number);
        }

        await this.delay(1500);

        this.setState({
            target: randomInt(this.props.minTarget, this.props.maxTarget + 1),
        });

        await this.delay(1500);
        this.startGame();
    }

    private addNumber(num: number) {
        this.setState(prevState => {
            const allNumbers = prevState.numbers.slice();
            allNumbers.push(num);
            return {
                numbers: allNumbers,
            };
        })
    }

    private delay(milliseconds: number): Promise<void> {
        return new Promise<void>(resolve => {
            setTimeout(() => {
                resolve();
            }, milliseconds);
        });
    }

    private startGame() {
        this.setState({ state: GameState.Active });
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
