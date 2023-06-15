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

export interface ScoreType {
  cpuScore: number
  playerScore: number
  cpuPoint: () => void
  playerPoint: () => void
}

export const useCPUStore = create<PosType>()((set) => ({
  paddlePos: new THREE.Vector3(-4.75, 0, 0),
  change: (by) => set((state) => ({ paddlePos:  by})),
}))

export const usePlayerStore = create<PosType>()((set) => ({
  paddlePos: new THREE.Vector3(4.75, 0, 0),
  change: (by) => set((state) => ({ paddlePos:  by})),
}))

export const useScoreStore = create<ScoreType>()((set) => ({
  cpuScore: 0,
  playerScore: 0,
  cpuPoint: () => set((state) => ( { cpuScore: state.cpuScore + 1 })),
  playerPoint: () => set((state) => ( { playerScore: state.playerScore + 1 })),
}))

export const sizes = {
    width: 640,
    height: 480,
}

//const useScoreStore = create<Score>()((set) => ({
//  cpu: 0,
//  player: 0,
//  cpuPoint: () => set((state) => ({ cpu: state.cpu + 1, player: state.player })),
//  playerPoint: () => set((state) => ({ cpu: state.cpu, player: state.player + 1 })),
//}))
