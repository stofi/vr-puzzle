import { useGLTF } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber'

export default function Model(props: GroupProps) {
  const { nodes } = useGLTF('/funnel.glb') as any

  return (
    <group {...props} dispose={null} scale={2}>
      <mesh geometry={nodes.Cylinder.geometry}>
        <meshStandardMaterial color='yellow' side={2} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/funnel.glb')
