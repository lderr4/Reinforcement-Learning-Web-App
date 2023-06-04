'use client';

import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'

import { Threejs } from './game';

export default function Pong() {
    return (
      <>
        <div className='w-[640px] h-[480px] '>
          <Canvas>
            <Threejs/>
          </Canvas>
        </div>
      </>
  )
}
