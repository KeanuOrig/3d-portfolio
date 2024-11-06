"use client";

import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei";
import dynamic from "next/dynamic"
import { useMemo } from "react";

const MainScene = dynamic(() => import("@/components/scenes/MainScene"), { ssr: false })

export default function Home() {

  enum Controls {
    forward = 'forward',
    back = 'back',
    left = 'left',
    right = 'right',
    jump = 'jump',
  }
    const map = useMemo<KeyboardControlsEntry<Controls>[]>(()=>[
      { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
      { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
      { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
      { name: Controls.jump, keys: ['Space'] },
    ], [])
    
  return (
    <KeyboardControls map={map}>
      
      <main className="h-screen bg-slate-600 overflow-hidden no-scrollbar">
          <MainScene />
      </main>
          
    </KeyboardControls>
  )
}
