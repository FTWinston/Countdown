import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import './Clock.css';

interface IClockProps {
    time: number;
}

export const Clock: React.FC<IClockProps> = props => {
    const root = useRef<HTMLDivElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);

    const [[width, height], setSize] = useState([0, 0]);

    // private resizeListener?: () => void;

    useEffect(
        () => {
            const resizeListener = () => setSize([root.current!.offsetWidth, root.current!.offsetHeight]);
            window.addEventListener('resize', resizeListener);
            resizeListener();
            return () => window.removeEventListener('resize', resizeListener);
        },
        [root]
    );

    useEffect(
        () => {
            if (canvas.current) {
                drawClock(canvas.current.getContext('2d')!, props.time, width, height);
            }
        },
        [props.time, width, height, canvas]
    );

    return (
        <div
            className="clock"
            ref={root}
        >
            <canvas
                className="clock__canvas"
                ref={canvas}
                width={width}
                height={height}
            />
        </div>
    );
}

function drawClock(ctx: CanvasRenderingContext2D, time: number, width: number, height: number) {
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    ctx.save();
    ctx.translate(cx, cy);

    const r =  Math.min(width, height) * 0.45;

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = '#dbccbd';
    ctx.strokeStyle = '#0e1b2c';
    ctx.lineWidth = r * 0.075;
    
    ctx.fill();
    ctx.stroke();

    const handAngle = Math.PI / 2 - Math.PI * time / 30;

    ctx.fillStyle = '#fffee6';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.35, -Math.PI / 2, handAngle, false);
    ctx.arc(0, 0, r * 0.9625, handAngle, -Math.PI / 2, true);
    ctx.fill();

    ctx.rotate(handAngle);
    ctx.fillStyle = '#0e1b2c';

    ctx.beginPath();
    ctx.moveTo(0, r * 0.05);
    ctx.lineTo(r, r * 0.005);
    ctx.lineTo(r, -r * 0.005);
    ctx.lineTo(0, -r * 0.05);
    ctx.arc(0, 0, r * 0.05, Math.PI / 2, 3 * Math.PI / 2);
    ctx.fill();

    ctx.rotate(-handAngle);

    ctx.lineWidth = r * 0.015;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(0, r);
    ctx.moveTo(-r, 0);
    ctx.lineTo(r, 0);
    ctx.stroke();

    ctx.rotate(Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.9);
    ctx.lineTo(0, -r * 0.6);
    ctx.moveTo(0, r * 0.9);
    ctx.lineTo(0, r * 0.6);
    ctx.stroke();

    ctx.rotate(Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.9);
    ctx.lineTo(0, -r * 0.6);
    ctx.moveTo(0, r * 0.9);
    ctx.lineTo(0, r * 0.6);
    ctx.stroke();

    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.9);
    ctx.lineTo(0, -r * 0.6);
    ctx.moveTo(0, r * 0.9);
    ctx.lineTo(0, r * 0.6);
    ctx.stroke();

    ctx.rotate(Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.9);
    ctx.lineTo(0, -r * 0.6);
    ctx.moveTo(0, r * 0.9);
    ctx.lineTo(0, r * 0.6);
    ctx.stroke();

    ctx.restore();
}