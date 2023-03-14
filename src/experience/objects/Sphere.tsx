import { RigidBody } from '@react-three/rapier'

import CustomMaterial from '$/materials/CustomMaterial'

export default function Sphere() {
  return (
    <RigidBody
      canSleep={false}
      colliders='ball'
      position-y={1}
      restitution={0.5}
      friction={1}
      scale={[0.25, 0.25, 0.25]}
      mass={4}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <CustomMaterial color={'limegreen'} />
      </mesh>
    </RigidBody>
  )
}
