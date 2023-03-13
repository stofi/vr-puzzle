/* eslint-disable @typescript-eslint/no-unused-vars */
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import { useRef } from 'react'

import { useFrame } from '@react-three/fiber'

import { useControls } from 'leva'

import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'

const textures = [
  './textures/snow/albedo.jpg',
  './textures/snow/roughness.jpg',
  './textures/snow/normal.jpg',
]

const textureHandler = (texture: THREE.Texture | THREE.Texture[]) => {
  if (Array.isArray(texture)) {
    texture.forEach(textureHandler)

    return
  }
  texture.encoding = THREE.sRGBEncoding
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.minFilter = THREE.LinearFilter

  texture.needsUpdate = true
}

export default function DragMaterial(props: DragMaterialProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)

  // const [albedo, roughness, normal] = useTexture(textures, textureHandler)

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
    <>
      <CustomShaderMaterial
        color={props.color}
        baseMaterial={THREE.MeshBasicMaterial}
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uAlpha: { value: props.alpha },
          uTint: {
            value: props.color,
          },
        }}
        side={props.side}
        transparent
      />
    </>
  )
}

interface DragMaterialProps {
  color: THREE.Color
  alpha: number
  side: THREE.Side
}
