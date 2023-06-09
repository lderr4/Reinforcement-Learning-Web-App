import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import * as THREE from 'three'

export interface CPUPosType {
  cpuPos: THREE.Vector3;
  change: (by: THREE.Vector3) => void
}
export interface PosType {
  paddlePos: THREE.Vector3
  change: (by: THREE.Vector3) => void
}

interface Score {
  cpu: number
  player: number
  cpuPoint: () => void
  playerPoint: () => void
}

export const useCPUStore = create<PosType>()((set) => ({
  paddlePos: new THREE.Vector3(-5, 0, 0),
  change: (by) => set((state) => ({ paddlePos:  by})),
}))

export const usePlayerStore = create<PosType>()((set) => ({
  paddlePos: new THREE.Vector3(5, 0, 0),
  change: (by) => set((state) => ({ paddlePos:  by})),
}))

//const useScoreStore = create<Score>()((set) => ({
//  cpu: 0,
//  player: 0,
//  cpuPoint: () => set((state) => ({ cpu: state.cpu + 1, player: state.player })),
//  playerPoint: () => set((state) => ({ cpu: state.cpu, player: state.player + 1 })),
//}))
