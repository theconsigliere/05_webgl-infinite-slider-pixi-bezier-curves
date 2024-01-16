uniform mat3 projectionMatrix;
uniform mat3 filterMatrix;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;
uniform float uPower;
uniform float uDirection;

uniform sampler2D uDisplacement;
uniform sampler2D uMap;

void main(void)	{
	vec2 uv = vFilterCoord;
	vec4 displacement = texture2D(uDisplacement, uv);
	vec4 color = texture2D(uMap, vec2(uv.x, uv.y + 0.4 * displacement.r * uDirection * uPower));
	gl_FragColor = vec4(uv,0.,1.);
	gl_FragColor = color;
}