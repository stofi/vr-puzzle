import * as THREE from 'three'
import { useEffect, useRef } from 'react'

import {
  PerspectiveCamera,
  // MeshTransmissionMaterial,
} from '@react-three/drei'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { RigidBody, useRapier } from '@react-three/rapier'

import Funnel from '#/Funnel'
import HangingLight from '#/HangingLight'
import Hoop from '#/Hoop'
import Mill from '#/Mill'
import MyBox from '#/MyBox'
import Walls from '#/Walls'
import useAccelerometer from '$/hooks/useAccelerometer'
import DragMaterial from '$/materials/DragMaterial'

interface LevelProps {
  children: React.ReactNode
}

const zAxis = new THREE.Vector3(1, 0, 0)

export default function Level({ children }: LevelProps) {
  const cameraGroup = useRef<THREE.Group | null>(null)

  const {
    update,
    requestPermission,
    isSupported,
    isDenied,
    isGranted,
    wasUpdated,
    // worldForceWithGravity,
    // deviceForceWithGravity,
    smoothDeviceForceWithGravity,
  } = useAccelerometer()
  const { world } = useRapier()

  const enableDrag = useRef(true)
  const dragging = useRef(false)
  const draggingRef = useRef<THREE.Group | null>(null)
  const dragPrevDirection = useRef(new THREE.Vector3(0, 0, 0))
  const dragDirection = useRef(new THREE.Vector3(0, 0, 0))
  const downDirection = useRef(new THREE.Vector3(0, -1, 0))
  const q = useRef(new THREE.Quaternion())
  const g = useRef(new THREE.Vector3(0, -1, 0))

  const forceTimeout = useRef<number>(0)

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

  useFrame((state, delta) => {
    update()

    q.current.setFromUnitVectors(
      dragPrevDirection.current,
      dragDirection.current,
    )
    dragPrevDirection.current.copy(dragDirection.current)

    downDirection.current.applyQuaternion(q.current)

    if (forceTimeout.current > 0) {
      forceTimeout.current -= delta
    }
    forceTimeout.current = Math.max(0, forceTimeout.current)

    if (enableDrag.current) {
      if (dragging.current) {
        if (draggingRef.current) {
          draggingRef.current.applyQuaternion(q.current)
          g.current.applyQuaternion(q.current)
          world.setGravity(g.current.clone().multiplyScalar(9.81))
          // alert(g.current)
        }
      }
    } else if (isSupported.current && isGranted.current) {
      // alert(worldForceWithGravity.current.x)
      // console.log(isDenied, isGranted, isSupported)
      world.setGravity(
        smoothDeviceForceWithGravity.current
          .clone()
          .normalize()
          .multiplyScalar(9.81)
          .applyAxisAngle(zAxis, Math.PI / 2),
      )
    }

    if (wasUpdated.current) {
      enableDrag.current = false
    }
  })

  useEffect(() => {
    requestPermission()
  }, [])

  const handleClick = async () => {
    await requestPermission()
  }

  useEffect(() => {
    if (isSupported.current && !isGranted.current && !isDenied.current) {
      document.addEventListener('click', handleClick)
    }

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <>
      {children}
      <Walls
        onClick={handleClick}
        position={[0, 0, 0]}
        thickness={0.1}
        size={[9, 16, 9]}
      />
      <Hoop position={[-1.5, 0, -2]} />
      <MyBox color='red' position={[-1.5, 0, -3.5]} />
      <MyBox color='blue' position={[-1.5, -2, -3.5]} />
      <MyBox color='green' position={[-3.5, 2, -3.5]} />
      <MyBox color='orange' position={[-3.5, 4, -3.5]} />
      <MyBox color='yellow' position={[-1.5, 4, -1.5]} />
      <MyBox color='purple' position={[-1.5, 2, 0.5]} />
      <Mill position={[0, -5, 0]} />

      <HangingLight position={[0, 8, 0]} />
      <group ref={draggingRef}>
        <mesh
          onPointerDown={handlePointerDown}
          onPointerUp={handleCancel}
          onPointerMove={handlePointerMove}
          onPointerCancel={handleCancel}
          onPointerLeave={handleCancel}
          visible={true}
        >
          <sphereGeometry args={[20, 12, 12]} />
          {/* <meshBasicMaterial wireframe /> */}
          <DragMaterial
            color={new THREE.Color('lightblue')}
            alpha={1}
            side={1}
          />
        </mesh>
      </group>
      <RigidBody type={'fixed'} colliders='trimesh' position={[3, -2, 0]}>
        <Funnel></Funnel>
      </RigidBody>
      <group ref={cameraGroup}>
        <PerspectiveCamera
          position={[0, 0, 30]}
          zoom={4}
          near={0.1}
          far={200}
          makeDefault
          fov={120}
        ></PerspectiveCamera>
      </group>
    </>
  )
}
