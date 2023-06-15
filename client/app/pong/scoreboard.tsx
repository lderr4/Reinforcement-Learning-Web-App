import React, { useEffect, useRef } from 'react';
import { useScoreStore } from './store';

export default function ScoreBoard() {
    const scoreStore = useScoreStore();
    const cpuScore = useScoreStore((state) => state.cpuScore);
    const playerScore = useScoreStore((state) => state.playerScore);
    return (
        <>
            <div className='text-center mb-2'>
                <p>Score</p>
                <span>{`${scoreStore.cpuScore}  |  ${scoreStore.playerScore}`}</span>
            </div>
        </>
    )
}
