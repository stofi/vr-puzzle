import * as THREE from 'three'
import { useMemo, useRef } from 'react'

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

const mat = new THREE.MeshStandardMaterial()

export default function PlasticMaterial(props: PlasticMaterialProps) {
  const [albedo, roughness, normal] = useTexture(textures, textureHandler)

  const ref = useRef(null)

  const material = useMemo(() => {
    const m = mat.clone()

    return m
  }, [])

  return (
    <primitive
      ref={ref}
      object={material}
      {...props}
      map={albedo}
      roughnessMap={roughness}
      normalMap={normal}
      color={props.color}
      attach='material'
    />
  )
}
