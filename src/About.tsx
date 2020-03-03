import * as React from 'react';
import { Button } from './Button';
import './Screen.css';
import { TileSet } from './TileSet';

interface IAboutProps {
    goBack: () => void;
}

export const About: React.FC<IAboutProps> = props => {
    const goBack = () => props.goBack();

    return (
        <div className="screen screen--about">
            <TileSet text={['C','O','U','N','T','D','O','W','N']} />
            <div className="screen__text">
                <p><a href="http://www.channel4.com/programmes/countdown">Countdown</a> is a long-running British
                TV game show, involving word and number puzzles. It has been running since 1982.</p>
                <p>This version forced its way out of my brain over a weekend in May 2018, when I really should
                have been focusing on more important things. 
                It is free, <a href="https://github.com/FTWinston/Countdown">open source</a> and you're welcome
                to contribute.</p>
                <p><strong>Letters games</strong> have a player randomly pick letters (by choosing either
                consonants or vowels, one at a time), and then attempting to form the longest-possible word
                from those letters. The player with the longest <em>valid</em> word when the time runs out
                should be awarded a number of points corresponding to the length of the word. In the case of a tie,
                award points to all tied players.</p>
                <p><strong>Numbers games</strong> have a player pick numbers (choosing a combination of "big" and
                "small" numbers) and then attempt to work out a sequence of calculations with these numbers whose
                final result is as close to a given target as possible.
                The player wth the closest result should be awarded pointspoints: 10 for reaching it exactly,
                7 for being 1-5 away, 5 for being 6-10 away.</p>
                <p>The <strong>conundrum</strong> shows players a scrambled word that they compete to guess as
                quickly as possible. When a player guesses, the clock is stopped, but if they guess wrongly,
                they may not guess again. The first player to guess correctly should be awarded 10 points.</p>
            </div>
            <div className="screen__actions">
                <Button
                    text="Go back"
                    onClick={goBack}
                    enabled={true}
                />
            </div>
        </div>
    );
}
