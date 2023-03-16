#include "lib.glsl"
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    // set csm variables
    // csm_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // csm_DiffuseColor = vec4(1.0, 0.0, 0.0, 1.0);
    // csm_Roughness = 0.5;
    // csm_Metalness = 0.5;
    // csm_AO = 0.5;
    csm_DiffuseColor = vec4(vPosition, 1.0);
}
