import * as THREE from 'three'
import { useRef } from 'react'

import { RoundedBox } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

interface WallProps {
  position: [number, number, number]
  size: [number, number, number]
  thickness: number
  onClick?: () => void
}
const glassPaneGeometry = new THREE.BoxGeometry(1, 1, 1)

export default function Walls(props: WallProps) {
  const handleClick = () => {
    props.onClick?.()
  }

  const modelRef = useRef<THREE.Mesh | null>(null)

  return (
    <>
      <RigidBody
        type='fixed'
        position={props.position}
        friction={0.5}
        restitution={0.5}
        includeInvisible
      >
        <group onPointerDown={handleClick}>
          <mesh
            geometry={glassPaneGeometry}
            visible={false}
            position={[0, 0, props.size[2] / 2 + props.thickness / 2]}
            scale={[props.size[0], props.size[1], props.thickness]}
          ></mesh>

          <mesh
            geometry={glassPaneGeometry}
            visible={false}
            position={[0, 0, -props.size[2] / 2]}
            scale={[props.size[0], props.size[1], props.thickness]}
          ></mesh>
          <mesh
            geometry={glassPaneGeometry}
            visible={false}
            position={[-props.size[0] / 2, 0, 0]}
            scale={[props.thickness, props.size[1], props.size[2]]}
          ></mesh>
          <mesh
            geometry={glassPaneGeometry}
            visible={false}
            position={[props.size[0] / 2, 0, 0]}
            scale={[props.thickness, props.size[1], props.size[2]]}
          ></mesh>
          <mesh
            geometry={glassPaneGeometry}
            visible={false}
            position={[0, props.size[1] / 2, 0]}
            scale={[props.size[0], props.thickness, props.size[2]]}
          ></mesh>
          <mesh
            geometry={glassPaneGeometry}
            visible={false}
            position={[0, -props.size[1] / 2, 0]}
            scale={[props.size[0], props.thickness, props.size[2]]}
          ></mesh>
        </group>
      </RigidBody>

      <RoundedBox
        ref={modelRef}
        position={props.position}
        args={[props.size[0], props.size[1], props.size[2]]}
        radius={0.5}
        receiveShadow
        smoothness={4}
      >
        <meshStandardMaterial
          color='silver'
          roughness={0.4}
          side={1}
        ></meshStandardMaterial>
      </RoundedBox>
    </>
  )
}
