import * as THREE from 'three'

import { RoundedBox } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

import GlassMaterial from '$/materials/GlassMaterial'
import PlasticMaterial from '$/materials/PlasticMaterial'

export default function MyBox(
  props: {
    position?: [number, number, number]
    size: [number, number, number]
    color?: THREE.Color | string
    glass?: boolean
  } = {
    position: [0, 0, 0],
    size: [1, 1, 1],
    color: 'white',
  },
) {
  return (
    <RigidBody position={props.position} type='fixed' colliders='cuboid'>
      <RoundedBox
        castShadow
        receiveShadow
        position={[props.size[0] / 2, props.size[1] / 2, props.size[2] / 2]}
        args={props.size ?? [1, 1, 1]} // Width, height, depth. Default is [1, 1, 1]
        radius={0.08} // Radius of the rounded corners. Default is 0.05
        smoothness={2} // The number of curve segments. Default is 4
      >
        {props.glass ? (
          <GlassMaterial
            color={props.color}
            roughness={0.4}
            thickness={props.size[2] / 2}
          />
        ) : (
          <PlasticMaterial color={props.color} />
        )}
      </RoundedBox>
    </RigidBody>
  )
}
