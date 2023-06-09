import { Environment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

// import { useRapier } from '@react-three/rapier'
import { useControls } from 'leva'

import HangingLight from '#/HangingLight'
import Hoop from '#/Hoop'
import Level from '#/Level'
import Mill from '#/Mill'
import MyBox from '#/MyBox'
import Sphere from '#/Sphere'
import Walls from '#/Walls'

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

      {/* <Environment files='https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr' /> */}
      <Environment preset='sunset' />
      <group position={[5, 10, -7]}>
        <directionalLight castShadow>
          <orthographicCamera
            near={0.1}
            far={40}
            left={-10}
            right={10}
            top={10}
            bottom={-10}
            attach='shadow-camera'
          />
        </directionalLight>
      </group>
      <Level size={[10, 18, 2]}>
        <MyBox
          size={[4, 0.25, 2]}
          glass
          color='skyblue'
          position={[6, 15, 0]}
        />
        <MyBox size={[6, 0.25, 1]} color='lightgreen' position={[0, 5, 1]} />
        <MyBox size={[10, 0.25, 1]} color='#9083ef' position={[0, 11, 1]} />
        <MyBox size={[6, 0.25, 1]} color='pink' position={[4, 2, 0]} />
        <MyBox color='cyan' position={[9, 17, 0]} size={[1, 1, 1]} />

        <MyBox size={[0.25, 3, 2]} color='orange' position={[3, 15, 0]} />
        <MyBox size={[2, 2, 2]} color='yellow' position={[7, 4, 0]} />
        <group position={[0, 4, 0]}>
          <Mill position={[4, 3, 0.5]} />
          <MyBox size={[4, 2, 1]} color='pink' position={[5, 4, 0]} />
          <Mill position={[6, 5, 1.5]} />
          <MyBox size={[2, 4, 1]} color='pink' glass position={[3, 2, 1]} />
          <Mill position={[4, 7, 0.5]} />
          <Hoop position={[5, 9, 1]} />
        </group>
      </Level>
    </>
  )
}
