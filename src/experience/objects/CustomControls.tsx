import * as THREE from 'three'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import { GroupProps } from '@react-three/fiber'

export type CustomControlsOrientation =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'front'
  | 'back'
  | 'none'

interface CustomControlsProps extends GroupProps {
  size?: [number, number, number]
  onOrientationChange?: (orientation: CustomControlsOrientation) => void
}

export interface CustomControlsApi {
  getOrientation(): CustomControlsOrientation
  setOrientation(orientation: CustomControlsOrientation): void
}

const box = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const CustomControls = forwardRef<CustomControlsApi, CustomControlsProps>(
  function CustomControls(props, ref) {
    const orientation = useRef<CustomControlsOrientation>('none')

    const setOrientation = (newOrientation: CustomControlsOrientation) => {
      orientation.current = newOrientation

      loopMeshes((mesh, mOrientation) => {
        const m = mesh.material as THREE.MeshBasicMaterial
        if (!m) return
        m.opacity = mOrientation === newOrientation ? 1 : 0.5
      })

      props.onOrientationChange?.(newOrientation)
    }

    const loopMeshes = (
      callback: (
        mesh: THREE.Mesh,
        orientation: CustomControlsOrientation,
      ) => void,
    ) => {
      Object.entries(meshes.current).forEach(([orientation, mesh]) => {
        if (mesh) {
          callback(mesh, orientation as CustomControlsOrientation)
        }
      })
    }

    const meshes = useRef<
      Partial<
        Omit<Record<CustomControlsOrientation, THREE.Mesh | null>, 'none'>
      >
    >({})

    useImperativeHandle(
      ref,
      () => ({
        getOrientation: () => orientation.current,
        setOrientation: (newOrientation: CustomControlsOrientation) => {
          setOrientation(newOrientation)
        },
      }),
      [],
    )

    const handleClick = (o: CustomControlsOrientation) => {
      setOrientation(o)
    }

    return (
      <>
        <group {...props}>
          <mesh
            ref={(mesh) => {
              meshes.current.up = mesh
            }}
            position={[0, 0, 0.5]}
            geometry={box}
            onClick={() => handleClick('up')}
          >
            <meshBasicMaterial transparent color='blue' />
          </mesh>
          <mesh
            ref={(mesh) => {
              meshes.current.down = mesh
            }}
            position={[0, 0, -0.5]}
            geometry={box}
            onClick={() => handleClick('down')}
          >
            <meshBasicMaterial transparent color='#000088' />
          </mesh>
          <mesh
            ref={(mesh) => {
              meshes.current.front = mesh
            }}
            position={[0, 0.5, 0]}
            geometry={box}
            onClick={() => handleClick('front')}
          >
            <meshBasicMaterial transparent color='green' />
          </mesh>
          <mesh
            ref={(mesh) => {
              meshes.current.back = mesh
            }}
            position={[0, -0.5, 0]}
            geometry={box}
            onClick={() => handleClick('back')}
          >
            <meshBasicMaterial transparent color='#008800' />
          </mesh>
          <mesh
            ref={(mesh) => {
              meshes.current.left = mesh
            }}
            position={[0.5, 0, 0]}
            geometry={box}
            onClick={() => handleClick('left')}
          >
            <meshBasicMaterial transparent color='red' />
          </mesh>
          <mesh
            ref={(mesh) => {
              meshes.current.right = mesh
            }}
            position={[-0.5, 0, 0]}
            geometry={box}
            onClick={() => handleClick('right')}
          >
            <meshBasicMaterial transparent color='#880000' />
          </mesh>
        </group>
      </>
    )
  },
)

export default CustomControls
