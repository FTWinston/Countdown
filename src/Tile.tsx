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
        if (this.props.text.length > 2) {
            classes += ' tile--long';
        }

        return (
            <div className={classes}>
                {this.props.text}
            </div>
        );
    }
}