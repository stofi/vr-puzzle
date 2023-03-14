#include "lib.glsl"
varying vec2 vUv;
varying vec3 vPosition;
uniform float uAlpha;
uniform vec3 uTint;

vec4 c0 = vec4(0.564, 0.670, 0.407, 1.000);
vec4 c1 = vec4(0.771, 0.947, 0.965, 1.000);
vec4 c2 = vec4(0.036, 0.481, 0.670, 1.000);
void main() {
    // set csm variables
    // csm_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // csm_DiffuseColor = vec4(1.0, 0.0, 0.0, 1.0);
    // csm_Roughness = 0.5;
    // csm_Metalness = 0.5;
    // csm_AO = 0.5;
    vec3 p = vPosition;
    p=normalize(p);
    float f = p.y;
    f  = (f+1.0)/2.0;
    float f2 = smoothstep(.65, .95, f);
    f = smoothstep(.2, .5, f);
    f = pow(f, 0.9);
    vec3 color = vec3(0.);
    vec3 ct = mix(c2.rgb, c1.rgb, f2);
    color = mix(c0.rgb, ct, f);
    csm_FragColor = vec4(color, uAlpha);

}
