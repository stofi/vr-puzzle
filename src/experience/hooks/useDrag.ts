import * as THREE from 'three'
import { useEffect, useRef } from 'react'

import { useFrame, useThree } from '@react-three/fiber'

export default function useDrag(depth = 10) {
  const mouseDown = useRef(false)
  const mouseStart = useRef(new THREE.Vector2())
  const mouseEnd = useRef(new THREE.Vector2())
  const q = useRef(new THREE.Quaternion())
  const lastQ = useRef(new THREE.Quaternion())
  const downForce = useRef(new THREE.Vector3(0, -1, 0))

  const mouseStart3 = useRef(new THREE.Vector3())
  const mouseEnd3 = useRef(new THREE.Vector3())

  const { mouse, gl } = useThree()

  const handleMouseDown = () => {
    mouseDown.current = true
    mouseStart.current.copy(mouse)
    mouseStart3.current.set(mouse.x, -mouse.y, depth)
  }

  const handleMouseMove = () => {
    if (mouseDown.current) {
      mouseEnd.current.copy(mouse)
      mouseEnd3.current.set(mouse.x, -mouse.y, depth)

      q.current.setFromUnitVectors(
        mouseStart3.current.clone().normalize(),
        mouseEnd3.current.clone().normalize(),
      )
      downForce.current.applyQuaternion(q.current)
    }
  }

  const handleMouseUp = () => {
    mouseDown.current = false
  }

  useEffect(() => {
    gl.domElement.addEventListener('mousedown', handleMouseDown)
    gl.domElement.addEventListener('mouseup', handleMouseUp)
    gl.domElement.addEventListener('mousemove', handleMouseMove)
    gl.domElement.addEventListener('mouseleave', handleMouseUp)

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown)
      gl.domElement.removeEventListener('mouseup', handleMouseUp)
      gl.domElement.removeEventListener('mousemove', handleMouseMove)
      gl.domElement.removeEventListener('mouseleave', handleMouseUp)
    }
  })

  useFrame(() => {
    lastQ.current.copy(q.current)
    // q.current.set(0, 0, 0, 1)
  })

  return {
    mouseDown,
    q,
    downForce,
    lastQ,
  }
}
