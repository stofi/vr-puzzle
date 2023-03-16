import * as THREE from 'three'
import { useEffect, useRef } from 'react'

import {
  GizmoHelper,
  GizmoViewport,
  PerspectiveCamera,
  PivotControls,
  // MeshTransmissionMaterial,
} from '@react-three/drei'
import { GroupProps, useFrame } from '@react-three/fiber'
import { useRapier } from '@react-three/rapier'

import type {
  CustomControlsApi,
  CustomControlsOrientation,
} from '#/CustomControls'
import CustomControls from '#/CustomControls'
import Sphere from '#/Sphere'
import Walls from '#/Walls'
import useAccelerometer from '$/hooks/useAccelerometer'
import useDrag from '$/hooks/useDrag'
import CustomMaterial from '$/materials/CustomMaterial'

const zAxis = new THREE.Vector3(1, 0, 0)

const upD = new THREE.Vector3(0, 0, 1)
const downD = new THREE.Vector3(0, 0, -1)
const leftD = new THREE.Vector3(1, 0, 0)
const rightD = new THREE.Vector3(-1, 0, 0)
const frontD = new THREE.Vector3(0, 1, 0)
const backD = new THREE.Vector3(0, -1, 0)
const noneD = new THREE.Vector3(0, 0, 0)
new THREE.Vector3(0, 0, -1)
new THREE.Vector3(1, 0, 0)
new THREE.Vector3(-1, 0, 0)
new THREE.Vector3(0, 1, 0)
new THREE.Vector3(0, -1, 0)
new THREE.Vector3(0, 0, 0)

interface LevelProps extends GroupProps {
  size: [number, number, number]
}
const down = new THREE.Vector3(0, -1, 0)
const gravityFactor = 40

export default function Level(props: LevelProps) {
  const cameraGroup = useRef<THREE.Group | null>(null)
  const levelRef = useRef<THREE.Group | null>(null)
  const manualControl = useRef(true)
  const customControlsRef = useRef<CustomControlsApi | null>(null)

  const { downForce } = useDrag(10)

  const {
    update,
    requestPermission,
    isSupported,
    isDenied,
    isGranted,
    wasUpdated,
    smoothDeviceForceWithGravity,
  } = useAccelerometer()
  const { world } = useRapier()

  const forceTimeout = useRef<number>(0)
  const orientation = useRef<CustomControlsOrientation>('none')

  const handleOrientationChange = (nOrientation: CustomControlsOrientation) => {
    orientation.current = nOrientation
  }

  const lerpDown = () => {
    const f = 0.01

    switch (orientation.current) {
      case 'up':
        downForce.current.lerp(upD, f)
        break
      case 'down':
        downForce.current.lerp(downD, f)
        break
      case 'left':
        downForce.current.lerp(leftD, f)
        break
      case 'right':
        downForce.current.lerp(rightD, f)
        break
      case 'front':
        downForce.current.lerp(frontD, f)
        break
      case 'back':
        downForce.current.lerp(backD, f)
        break
      case 'none':
        downForce.current.lerp(noneD, f)
        break
    }
  }

  useFrame((state, delta) => {
    update()

    if (forceTimeout.current > 0) {
      forceTimeout.current -= delta
    }
    forceTimeout.current = Math.max(0, forceTimeout.current)

    if (manualControl.current && levelRef.current) {
      lerpDown()
      downForce.current.lerp
      world.setGravity(downForce.current.clone().multiplyScalar(gravityFactor))

      levelRef.current.quaternion
        .setFromUnitVectors(down, downForce.current.clone().normalize())
        .invert()
    } else if (isSupported.current && isGranted.current && levelRef.current) {
      // alert(worldForceWithGravity.current.x)
      // console.log(isDenied, isGranted, isSupported)
      world.setGravity(
        smoothDeviceForceWithGravity.current
          .clone()
          .normalize()
          .multiplyScalar(gravityFactor)
          .applyAxisAngle(zAxis, Math.PI / 2),
      )

      levelRef.current.quaternion
        .setFromUnitVectors(
          down,
          smoothDeviceForceWithGravity.current
            .clone()
            .normalize()
            .applyAxisAngle(zAxis, Math.PI / 2),
        )
        .invert()
    }

    if (wasUpdated.current) {
      manualControl.current = false
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
      <group ref={levelRef}>
        <Walls position={[0, 0, 0]} thickness={1} size={props.size} />
        {/* <hemisphereLight args={['#ffeedd', '#eeeeee', 0.5]} /> */}

        <Sphere />
        <group
          position={[
            -props.size[0] / 2,
            -props.size[1] / 2,
            -props.size[2] / 2,
          ]}
        >
          {props.children}
        </group>
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
          <CustomControls
            ref={customControlsRef}
            onOrientationChange={handleOrientationChange}
            position={[
              -props.size[0] / 2 - 2,
              -props.size[1] / 2 + 1,
              props.size[2] / 2,
            ]}
          />
        </group>
      </group>
    </>
  )
}
