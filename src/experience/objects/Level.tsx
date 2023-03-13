import * as THREE from 'three'
import { useEffect, useRef } from 'react'

import {
  Box,
  PerspectiveCamera,
  RoundedBox,
  Sphere,
  Torus,
  // MeshTransmissionMaterial,
} from '@react-three/drei'
import { GroupProps, ThreeEvent, useFrame } from '@react-three/fiber'
import {
  CylinderCollider,
  MeshCollider,
  RigidBody,
  useRapier,
  useSphericalJoint,
} from '@react-three/rapier'

import Walls from '#/Walls'
import useAccelerometer from '$/hooks/useAccelerometer'

interface LevelProps {
  children: React.ReactNode
}

const HangingThing = (props: GroupProps) => {
  /**
   * Joints can be created between two RigidBodies
   */
  const anchor = useRef(null)
  const box = useRef(null)

  useSphericalJoint(anchor, box, [
    [0, 0, 0],
    [0, 1, 0],
  ])

  return (
    <group {...props}>
      {/**
       * We can use an empty RigidBody is created to act
       * as a non-moving anchor
       */}
      <RigidBody ref={anchor} />
      <RigidBody ref={box} mass={2}>
        <Box args={[0.1, 1.5, 0.1]}>
          <meshPhysicalMaterial />
        </Box>
        <MeshCollider type='ball'>
          <Sphere args={[0.25]} position={[0, -1, 0]}>
            <meshPhysicalMaterial emissive={'white'} emissiveIntensity={1.5} />
          </Sphere>
          <pointLight position={[0, -1, 0]} castShadow />
        </MeshCollider>
      </RigidBody>
    </group>
  )
}
const dd = new THREE.Vector3(0, -1, 0)
const rr = new THREE.Vector3(1, 0, 0)

export default function Level({ children }: LevelProps) {
  const cameraGroup = useRef<THREE.Group | null>(null)

  const m = useRef<THREE.Matrix4>(new THREE.Matrix4())

  const {
    update,
    matrix,
    smoothViewportDirection,
    requestPermission,
    isSupported,
    isDenied,
    isGranted,
  } = useAccelerometer()
  const { world } = useRapier()

  const enableDrag = useRef(false)
  const dragging = useRef(false)
  const draggingRef = useRef<THREE.Mesh | null>(null)
  const dragPrevDirection = useRef(new THREE.Vector3(0, 0, 0))
  const dragDirection = useRef(new THREE.Vector3(0, 0, 0))
  const downDirection = useRef(new THREE.Vector3(0, -1, 0))
  const q = useRef(new THREE.Quaternion())
  const g = useRef(new THREE.Vector3(0, -1, 0))

  const forceTimeout = useRef<number>(0)

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    dragging.current = true
    dragPrevDirection.current.copy(e.point.normalize())
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

    if (isSupported.current && isGranted.current) {
      if (cameraGroup.current) {
        m.current = cameraGroup.current.matrix.clone().invert()

        cameraGroup.current.applyMatrix4(
          matrix.current.clone().multiply(m.current),
        )
      }

      world.setGravity(
        smoothViewportDirection.current.clone().multiplyScalar(-10),
      )
    } else if (enableDrag.current) {
      if (cameraGroup.current) {
        // cameraGroup.current.rotation.set(0, 0, 0)

        // set rotation to a quaternion based on the down direction
        cameraGroup.current.quaternion.setFromUnitVectors(
          dd,
          downDirection.current,
        )

        g.current.copy(downDirection.current).applyAxisAngle(rr, Math.PI / 2)
        g.current.x *= -1
        g.current.y *= -1

        // cameraGroup.current.quaternion.multiply(q.current)
        world.setGravity(g.current.clone().multiplyScalar(-20))
      }
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
        size={[9, 9, 9]}
      />
      <Hoop position={[0, 0, 2]} />
      <RigidBody position={[0, -2, -3.5]} type='fixed' colliders='cuboid'>
        <RoundedBox
          castShadow
          receiveShadow
          args={[2, 2, 2]} // Width, height, depth. Default is [1, 1, 1]
          radius={0.1} // Radius of the rounded corners. Default is 0.05
          smoothness={4} // The number of curve segments. Default is 4
        >
          <meshStandardMaterial color='silver' metalness={1} roughness={0.4} />
        </RoundedBox>
      </RigidBody>
      <RigidBody position={[-2, 0, -3.5]} type='fixed' colliders='cuboid'>
        <RoundedBox
          castShadow
          receiveShadow
          args={[2, 2, 2]} // Width, height, depth. Default is [1, 1, 1]
          radius={0.1} // Radius of the rounded corners. Default is 0.05
          smoothness={4} // The number of curve segments. Default is 4
        >
          <meshStandardMaterial color='silver' metalness={1} roughness={0.4} />
        </RoundedBox>
      </RigidBody>
      <RigidBody position={[-2, -2, -3.5]} type='fixed' colliders='cuboid'>
        <RoundedBox
          castShadow
          receiveShadow
          args={[2, 2, 2]} // Width, height, depth. Default is [1, 1, 1]
          radius={0.1} // Radius of the rounded corners. Default is 0.05
          smoothness={4} // The number of curve segments. Default is 4
        >
          <meshStandardMaterial color='silver' metalness={1} roughness={0.4} />
        </RoundedBox>
      </RigidBody>

      <HangingThing position={[0, 4, 0]} />
      <mesh
        ref={draggingRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handleCancel}
        onPointerMove={handlePointerMove}
        onPointerCancel={handleCancel}
        onPointerLeave={handleCancel}
        visible={false}
      >
        <sphereGeometry args={[10, 12, 12]} />
      </mesh>
      <group ref={cameraGroup}>
        <PerspectiveCamera
          position={[0, 30, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
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

function Hoop(props: { position: [number, number, number] }) {
  const { position } = props

  return (
    <RigidBody type='fixed' position={position} colliders={'trimesh'}>
      {/* <mesh>
        <torusGeometry args={[1, 0.1, 16, 32]} />
      </mesh> */}
      <Torus args={[1.4, 0.2, 16, 32]} castShadow receiveShadow>
        <meshStandardMaterial color='gold' metalness={1} roughness={0.4} />
      </Torus>
      <CylinderCollider
        rotation={[-Math.PI / 2, 0, 0]}
        args={[0.1, 1]}
        sensor
        onIntersectionEnter={() => console.log('Goal!')}
      />
    </RigidBody>
  )
}
