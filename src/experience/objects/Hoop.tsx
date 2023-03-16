import { Torus } from '@react-three/drei'
import { CylinderCollider, RigidBody } from '@react-three/rapier'

export default function Hoop(props: { position: [number, number, number] }) {
  const { position } = props

  return (
    <RigidBody
      rotation={[-Math.PI / 2, 0, 0]}
      type='fixed'
      position={position}
      colliders={'trimesh'}
    >
      {/* <mesh>
        <torusGeometry args={[1, 0.1, 16, 32]} />
      </mesh> */}
      <Torus args={[0.9, 0.1, 8, 16]} castShadow receiveShadow>
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
