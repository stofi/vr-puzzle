import { useRef } from 'react'

import { Box, Sphere } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber'
import { MeshCollider, RigidBody, useSphericalJoint } from '@react-three/rapier'

const HangingLight = (props: GroupProps) => {
  /**
   * Joints can be created between two RigidBodies
   */
  const anchor = useRef(null)
  const box = useRef(null)

  useSphericalJoint(anchor, box, [
    [0, 0, 0],
    [0, 1, 0],
  ])

  return (
    <group {...props}>
      <group position={[0, -0.1, 0]}>
        {/**
         * We can use an empty RigidBody is created to act
         * as a non-moving anchor
         */}
        <RigidBody ref={anchor} />
        <RigidBody canSleep={false} ref={box} mass={2}>
          <Box args={[0.1, 1.5, 0.1]}>
            <meshPhysicalMaterial />
          </Box>
          <MeshCollider type='ball'>
            <Sphere args={[0.25]} position={[0, -1, 0]}>
              <meshPhysicalMaterial
                emissive={'white'}
                emissiveIntensity={1.5}
              />
            </Sphere>
            <pointLight position={[0, -1, 0]} castShadow />
          </MeshCollider>
        </RigidBody>
      </group>
    </group>
  )
}

export default HangingLight
