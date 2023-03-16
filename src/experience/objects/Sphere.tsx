import { RigidBody } from '@react-three/rapier'

export default function Sphere() {
  return (
    <RigidBody
      canSleep={false}
      colliders='ball'
      position-y={1}
      restitution={0.2}
      friction={1}
      scale={[0.25, 0.25, 0.25]}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 24, 16]} />
        {/* <CustomMaterial color={'silver'} /> */}
        <meshStandardMaterial color={'#B5A642'} metalness={1} roughness={0.5} />
      </mesh>
    </RigidBody>
  )
}
