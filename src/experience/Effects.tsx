// @ts-nocheck
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing'

import { useControls } from 'leva'

export default function Effects() {
  const { enableBloom, enableDepthOfField, enableNoise, enableVignette } =
    useControls('Effects', {
      enableBloom: {
        value: false,
        label: 'Bloom',
      },
      enableDepthOfField: {
        value: false,
        label: 'Depth of Field',
      },
      enableNoise: {
        value: false,
        label: 'Noise',
      },
      enableVignette: {
        value: false,
        label: 'Vignette',
      },
    })

  return (
    <EffectComposer>
      {enableDepthOfField && (
        <DepthOfField
          worldFocusDistance={14}
          focalLength={0.04}
          bokehScale={2}
          height={480}
        />
      )}
      {enableBloom && (
        <Bloom luminanceThreshold={0.8} height={300} intensity={0.1} />
      )}
      {enableNoise && <Noise opacity={0.015} />}
      {enableVignette && <Vignette eskil={false} offset={0.1} darkness={0.8} />}
    </EffectComposer>
  )
}
