/* eslint-disable @typescript-eslint/no-unused-vars */
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import { useRef } from 'react'

import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { useControls } from 'leva'

import { textureHandler } from '$/materials/textureHandler'

import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'

const textures = [
  './textures/plastic/albedo.png',
  './textures/plastic/roughness.png',
  './textures/plastic/normal.png',
]

export default function CustomMaterial(props: { color?: string }) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)

  const [albedo, roughness, normal] = useTexture(textures, textureHandler)

  const { t1 } = useControls({
    t1: {
      value: 0.0,
      min: 0,
      max: 1,
    },
  })

  const updateUniforms = () => {
    if (!materialRef.current) return

    // materialRef.current.uniforms['uT_1'].value = t1
  }

  useFrame(() => {
    updateUniforms()
  })

  return (
    <CustomShaderMaterial
      color={props.color}
      baseMaterial={THREE.MeshStandardMaterial}
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={{}}
      side={1}
      roughnessMap={roughness}
      normalMap={normal}
      // normalScale={new THREE.Vector2(-1, -1)}
      map={albedo}
    />
  )
}
