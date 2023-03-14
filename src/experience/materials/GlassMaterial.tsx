import * as THREE from 'three'

import { MeshTransmissionMaterial, useTexture } from '@react-three/drei'

import { textureHandler } from '$/materials/textureHandler'

interface GlassMaterialProps {
  roughness?: number
  thickness?: number
  color?: THREE.Color | string
}

const textures = [
  './textures/plastic/roughness.png',
  './textures/plastic/normal.png',
]

export default function GlassMaterial(props: GlassMaterialProps) {
  const [roughness, normal] = useTexture(textures, textureHandler)

  return (
    <MeshTransmissionMaterial
      thickness={props.thickness ?? 0.1}
      samples={1}
      resolution={1024}
      roughness={props.roughness ?? 0.92}
      anisotropy={0.1}
      distortion={0.2}
      ior={1.5}
      distortionScale={1}
      temporalDistortion={0}
      attenuationColor={props.color ?? 'white'}
      color={props.color ?? 'white'}
      // backside={true}
      roughnessMap={roughness}
      normalMap={normal}
      // normalMapType={THREE.ObjectSpaceNormalMap}
    />
  )
}
