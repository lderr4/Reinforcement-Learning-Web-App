import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree, ThreeElements } from '@react-three/fiber';

import { useCPUStore, usePlayerStore, sizes } from "./store";

export function Comp() {
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
    const ball = useRef<THREE.Mesh>(null!);
    const velocity = [0.002, 0];
    let tick = 0;
    const cpuPosRef = useRef(useCPUStore.getState().paddlePos);
    const playerPosRef = useRef(usePlayerStore.getState().paddlePos);
    // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
    useEffect(() => useCPUStore.subscribe(state => (cpuPosRef.current = state.paddlePos)), []);
    useEffect(() => usePlayerStore.subscribe(state => (playerPosRef.current = state.paddlePos)), []);

    //var vFOV = THREE.MathUtils.degToRad( 75 ); // convert vertical fov to radians
    //var height = 2 * Math.tan( vFOV / 2 ) * 5; // visible height
    //var width = height * (sizes.width / sizes.height); // visible width
    const vFOV = useMemo(() => THREE.MathUtils.degToRad( 75 ), [])
    const height = useMemo(() => 2 * Math.tan( vFOV / 2 ) * 5, [vFOV])
    const width = useMemo(() => height * (sizes.width / sizes.height), [height])
    
    useFrame(({ clock }) => {
        const a = Math.trunc(clock.getElapsedTime() * 1000);
        // player paddle
        if (ball.current.position.x >= playerPosRef.current.x - 0.15 &&
            ball.current.position.y < playerPosRef.current.y + 1 &&
            ball.current.position.y > playerPosRef.current.y - 1) {
            console.log("player paddle");
            velocity[0] = velocity[0] * -1.1;
            velocity[1] = velocity[1] + (ball.current.position.y - playerPosRef.current.y) * 0.004;
        }
        // cpu paddle
        if (ball.current.position.x <= cpuPosRef.current.x + 0.15 &&
            ball.current.position.y < cpuPosRef.current.y + 1 &&
            ball.current.position.y > cpuPosRef.current.y - 1) {
            console.log("cpu paddle");
            velocity[0] = velocity[0] * -1.1;
            velocity[1] = velocity[1] + (ball.current.position.y - cpuPosRef.current.y) * 0.004;
        }
        // walls
        if (ball.current.position.y > height / 2 || ball.current.position.y < (height / 2) * -1) {
            velocity[1] = velocity[1] * -1;
        } else if (ball.current.position.x > 5.15) {
            console.log("cpu scores!");
        } else if (ball.current.position.x < -5.15) {
            console.log("player scores!");
        }

        ball.current.position.x += ((a - tick) * velocity[0]);
        ball.current.position.y += ((a - tick) * velocity[1]);
        //console.log(a - tick);
        tick = a;
    });

    return (
        <mesh
            ref={ball}
            scale={1}
            position={[0, 0, 0]}>
            <circleGeometry args={[0.15, 32, 1]} />
            <meshStandardMaterial color={'#73BDA8'} />
        </mesh>
    )
}

