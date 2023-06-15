import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree, ThreeElements } from '@react-three/fiber';

import { useCPUStore, usePlayerStore, useScoreStore, ScoreType, sizes } from "./store";

export function Comp() {
    const store = useCPUStore();
    const mesh = useRef<THREE.Mesh>(null!);
    let tick = 0;

    // TODO: set framerate for capture
    useFrame(({ clock, gl }) => {
        // CAPTURE EACH FRAME
        const cav = gl.domElement;
        const base64 = cav.toDataURL("img/png");
        //console.log(base64);

        //const a = clock.getElapsedTime();
        //tick = a;
        store.change(mesh.current.position);
    });

    return (
        <mesh
            ref={mesh}
            name='cpu'
            scale={1}
            position={[-4.75, 0, 0]}>
            <boxGeometry args={[0.2, 1, 0]} />
            <meshStandardMaterial color={'#73BDA8'} />
        </mesh>
    )
}

export function Player() {
    const store = usePlayerStore();
    const mesh = useRef<THREE.Mesh>(null!);
    const viewport = useThree((state) => state.viewport);

    useFrame(({ mouse }) => {
        mesh.current.position.y = (mouse.y * viewport.height) / 2;
        //mesh.current.updateMatrixWorld();
        store.change(mesh.current.position);
    });

    return (
        <mesh
            ref={mesh}
            name='player'
            scale={1}
            position={[4.75, 0, 0]}>
            <boxGeometry args={[0.2, 1, 0]} />
            <meshStandardMaterial color={'#73BDA8'} />
        </mesh>
    )
}

export function Ball() {
    const cpuPoint = useScoreStore((state) => state.cpuPoint);
    const playerPoint = useScoreStore((state) => state.playerPoint);
    const ball = useRef<THREE.Mesh>(null!);
    const bRadius = 0.15;
    //let angle = Math.random() * Math.PI * 2;
    let velocity = [0, 0];
    let angle = Math.PI;
    let speed = 0.004;
    velocity[0] = Math.cos(angle) * speed;
    velocity[1] = Math.sin(angle) * speed;

    const cpuPosRef = useRef(useCPUStore.getState().paddlePos);
    const playerPosRef = useRef(usePlayerStore.getState().paddlePos);
    //const cpuScoreRef = useRef(useScoreStore.getState().cpuScore);
    //const playerScoreRef = useRef(useScoreStore.getState().playerScore);
    // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
    useEffect(() => useCPUStore.subscribe(state => (cpuPosRef.current = state.paddlePos)), []);
    useEffect(() => usePlayerStore.subscribe(state => (playerPosRef.current = state.paddlePos)), []);
    //useEffect(() => useScoreStore.subscribe(state => (cpuScoreRef.current = state.cpuScore)), []);
    //useEffect(() => useScoreStore.subscribe(state => (playerScoreRef.current = state.playerScore)), []);

    // reset when player scores
    //useEffect(() => {}. [points]);

    // cache fov info and bounce angle info
    const vFOV = useMemo(() => THREE.MathUtils.degToRad( 75 ), [])
    const height = useMemo(() => 2 * Math.tan( vFOV / 2 ) * 5, [vFOV])
    const width = useMemo(() => height * (sizes.width / sizes.height), [height])
    const pAngleRange = useMemo(() => (2 * Math.PI) / 3, []);
    const pAngleOffset = useMemo(() => (4 * Math.PI) / 3, []);
    const cAngleRange = useMemo(() => Math.PI / 3, []);
    const cAngleOffset = useMemo(() => Math.PI * 2, []);

    let tick = 0;
    useFrame(({ clock }) => {
        const a = Math.trunc(clock.getElapsedTime() * 1000);
        // player paddle
        if (ball.current.position.x + bRadius >= playerPosRef.current.x - 0.15 &&
            ball.current.position.y - bRadius / 2 < playerPosRef.current.y + 0.5 &&
            ball.current.position.y + bRadius / 2 > playerPosRef.current.y - 0.5 &&
            velocity[0] > 0) {

            console.log("player paddle");
            speed = speed * 1.01;
            angle = ((pAngleOffset - ((ball.current.position.y - playerPosRef.current.y + 0.5) * pAngleRange)));
            velocity[0] = Math.cos(angle) * speed;
            velocity[1] = Math.sin(angle) * speed;
        } else if (ball.current.position.x - bRadius <= cpuPosRef.current.x + 0.15 &&
            ball.current.position.y - bRadius < cpuPosRef.current.y + 0.5 &&
            ball.current.position.y + bRadius > cpuPosRef.current.y - 0.5 && 
            velocity[0] < 0) {

            console.log("cpu paddle");
            speed = speed * 1.01;
            //velocity[1] = velocity[1] + 1.05 *  (ball.current.position.y - cpuPosRef.current.y) * 0.004;
            angle = (cAngleOffset + (ball.current.position.y - cpuPosRef.current.y) * cAngleRange);
            velocity[0] = Math.cos(angle) * speed;
            velocity[1] = Math.sin(angle) * speed;
        } else if (ball.current.position.y + bRadius > height / 2 || ball.current.position.y - bRadius < (height / 2) * -1) {
            velocity[1] = velocity[1] * -1;
        } else if (ball.current.position.x > width/2 && velocity[0] > 0) {
            console.log("cpu scores!");
            cpuPoint();
            angle = Math.PI;
            speed = 0.004;
            //let angle = Math.random() * Math.PI * 2;
            velocity[0] = Math.cos(angle) * speed;
            velocity[1] = Math.sin(angle) * speed;
            ball.current.position.set(0,0,0)
            
        } else if (ball.current.position.x < 0-(width/2) && velocity[0] < 0) {
            console.log("player scores!");
            playerPoint();
            angle = Math.PI;
            speed = 0.004;
            //let angle = Math.random() * Math.PI * 2;
            velocity[0] = Math.cos(angle) * speed;
            velocity[1] = Math.sin(angle) * speed;
            ball.current.position.set(0,0,0)

        } 
        ball.current.position.x += velocity[0] * (a - tick);
        ball.current.position.y += velocity[1] * (a - tick);
        //ball.current.updateMatrixWorld();
        //console.log(a - tick);

        tick = a;
    });

    return (
        <mesh
            ref={ball}
            scale={1}
            position={[0, 0, 0]}>
            <circleGeometry args={[bRadius, 32, 1]} />
            <meshStandardMaterial color={'#73BDA8'} />
        </mesh>
    )
}

