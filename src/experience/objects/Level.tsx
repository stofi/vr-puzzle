import * as THREE from 'three'
import { useEffect, useRef } from 'react'

import {
  PerspectiveCamera,
  // MeshTransmissionMaterial,
} from '@react-three/drei'
import { GroupProps, useFrame } from '@react-three/fiber'
import { useRapier } from '@react-three/rapier'

import type { DragRef } from '#/Drag'
import Drag from '#/Drag'
import Sphere from '#/Sphere'
import Walls from '#/Walls'
import useAccelerometer from '$/hooks/useAccelerometer'

const zAxis = new THREE.Vector3(1, 0, 0)

interface LevelProps extends GroupProps {
  size: [number, number, number]
}

export default function Level(props: LevelProps) {
  const cameraGroup = useRef<THREE.Group | null>(null)
  const dragRef = useRef<DragRef | null>(null)
  const lightRef = useRef<THREE.DirectionalLight | null>(null)

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

  const forceTimeout = useRef<number>(0)

  useFrame((state, delta) => {
    update()

    if (forceTimeout.current > 0) {
      forceTimeout.current -= delta
    }
    forceTimeout.current = Math.max(0, forceTimeout.current)

    if (dragRef.current && dragRef.current.dragEnabled()) {
      world.setGravity(
        dragRef.current.getDirection().clone().multiplyScalar(20),
      )

      if (lightRef.current) {
        lightRef.current.position.copy(
          dragRef.current.getDirection().clone().multiplyScalar(-10),
        )
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

      if (lightRef.current) {
        lightRef.current.position.copy(
          smoothDeviceForceWithGravity.current
            .clone()
            .normalize()
            .multiplyScalar(-10)
            .applyAxisAngle(zAxis, Math.PI / 2),
        )
      }
    }

    if (wasUpdated.current) {
      // enableDrag.current = false
      dragRef.current?.disableDrag()
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
      <group position={[3, 3, 3]}>
        <directionalLight ref={lightRef} castShadow>
          <orthographicCamera
            near={0.1}
            far={40}
            left={-10}
            right={10}
            top={10}
            bottom={-10}
            attach='shadow-camera'
          />
        </directionalLight>
      </group>

      <Walls position={[0, 0, 0]} thickness={0.1} size={props.size} />
      <hemisphereLight args={['#ffeedd', '#eeeeee', 0.5]} />

      <Sphere />
      <group
        position={[-props.size[0] / 2, -props.size[1] / 2, -props.size[2] / 2]}
      >
        {props.children}
      </group>
      <Drag ref={dragRef} />
      <group ref={cameraGroup}>
        <PerspectiveCamera
          position={[0, -1, 14]}
          rotation={[0, 0, 0]}
          // position={[-14.5, -1, 0]}
          // rotation={[0, -Math.PI / 2, 0]}

          // position={[0, -1, 14.5]}
          near={0.1}
          far={50}
          makeDefault
          fov={75}
        ></PerspectiveCamera>
      </group>
    </>
  )
}
