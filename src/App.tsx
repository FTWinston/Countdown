import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { About } from './About';
import { Conundrum } from './Conundrum';
import { defaultConundrumSettings, defaultGameSequence, defaultLettersSettings, defaultNumbersSettings } from './DefaultSettings';
import { AppScreen, Game } from './Enums';
import { focusNext, focusPrevious } from './focus';
import { GameSettings } from './GameSettings';
import { Interlude } from './Interlude';
import { LettersGame } from './LettersGame';
import { NumbersGame } from './NumbersGame';
import { Settings } from './Settings';
import { Welcome } from './Welcome';

export const App: React.FC = () => {
    const audio = useRef<HTMLAudioElement>(null);
    const [lettersSettings, setLettersSettings] = useState(defaultLettersSettings);
    const [numbersSettings, setNumbersSettings] = useState(defaultNumbersSettings);
    const [conundrumSettings, setConundrumSettings] = useState(defaultConundrumSettings);
    const [sequenceSettings, setSequenceSettings] = useState(defaultGameSequence);
    const [currentScreen, setCurrentScreen] = useState(AppScreen.Welcome);
    const [gameQueue, setGameQueue] = useState<GameSettings[]>([]);
    const [currentGame, setCurrentGame] = useState<GameSettings>();
    
    function showScreen(screen: AppScreen) {
        setCurrentScreen(AppScreen.Interlude);

        if (screen !== AppScreen.Game) {
            setCurrentGame(undefined);
        }

        window.setTimeout(() => setCurrentScreen(screen), 750);
    }

    function showGame(settings: GameSettings) {
        setCurrentGame(settings);
        showScreen(AppScreen.Game);
    }

    function startSequence() {
        const sequence = sequenceSettings.games.slice();
        const firstGame = sequence.shift() as GameSettings;

        setGameQueue(sequence);
        showGame(firstGame);
    }

    function showNextGameOrWelcome() {
        if (gameQueue.length === 0) {
            showScreen(AppScreen.Welcome);
            return;
        }
        
        const queue = gameQueue.slice();
        const next = queue.shift() as GameSettings;

        setGameQueue(queue);
        showGame(next);
    }

    const nextGame = () => showNextGameOrWelcome();
    const selectLetters = () => showGame(lettersSettings);
    const selectNumbers = () => showGame(numbersSettings);
    const selectConundrum = () => showGame(conundrumSettings);
    const selectFullShow = () => startSequence();
    const selectAbout = () => showScreen(AppScreen.About);
    const selectSettings = () => showScreen(AppScreen.Settings);
    const showWelcome = () => showScreen(AppScreen.Welcome);
    let renderScreen: JSX.Element;

    switch (currentScreen) {
        case AppScreen.Interlude:
            renderScreen = <Interlude />;
            break;
        case AppScreen.Settings:
            renderScreen = (
                <Settings
                    setLettersSettings={setLettersSettings}
                    setNumbersSettings={setNumbersSettings}
                    setConundrumSettings={setConundrumSettings}
                    setSequenceSettings={setSequenceSettings}
                    goBack={showWelcome}
                />
            );
            break;
        case AppScreen.About:
            renderScreen = <About goBack={showWelcome} />;
            break;
        case AppScreen.Game:
            if (currentGame !== undefined) {
                switch (currentGame.type) {            
                    case Game.Letters:
                        renderScreen = (
                            <LettersGame
                                settings={lettersSettings}
                                endGame={nextGame}
                                audio={audio.current!}
                            />
                        );
                        break;
                    case Game.Numbers:
                        renderScreen = (
                            <NumbersGame
                                settings={numbersSettings}
                                endGame={nextGame}
                                audio={audio.current!}
                            />
                        );
                        break;
                    case Game.Conundrum:
                        renderScreen = (
                            <Conundrum
                                settings={conundrumSettings}
                                endGame={nextGame}
                                audio={audio.current!}
                        />
                        );
                        break;
                    default:
                        renderScreen = <div />
                        break;
                }
                break;
            }
        default:
            renderScreen = (
                <Welcome
                    selectLetters={selectLetters}
                    selectNumbers={selectNumbers}
                    selectConundrum={selectConundrum}
                    selectSequence={selectFullShow}
                    selectAbout={selectAbout}
                    selectSettings={selectSettings}
                />
            );
            break;
    }

    useEffect(
        () => {
            document.addEventListener('keyup', e => {
                if (e.keyCode === 39 || e.keyCode === 40) {
                    focusNext();
                }
                else if (e.keyCode === 37 || e.keyCode === 38) {
                    focusPrevious();
                }
            });
        },
        []
    );

    return <>
        {renderScreen}
        <audio
            src="countdown.mp3"
            preload="auto"
            ref={audio}
        />
    </>
}