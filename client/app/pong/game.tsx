'use client';

import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'

function Box(props: ThreeElements['mesh']) {
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
      <boxGeometry args={[0.5, 1, 0.2]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function Ball(props: ThreeElements['mesh']) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
    useFrame(() => {
    console.log("Hey, I'm executing every frame!")
    })
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <circleGeometry args={[0.2, 32, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
    )
}

export function Threejs() {
    return (
      <>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box position={[-5, 0, 0]} />
            <Box position={[5, 0, 0]} />
            <Ball position={[0, 0, 0]} />
      </>
  )
}
