'use client';

import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Comp, Player, Ball } from './game';
import { sizes } from './store';

export default function Pong() {
    return (
      <>
        <div className='w-[640px] h-[480px] outline outline-2 outline-r1-brown '>
          <Canvas>
            <PerspectiveCamera makeDefault fov={75} aspect={sizes.width / sizes.height} position={[0, 0, 5]} />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Comp />
            <Player />
            <Ball />
          </Canvas>
        </div>
      </>
  )
}

