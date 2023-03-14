// import * as THREE from 'three'
import { useRef } from 'react'

import { RoundedBox } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber'
import { RigidBody, useRevoluteJoint } from '@react-three/rapier'

import PlasticMaterial from '$/materials/PlasticMaterial'

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
        <RoundedBox
          castShadow
          receiveShadow
          radius={0.05}
          args={[1.9, 0.2, 0.8]}
        >
          <PlasticMaterial color='SaddleBrown' roughness={0.8} />
        </RoundedBox>
        <RoundedBox
          castShadow
          receiveShadow
          radius={0.05}
          args={[1.9, 0.2, 0.8]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <PlasticMaterial color='SaddleBrown' roughness={0.8} />
        </RoundedBox>
      </RigidBody>
    </group>
  )
}

export default Mill
