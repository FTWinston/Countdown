import * as React from 'react';
import { Conundrum } from './Conundrum';
import { Interlude } from './Interlude';
import { LettersGame } from './LettersGame';
import { NumbersGame } from './NumbersGame';
import { Welcome } from './Welcome';

const enum AppScreen {
    Welcome,
    Setup,
    Letters,
    Numbers,
    Conundrum,
    Interlude,
}

interface IAppState {
    currentScreen: AppScreen;
    screenQueue: AppScreen[];
    minLetters: number;
    maxLetters: number;
    smallNumbers: number[];
    bigNumbers: number[];
    numberCount: number;
    minTarget: number;
    maxTarget: number;
    conundrumSize: number;
}

class App extends React.PureComponent<{}, IAppState> {
    constructor(props: {}) {
        super(props);

        // TODO: letters should be weighted as per scrabble
        // TODO: letters game needs min 3 vowels and min 4 consonants. Store these values in app the state.
        this.state = {
            bigNumbers: [25, 50, 75, 100],
            conundrumSize: 9,
            currentScreen: AppScreen.Welcome,
            maxLetters: 9,
            maxTarget: 999,
            minLetters: 9,
            minTarget: 101,
            numberCount: 6,
            screenQueue: [],
            smallNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        };
    }

    public render() {
        const nextScreen = () => this.advanceToNextScreen();
        const selectLetters = () => this.startLetters();
        const selectNumbers = () => this.startNumbers();
        const selectConundrum = () => this.startConundrum();
        const selectFullShow = () => this.startFullShow();
        
        switch (this.state.currentScreen) {
            case AppScreen.Interlude:
                return <Interlude endGame={nextScreen} />;
            case AppScreen.Setup:
                return <div>No configuration currently available</div>;
            case AppScreen.Letters:
                return (
                    <LettersGame
                        minLetters={this.state.minLetters}
                        maxLetters={this.state.maxLetters}
                        endGame={nextScreen}
                    />
                );
            case AppScreen.Numbers:
                return (
                    <NumbersGame
                        numberCount={this.state.numberCount}
                        minTarget={this.state.minTarget}
                        maxTarget={this.state.maxTarget}
                        smallNumbers={this.state.smallNumbers}
                        bigNumbers={this.state.bigNumbers}
                        endGame={nextScreen}
                    />
                );
            case AppScreen.Conundrum:
                return (
                    <Conundrum
                        numLetters={this.state.conundrumSize}
                        endGame={nextScreen}
                />
            );
            default:
                return (
                    <Welcome selectLetters={selectLetters}
                        selectNumbers={selectNumbers}
                        selectConundrum={selectConundrum}
                        selectFullShow={selectFullShow}
                    />
                );
        }
    }

    private startLetters() {
        this.setState({
            currentScreen: AppScreen.Interlude,
            screenQueue: [AppScreen.Letters],
        });
    }

    private startNumbers() {
        this.setState({
            currentScreen: AppScreen.Interlude,
            screenQueue: [AppScreen.Numbers],
        });
    }

    private startConundrum() {
        this.setState({
            currentScreen: AppScreen.Interlude,
            screenQueue: [AppScreen.Conundrum],
        });
    }

    private startFullShow() {
        this.setState({
            currentScreen: AppScreen.Interlude,
            screenQueue: [
                AppScreen.Letters,
                AppScreen.Letters,
                AppScreen.Numbers,
                AppScreen.Letters,
                AppScreen.Letters,
                AppScreen.Numbers,
                AppScreen.Conundrum,
            ],
        });
    }

    private advanceToNextScreen() {
        if (this.state.currentScreen !== AppScreen.Interlude) {
            this.setState({
                currentScreen: AppScreen.Interlude,
            });
            return;
        }

        const queue = this.state.screenQueue.slice();
        let screen: AppScreen;

        if (queue.length === 0) {
            screen = AppScreen.Welcome;
        }
        else {
            screen = queue.shift() as AppScreen;
        }

        this.setState({
            currentScreen: screen,
            screenQueue: queue,
        })
    }
}

export default App;
