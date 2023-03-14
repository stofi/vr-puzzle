import * as THREE from 'three'

export const textureHandler = (texture: THREE.Texture | THREE.Texture[]) => {
  if (Array.isArray(texture)) {
    texture.forEach(textureHandler)

    return
  }
  // texture.encoding = THREE.sRGBEncoding
  texture.encoding = THREE.LinearEncoding
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter

  texture.repeat.set(0.3, 0.3)

  texture.needsUpdate = true
}
