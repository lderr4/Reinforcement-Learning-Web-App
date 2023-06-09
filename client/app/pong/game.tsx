'use client';

import * as THREE from 'three'
import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, ThreeElements } from '@react-three/fiber'

import { useMemo } from 'react'
import { Object3D, Raycaster, Vector3 } from 'three'

import { useCPUStore, usePlayerStore, CPUPosType, PlayerPosType } from "./store";

const useForwardRaycast = (obj: {current: Object3D|null}, dir: THREE.Vector3) => {

  const raycaster = useMemo(() => new Raycaster(), [])
  const pos = useMemo(() => new Vector3(), [])
  const scene = useThree(state => state.scene)

  return () => {
    if (!obj.current)
      return []
    raycaster.set(
      obj.current.getWorldPosition(pos),
      dir)
    return raycaster.intersectObjects(scene.children)
  }
}

function CPU() {
    const mesh = useRef<THREE.Mesh>(null!)
    let tick = 0;
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
            position={[-5, 0, 0]}>
            <boxGeometry args={[0.2, 1, 0.2]} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
    )
}

function Player() {
    const store = usePlayerStore();
    const mesh = useRef<THREE.Mesh>(null!)
    const viewport = useThree((state) => state.viewport)
    useFrame(({ mouse }) => {
        mesh.current.position.y = (mouse.y * viewport.height) / 2;
        store.change(mesh.current.position);
    });
    return (
        <mesh
            ref={mesh}
            name='player'
            scale={1}
            position={[5, 0, 0]}>
            <boxGeometry args={[0.2, 1, 0.2]} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
    )
}

function Ball() {
    const ball = useRef<THREE.Mesh>(null!);
    const velocity = [0.002, 0];
    const cpuPosRef = useRef(useCPUStore.getState().paddlePos)
    const playerPosRef = useRef(usePlayerStore.getState().paddlePos)
    // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
    useEffect(() => useCPUStore.subscribe(state => (cpuPosRef.current = state.paddlePos)), [])
    useEffect(() => usePlayerStore.subscribe(state => (playerPosRef.current = state.paddlePos)), [])

    let tick = 0;
    useFrame(({ clock, viewport }) => {
        const a = Math.trunc(clock.getElapsedTime() * 1000);

        // player paddle
        if (ball.current.position.x >= playerPosRef.current.x - 0.15 && 
            ball.current.position.y < playerPosRef.current.y + 1 && 
            ball.current.position.y > playerPosRef.current.y - 1) {
            console.log("player paddle");
            velocity[0] = velocity[0] * -1.1;
            velocity[1] = velocity[1] + (ball.current.position.y - playerPosRef.current.y) * 0.004
        }
        // cpu paddle
        if (ball.current.position.x <= cpuPosRef.current.x + 0.15 && 
            ball.current.position.y < cpuPosRef.current.y + 1 && 
            ball.current.position.y > cpuPosRef.current.y - 1) {
            console.log("cpu paddle");
            console.log(ball.current.position);
            console.log(cpuPosRef.current.x);
            console.log(cpuPosRef.current.y);
            velocity[0] = velocity[0] * -1.1;
            velocity[1] = velocity[1] + (ball.current.position.y - cpuPosRef.current.y) * 0.004
        }
        // walls
        if (ball.current.position.y > viewport.top || ball.current.position.y > 0.15) {
            velocity[1] = velocity[1] * -1;
        } else if (ball.current.position.x > viewport.width) {
            console.log("cpu scores!");
        } else if (ball.current.position.x < 0.15) {
            console.log("player scores!");
        }
        
        ball.current.position.x += ((a - tick) * velocity[0]);
        ball.current.position.y += ((a - tick) * velocity[1]);
        //console.log(a - tick);
        tick = a;
    })
    return (
        <mesh
            ref={ball}
            scale={1}
            position={[0, 0, 0]}>
            <circleGeometry args={[0.15, 32, 1]} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
    )
}

export function Threejs() {
    return (
        <>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <CPU />
            <Player />
            <Ball />
        </>
    )
}

