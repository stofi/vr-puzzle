#include "lib.glsl"
// varying vec2 vUv;
varying vec3 vColor;

varying vec3 vPosition;

void main() {
    // set csm variables
    // csm_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // csm_DiffuseColor = vec4(1.0, 0.0, 0.0, 1.0);
    // csm_Roughness = 0.5;
    // csm_Metalness = 0.5;
    // csm_AO = 0.5;

    // csm_FragColor = vec4(vPosition, 1.0);
    vec3 p = vPosition;
    p.z+=.5;
    p = mod(p,2.);
    float f1 =p.x>1.? 1.0:0.0;
    float f2 =p.y>1.? 1.0:0.0;
    float f3 =p.z>1.? 1.0:0.0;
    float f4= mod(f1 + f2 + f3, 2.);
    float f5 = f4* 0.1+.6;
    float f6 = 1.-f4;
    f6 = f6*.1+.6;
    // vec3 c= fract(vPosition ) ;
    vec3 c = csm_DiffuseColor.rgb * f5;
    csm_DiffuseColor = vec4(c, 1.0);
    // csm_Roughness = f6 * csm_Roughness;

}
