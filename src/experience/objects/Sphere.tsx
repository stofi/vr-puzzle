import { RigidBody } from '@react-three/rapier'

import CustomMaterial from '$/materials/CustomMaterial'

export default function Sphere(props: { color?: string }) {
  return (
    <RigidBody
      canSleep={false}
      colliders='ball'
      position-y={1}
      restitution={1}
      friction={0}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.8, 24, 16]} />
        <CustomMaterial color={props.color} />
      </mesh>
    </RigidBody>
  )
}
