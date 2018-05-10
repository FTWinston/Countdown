import * as React from 'react';
import './Clock.css';

interface IClockProps {
    time: number;
}

export class Clock extends React.PureComponent<IClockProps, {}> {
    public render() {
        const classes = `clock clock--${this.props.time}s`;

        return (
            <div className={classes}>
                <div className="clock__hmarker" />
                <div className="clock__vmarker" />
                <div className="clock__hand" />
            </div>
        );
    }
}