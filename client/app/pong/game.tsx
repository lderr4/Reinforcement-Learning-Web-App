'use client';

import * as THREE from 'three'
import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, ThreeElements } from '@react-three/fiber'

function CPU(props: ThreeElements['mesh']) {
    const mesh = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[0.2, 1, 0.2]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

function Player(props: ThreeElements['mesh']) {
    const mesh = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)


    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[0.2, 1, 0.2]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

function Ball(props: ThreeElements['mesh']) {
    const mesh = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <circleGeometry args={[0.15, 32, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

export function Threejs() {
    const [velocity, setVelocity] = useState([0.01, 0]);
    const [ballPos, setBall] = useState(new THREE.Vector3(0, 0, 0));
    const [cpuPos, setCpu] = useState(new THREE.Vector3(-5, 0, 0));
    const [playerPos, setPlayer] = useState(new THREE.Vector3(5, 0, 0));
    const viewport = useThree((state) => state.viewport)
    let tick = 0;
    const gls = useThree((state) => state.gl);
    const gl = gls.domElement.getContext("webgl2");
    const pixels = new Uint8Array(
        gl.drawingBufferWidth * gl.drawingBufferHeight * 4
    );

    useFrame(({ clock, mouse }) => {
        const a = clock.getElapsedTime();

        // check collision
        // player paddle
        if (ballPos.x >= playerPos.x && (ballPos.y < playerPos.y + 1 && ballPos.y > playerPos.y - 1)) {
            velocity[0] = velocity[0] * -1;
            velocity[1] = velocity[1] + (ballPos.y - playerPos.y) * 0.006
        }
        // cpu paddle
        if (cpuPos.x >= ballPos.x && (ballPos.y < cpuPos.y + 1 && ballPos.y > cpuPos.y - 1)) {
            velocity[0] = velocity[0] * -1;
            velocity[1] = velocity[1] + (ballPos.y - cpuPos.y) * 0.006
        }
        // walls
        if (cpuPos.x) {
        }

        // movement
        //console.log(`x velocity: 2  t1: ${tick}  t2: ${a}   movement: ${(Math.trunc(tick * 1000) / 1000 - Math.trunc(a * 1000) / 1000) * 2}`);
        //console.log(ballPos[0] - ((Math.trunc(tick * 1000) / 1000 - Math.trunc(a * 1000) / 1000) * velocity[0]));
        setBall(
            new THREE.Vector3(
                ballPos.x - ((Math.trunc(tick * 1000) / 1000 - Math.trunc(a * 1000) / 1000) * velocity[0]),
                ballPos.y - ((Math.trunc(tick * 1000) / 1000 - Math.trunc(a * 1000) / 1000) * velocity[1]),
                0
            )
        );
        setPlayer(
            new THREE.Vector3(
                playerPos.x,
                (mouse.y * viewport.height) / 2,
                playerPos.z
            )
        );

        // caputure pixel data 
        // every 10th of a second(can change later)
        if (tick !== Math.floor(a * 10 % 10)) {
            tick = Math.floor(a * 10 % 10);
            gl.readPixels(
                0,
                0,
                gl.drawingBufferWidth,
                gl.drawingBufferHeight,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                pixels
            );
            console.log(pixels); // Uint8Array
            //console.log(a);
        }
        // console.log(gl);
        // console.log([gl.drawingBufferWidth, gl.drawingBufferHeight]);

        // console.log(a);
        tick = a;
    });
    return (
        <>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <CPU position={cpuPos} />
            <Player position={playerPos} />
            <Ball position={ballPos} />
        </>
    )
}
