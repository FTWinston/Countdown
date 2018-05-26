import * as React from 'react';
import { About } from './About';
import { Conundrum } from './Conundrum';
import { defaultConundrumSettings, defaultGameSequence, defaultLettersSettings, defaultNumbersSettings } from './DefaultSettings';
import { AppScreen, Game } from './Enums';
import { GameSettings, IConundrumSettings, ILettersGameSettings, INumbersGameSettings, ISequenceSettings } from './GameSettings';
import { Interlude } from './Interlude';
import { LettersGame } from './LettersGame';
import { NumbersGame } from './NumbersGame';
import { Settings } from './Settings';
import { Welcome } from './Welcome';

interface IAppState {
    currentScreen: AppScreen;
    gameQueue: GameSettings[];
    lettersSettings: ILettersGameSettings;
    numbersSettings: INumbersGameSettings;
    conundrumSettings: IConundrumSettings;
    sequenceSettings: ISequenceSettings;
    currentGame?: GameSettings;
}

class App extends React.PureComponent<{}, IAppState> {
    private audio: HTMLAudioElement;

    constructor(props: {}) {
        super(props);

        this.state = {
            conundrumSettings: defaultConundrumSettings,
            currentScreen: AppScreen.Welcome,
            gameQueue: [],
            lettersSettings: defaultLettersSettings,
            numbersSettings: defaultNumbersSettings,
            sequenceSettings: defaultGameSequence,
        };
    }

    public render() {
        return [
            this.renderAudio(),
            this.renderScreen(),
        ];
    }

    private renderScreen() {
        const nextGame = () => this.showNextGameOrWelcome();
        const selectLetters = () => this.showGame(this.state.lettersSettings);
        const selectNumbers = () => this.showGame(this.state.numbersSettings);
        const selectConundrum = () => this.showGame(this.state.conundrumSettings);
        const selectFullShow = () => this.startSequence();
        const selectAbout = () => this.showScreen(AppScreen.About);
        const selectSettings = () => this.showScreen(AppScreen.Settings);
        const showWelcome = () => this.showScreen(AppScreen.Welcome);
        const setLetters = (settings: ILettersGameSettings) => this.setLettersGameSettings(settings);
        const setNumbers = (settings: INumbersGameSettings) => this.setNumbersGameSettings(settings);
        const setConundrum = (settings: IConundrumSettings) => this.setConundrumSettings(settings);
        const setSequence = (settings: ISequenceSettings) => this.setSequenceSettings(settings);

        switch (this.state.currentScreen) {
            case AppScreen.Interlude:
                return <Interlude key="screen" />;
            case AppScreen.Settings:
                return (
                    <Settings
                        key="screen"
                        setLettersSettings={setLetters}
                        setNumbersSettings={setNumbers}
                        setConundrumSettings={setConundrum}
                        setSequenceSettings={setSequence}
                        goBack={showWelcome}
                    />
                );
            case AppScreen.About:
                return <About key="screen" goBack={showWelcome} />;
            case AppScreen.Game:
                if (this.state.currentGame !== undefined) {
                    switch (this.state.currentGame.type) {            
                        case Game.Letters:
                            return (
                                <LettersGame
                                    key="screen"
                                    settings={this.state.lettersSettings}
                                    endGame={nextGame}
                                    audio={this.audio}
                                />
                            );
                        case Game.Numbers:
                            return (
                                <NumbersGame
                                    key="screen"
                                    settings={this.state.numbersSettings}
                                    endGame={nextGame}
                                    audio={this.audio}
                                />
                            );
                        case Game.Conundrum:
                            return (
                                <Conundrum
                                    key="screen"
                                    settings={this.state.conundrumSettings}
                                    endGame={nextGame}
                                    audio={this.audio}
                            />
                        );
                    }
                }
            default:
                return (
                    <Welcome
                        key="screen"
                        selectLetters={selectLetters}
                        selectNumbers={selectNumbers}
                        selectConundrum={selectConundrum}
                        selectSequence={selectFullShow}
                        selectAbout={selectAbout}
                        selectSettings={selectSettings}
                    />
                );
        }
    }

    private renderAudio() {
        return (
            <audio
                src="countdown.mp3"
                preload="auto"
                key="audio"
                ref={a => { if (a !== null) { this.audio = a; }}}
            />
        )
    }

    private showScreen(screen: AppScreen) {
        this.setState({ currentScreen: AppScreen.Interlude });

        if (screen !== AppScreen.Game) {
            this.setState({ currentGame: undefined });
        }

        window.setTimeout(() => this.setState({ currentScreen: screen }), 750);
    }

    private showGame(settings: GameSettings) {
        this.setState({ currentGame: settings });
        this.showScreen(AppScreen.Game);
    }

    private startSequence() {
        const sequence = this.state.sequenceSettings.games.slice();
        const firstGame = sequence.shift() as GameSettings;

        this.setState({ gameQueue: sequence });
        this.showGame(firstGame);
    }

    private showNextGameOrWelcome() {
        if (this.state.gameQueue.length === 0) {
            this.showScreen(AppScreen.Welcome);
            return;
        }

        const queue = this.state.gameQueue.slice();
        const nextGame = queue.shift() as GameSettings;

        this.setState({ gameQueue: queue });
        this.showGame(nextGame);
    }

    private setLettersGameSettings(settings: ILettersGameSettings) {
        this.setState({
            lettersSettings: settings,
        });
    }

    private setNumbersGameSettings(settings: INumbersGameSettings) {
        this.setState({
            numbersSettings: settings,
        });
    }

    private setConundrumSettings(settings: IConundrumSettings) {
        this.setState({
            conundrumSettings: settings,
        });
    }

    private setSequenceSettings(settings: ISequenceSettings) {
        this.setState({
            sequenceSettings: settings,
        });
    }
}

export default App;
