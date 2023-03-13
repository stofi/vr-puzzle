import * as THREE from 'three'
import { useEffect, useRef } from 'react'

interface AccelerometerOptions {
  lerp?: number
}

export default function useAccelerometer(options?: AccelerometerOptions) {
  const lerp = options?.lerp ?? 0.1
  const isSupported = useRef(false)
  const isDenied = useRef(false)
  const isGranted = useRef(false)
  const alpha = useRef(0)
  const beta = useRef(0)
  const gamma = useRef(0)
  const matrix = useRef(new THREE.Matrix4())
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const deviceDirection = useRef(new THREE.Vector3(0, 0, -1))
  const viewportDirection = useRef(new THREE.Vector3())
  const deviceForce = useRef(new THREE.Vector3())
  const worldForce = useRef(new THREE.Vector3())
  const deviceForceWithGravity = useRef(new THREE.Vector3())
  const worldForceWithGravity = useRef(new THREE.Vector3())
  const smoothDeviceForce = useRef(new THREE.Vector3())
  const smoothWorldForce = useRef(new THREE.Vector3())
  const smoothDeviceForceWithGravity = useRef(new THREE.Vector3())
  const smoothWorldForceWithGravity = useRef(new THREE.Vector3())
  const smoothDeviceDirection = useRef(new THREE.Vector3())
  const smoothViewportDirection = useRef(new THREE.Vector3())

  function handleOrientation(event: DeviceOrientationEvent) {
    if (event.alpha === null || event.beta === null || event.gamma === null)
      return
    alpha.current = (event.alpha * Math.PI) / 180
    beta.current = (event.beta * Math.PI) / 180
    gamma.current = (event.gamma * Math.PI) / 180
  }

  function updateOrientation() {
    // Set the rotation matrix
    euler.current.set(beta.current, alpha.current, -gamma.current)
    matrix.current.makeRotationFromEuler(euler.current)

    smoothDeviceDirection.current.lerp(deviceDirection.current, lerp)

    // Transform the device vector by the rotation matrix
    viewportDirection.current
      .copy(deviceDirection.current)
      .applyMatrix4(matrix.current)

    smoothViewportDirection.current.lerp(viewportDirection.current, lerp)

    // Normalize the resulting vector
    viewportDirection.current.normalize()
  }

  function update() {
    updateOrientation()
    updateAcceleration()
  }

  function handleAccelerometer(event: DeviceMotionEvent) {
    if (
      event.acceleration !== null &&
      event.acceleration.x !== null &&
      event.acceleration.y !== null &&
      event.acceleration.z !== null
    )
      deviceForce.current.set(
        event.acceleration.x,
        event.acceleration.z,
        -event.acceleration.y,
      )

    if (
      event.accelerationIncludingGravity !== null &&
      event.accelerationIncludingGravity.x !== null &&
      event.accelerationIncludingGravity.y !== null &&
      event.accelerationIncludingGravity.z !== null
    )
      deviceForceWithGravity.current.set(
        event.accelerationIncludingGravity.x,
        event.accelerationIncludingGravity.z,
        -event.accelerationIncludingGravity.y,
      )
  }

  function updateAcceleration() {
    // Transform the device vector by the rotation matrix
    worldForce.current.copy(deviceForce.current).applyMatrix4(matrix.current)

    smoothDeviceForce.current.lerp(deviceForce.current, lerp)
    smoothWorldForce.current.lerp(worldForce.current, lerp)

    worldForceWithGravity.current
      .copy(deviceForceWithGravity.current)
      .applyMatrix4(matrix.current)

    smoothDeviceForceWithGravity.current.lerp(
      deviceForceWithGravity.current,
      lerp,
    )

    smoothWorldForceWithGravity.current.lerp(
      worldForceWithGravity.current,
      lerp,
    )
  }

  const checkSupport = () => {
    if (window.DeviceMotionEvent) {
      isSupported.current = true
    } else {
      isSupported.current = false
    }
  }

  const requestPermission = async () => {
    if (
      window.DeviceMotionEvent &&
      typeof window.DeviceMotionEvent.requestPermission === 'function'
    ) {
      window.DeviceMotionEvent.requestPermission()
        .then((response) => {
          if (response === 'granted') {
            isDenied.current = false
            isGranted.current = true
          } else {
            isDenied.current = true
            isGranted.current = false
          }
        })
        .catch(() => {
          isDenied.current = true
          isGranted.current = false
        })
    }
  }

  useEffect(() => {
    isDenied.current = false
    isGranted.current = false
    isDenied.current = false
    window.addEventListener('devicemotion', handleAccelerometer)
    window.addEventListener('deviceorientation', handleOrientation)
    checkSupport()
    requestPermission()

    return () => {
      window.removeEventListener('devicemotion', handleAccelerometer)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  })

  return {
    isSupported,
    isDenied,
    isGranted,
    requestPermission,
    update,
    matrix,
    viewportDirection,
    deviceDirection,
    deviceForce,
    deviceForceWithGravity,
    worldForce,
    worldForceWithGravity,
    smoothDeviceForce,
    smoothWorldForce,
    smoothDeviceDirection,
    smoothViewportDirection,
    smoothDeviceForceWithGravity,
    smoothWorldForceWithGravity,
  }
}

interface CustomDeviceMotionEvent extends DeviceMotionEvent {
  requestPermission: () => Promise<string>
}

declare global {
  interface Window {
    DeviceMotionEvent: CustomDeviceMotionEvent
  }
}
