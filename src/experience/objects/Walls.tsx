import * as THREE from 'three'
import { useEffect, useRef } from 'react'

import { useGLTF } from '@react-three/drei'
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

  const cube = useGLTF('/cube.glb')

  useEffect(() => {
    if (modelRef.current && cube.scene.children[0] instanceof THREE.Mesh) {
      modelRef.current.geometry = cube.scene.children[0].geometry
      modelRef.current.material = cube.scene.children[0].material
      modelRef.current.receiveShadow = true
    }
  }, [])

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

      <mesh
        ref={modelRef}
        position={props.position}
        scale={[props.size[0] / 10, props.size[1] / 10, props.size[2] / 10]}
      />
    </>
  )
}
