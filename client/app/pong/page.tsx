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

function CapturePixels() {
    useFrame(({ gl, scene, camera }) => {
        gl.render(scene, camera)
        const target = gl.getRenderTarget();
        if (target != null) {
            const pixels = new Uint8Array(
                target.width * target.height
            );
            gl.readRenderTargetPixels(
                  target,
                  0,
                  0,
                  target.width,
                  target.height,
                  pixels
            );
            console.log(pixels);
        }
    }, 1)
}
