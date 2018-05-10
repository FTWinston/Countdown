import * as React from 'react';
import './Tile.css';

interface ITileProps {
    text: string;
}

export class Tile extends React.PureComponent<ITileProps, {}> {
    public render() {
        let classes = 'tile';
        if (this.props.text === '') {
            classes += ' tile--blank';
        }

        return (
            <div className={classes}>
                {this.props.text}
            </div>
        );
    }
}