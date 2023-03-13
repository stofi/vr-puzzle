import * as THREE from 'three'

import { RoundedBox } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

export default function MyBox(props: {
  position: [number, number, number]
  color: THREE.Color | string
}) {
  return (
    <RigidBody position={props.position} type='fixed' colliders='cuboid'>
      <RoundedBox
        castShadow
        receiveShadow
        args={[2, 2, 2]} // Width, height, depth. Default is [1, 1, 1]
        radius={0.1} // Radius of the rounded corners. Default is 0.05
        smoothness={4} // The number of curve segments. Default is 4
      >
        <meshStandardMaterial color={props.color} roughness={0.8} />
      </RoundedBox>
    </RigidBody>
  )
}
