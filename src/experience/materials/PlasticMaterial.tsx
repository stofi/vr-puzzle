import * as THREE from 'three'

import { useTexture } from '@react-three/drei'

import { textureHandler } from '$/materials/textureHandler'

interface PlasticMaterialProps {
  roughness?: number
  thickness?: number
  color?: THREE.Color | string
}

const textures = [
  './textures/plastic/albedo.png',
  './textures/plastic/roughness.png',
  './textures/plastic/normal.png',
]

export default function PlasticMaterial(props: PlasticMaterialProps) {
  const [albedo, roughness, normal] = useTexture(textures, textureHandler)

  return (
    <meshStandardMaterial
      map={albedo}
      roughnessMap={roughness}
      normalMap={normal}
      normalScale={new THREE.Vector2(-1, -1)}
      color={props.color}
    />
  )
}
