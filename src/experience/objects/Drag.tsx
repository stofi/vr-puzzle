import * as THREE from 'three'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import { ThreeEvent, useFrame } from '@react-three/fiber'

import DragMaterial from '$/materials/DragMaterial'

const color = new THREE.Color('lightblue')

interface DragProps {
  enabled?: boolean
}

export interface DragRef {
  enableDrag: () => void
  disableDrag: () => void
  dragEnabled: () => boolean
  getDirection: () => THREE.Vector3
}

const Drag = forwardRef<DragRef, DragProps>(function Drag(props, ref) {
  const enableDrag = useRef(true)
  const dragging = useRef(false)
  const draggingRef = useRef<THREE.Group | null>(null)
  const dragPrevDirection = useRef(new THREE.Vector3(0, 0, 0))
  const dragDirection = useRef(new THREE.Vector3(0, 0, 0))
  const downDirection = useRef(new THREE.Vector3(0, -1, 0))
  const q = useRef(new THREE.Quaternion())
  const g = useRef(new THREE.Vector3(0, -1, 0))

  useImperativeHandle(ref, () => ({
    enableDrag: () => {
      enableDrag.current = true
    },
    disableDrag: () => {
      enableDrag.current = false
    },
    getDirection: () => {
      return g.current
    },
    dragEnabled: () => {
      return enableDrag.current
    },
  }))

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    dragging.current = true
    dragPrevDirection.current.copy(e.point.normalize())
    dragDirection.current.copy(e.point.normalize())

    q.current.setFromUnitVectors(
      downDirection.current,
      dragPrevDirection.current,
    )
  }

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (dragging.current) {
      dragDirection.current.copy(e.point.normalize())
    }
  }

  const handleCancel = () => {
    dragging.current = false
  }

  useFrame(() => {
    q.current.setFromUnitVectors(
      dragPrevDirection.current,
      dragDirection.current,
    )
    dragPrevDirection.current.copy(dragDirection.current)

    downDirection.current.applyQuaternion(q.current)

    if (enableDrag.current) {
      if (dragging.current) {
        if (draggingRef.current) {
          draggingRef.current.applyQuaternion(q.current)
          g.current.applyQuaternion(q.current)
          // world.setGravity(g.current.clone().multiplyScalar(9.81))
          // alert(g.current)
        }
      }
    }
  })

  return (
    <group ref={draggingRef}>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerUp={handleCancel}
        onPointerMove={handlePointerMove}
        onPointerCancel={handleCancel}
        onPointerLeave={handleCancel}
        visible={true}
      >
        <sphereGeometry args={[40, 12, 12]} />
        <DragMaterial color={color} alpha={0.1} side={1} />
      </mesh>
    </group>
  )
})

export default Drag
