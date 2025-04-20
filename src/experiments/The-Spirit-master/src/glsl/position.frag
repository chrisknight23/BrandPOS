uniform vec2 resolution;
uniform sampler2D texturePosition;
uniform sampler2D textureDefaultPosition;
uniform float time;
uniform float speed;
uniform float dieSpeed;
uniform float radius;
uniform float curlSize;
uniform float attraction;
uniform float initAnimation;
uniform vec3 mouse3d;

#pragma glslify: curl = require(./helpers/curl4)

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 positionInfo = texture2D( texturePosition, uv );
    vec3 position = mix(vec3(0.0, -200.0, 0.0), positionInfo.xyz, smoothstep(0.0, 0.3, initAnimation));
    float life = positionInfo.a - dieSpeed;

    vec3 followPosition = mix(vec3(0.0, -(1.0 - initAnimation) * 200.0, 0.0), mouse3d, smoothstep(0.2, 0.7, initAnimation));

    if(life < 0.0) {
        position = mouse3d;
        float angle = fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453) * 6.2831853;
        float spread = 5.0 * fract(sin(dot(uv, vec2(93.9898,67.345))) * 15731.5453);
        position.x += cos(angle) * spread;
        position.z += sin(angle) * spread;
        life = 0.5 + fract(positionInfo.w * 21.4131 + time);
    } else {
        position.y += speed * 8.0;
        float driftAngle = fract(sin(dot(uv, vec2(33.9898,57.345))) * 12731.5453) * 6.2831853;
        float drift = 0.2 * fract(sin(dot(uv, vec2(53.9898,17.345))) * 9731.5453);
        position.x += cos(driftAngle) * drift;
        position.z += sin(driftAngle) * drift;
    }

    gl_FragColor = vec4(position, life);

}
