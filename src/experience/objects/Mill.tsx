// import * as THREE from 'three'
import { useRef } from 'react'

import { RoundedBox } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber'
import { RigidBody, useRevoluteJoint } from '@react-three/rapier'

const Mill = (props: GroupProps) => {
  /**
   * Joints can be created between two RigidBodies
   */
  const anchor = useRef(null)
  const box = useRef(null)

  useRevoluteJoint(anchor, box, [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 1],
  ])

  return (
    <group {...props}>
      {/**
       * We can use an empty RigidBody is created to act
       * as a non-moving anchor
       */}
      <RigidBody ref={anchor} />
      <RigidBody canSleep={false} ref={box}>
        <RoundedBox castShadow receiveShadow radius={0.1} args={[4, 0.2, 3]}>
          <meshPhysicalMaterial color='SaddleBrown' roughness={0.8} />
        </RoundedBox>
        <RoundedBox
          castShadow
          receiveShadow
          radius={0.1}
          args={[4, 0.2, 3]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <meshPhysicalMaterial color='SaddleBrown' roughness={0.8} />
        </RoundedBox>
      </RigidBody>
    </group>
  )
}

export default Mill
