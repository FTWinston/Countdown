import * as React from 'react';
import { Conundrum } from './Conundrum';
import { Interlude } from './Interlude';
import { LettersGame } from './LettersGame';
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
    conundrumSize: number;
}

class App extends React.PureComponent<{}, IAppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            conundrumSize: 9,
            currentScreen: AppScreen.Welcome,
            maxLetters: 9,
            minLetters: 9,
            screenQueue: [],
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
                return <div />;
            case AppScreen.Letters:
                return (
                    <LettersGame
                        minLetters={this.state.minLetters}
                        maxLetters={this.state.maxLetters}
                        endGame={nextScreen}
                    />
                );
            case AppScreen.Numbers:
                return <div />;
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
            screen = queue.pop() as AppScreen;
        }

        this.setState({
            currentScreen: screen,
            screenQueue: queue,
        })
    }
}

export default App;
