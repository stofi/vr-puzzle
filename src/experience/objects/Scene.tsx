import { Environment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

// import { useRapier } from '@react-three/rapier'
import { useControls } from 'leva'

import Level from '#/Level'
import Sphere from '#/Sphere'

export default function Scene() {
  const { sphereColor } = useControls({
    sphereColor: { value: 'red', label: 'Sphere Color' },
  })

  // const { world } = useRapier()

  useFrame(() => {
    // world.setGravity(smoothDownDirection.current.clone().multiplyScalar(10))
  })

  return (
    <>
      {/* <OrbitControls makeDefault /> */}

      {/* <directionalLight position={[3, 10, -5]} castShadow>
        <orthographicCamera
          near={0.1}
          far={20}
          left={-10}
          right={10}
          top={10}
          bottom={-10}
          attach='shadow-camera'
        />
      </directionalLight> */}
      <Environment files='https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr' />

      <Level>
        <Sphere color={sphereColor} />
      </Level>
    </>
  )
}
