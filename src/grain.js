import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { GRAIN } from './colors.js'

const GrainShader = {
  uniforms: {
    tDiffuse:  { value: null },
    time:      { value: 0 },
    intensity: { value: GRAIN.intensity },
    speed:     { value: GRAIN.speed },
  },

  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float intensity;
    uniform float speed;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float t = time * speed;
      vec2 seed = vec2(fract(t * 43.0), fract(t * 17.0));
      float noise = rand(vUv * 3000.0 + seed);
      // Input is already tonemapped sRGB from OutputPass → stay in [0,1]
      color.rgb += (noise - 0.5) * intensity;
      gl_FragColor = clamp(color, 0.0, 1.0);
    }
  `,
}

export function createGrainPass() {
  return new ShaderPass(GrainShader)
}
