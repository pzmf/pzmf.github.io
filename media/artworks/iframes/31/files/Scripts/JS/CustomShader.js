     
var customShader =  {

	uniforms: THREE.UniformsUtils.merge( [
	
		THREE.UniformsLib[ "common" ],
		THREE.UniformsLib[ "bump" ],
		THREE.UniformsLib[ "normalmap" ],
		THREE.UniformsLib[ "fog" ],
		THREE.UniformsLib[ "lights" ],
		THREE.UniformsLib[ "shadowmap" ],
	
		{
			"ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
			"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
			"specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
			"shininess": { type: "f", value: 30 },
			"wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },
			"myTile"   : { type: "f", value: 1.0},
			"myOffset" : { type: "f", value: .3}
		}
	
	] ),
	
	vertexShader: [
	
		"#define PHONG",
	
		"varying vec3 vViewPosition;",
		"varying vec3 vNormal;",
		"uniform float myTile;",
		"uniform float myOffset;",
		"uniform sampler2D map;",
		"varying vec2 vUv;",
		
		//THREE.ShaderChunk[ "map_pars_vertex" ],
		THREE.ShaderChunk[ "lightmap_pars_vertex" ],
		THREE.ShaderChunk[ "envmap_pars_vertex" ],
		THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
		THREE.ShaderChunk[ "color_pars_vertex" ],
		THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
		THREE.ShaderChunk[ "skinning_pars_vertex" ],
		THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
	
		"void main() {",
		
			/*THREE.ShaderChunk[ "map_vertex" ],*/
			THREE.ShaderChunk[ "lightmap_vertex" ],
			THREE.ShaderChunk[ "color_vertex" ],
	
			THREE.ShaderChunk[ "morphnormal_vertex" ],
			THREE.ShaderChunk[ "skinbase_vertex" ],
			THREE.ShaderChunk[ "skinnormal_vertex" ],
			THREE.ShaderChunk[ "defaultnormal_vertex" ],
	
			"vNormal = normalize( transformedNormal );",
	
			THREE.ShaderChunk[ "morphtarget_vertex" ],
			THREE.ShaderChunk[ "skinning_vertex" ],
			THREE.ShaderChunk[ "default_vertex" ],
	
			"vViewPosition = -mvPosition.xyz;",
	
			THREE.ShaderChunk[ "worldpos_vertex" ],
			THREE.ShaderChunk[ "envmap_vertex" ],
			THREE.ShaderChunk[ "lights_phong_vertex" ],
			THREE.ShaderChunk[ "shadowmap_vertex" ],
			
			"vUv = ( uv * myTile ) + vec2( 1, 1);",
			"vUv.x = mod( vUv.x, 1.0 );",
			"vUv.y = mod( vUv.y, 1.0 );",
		
			"vec4 color = texture2D( map, vUv );",
			"float dist = ( color.r + color.g + color.b ) * myOffset;",
	
			"vec4 pos = vec4( position + position * dist, 1.0 );",
	
			"gl_Position = projectionMatrix * modelViewMatrix * pos;",
	
		"}"
	
	].join("\n"),
	
	fragmentShader: [
	
		"uniform vec3 diffuse;",
		"uniform float opacity;",
	
		"uniform vec3 ambient;",
		"uniform vec3 emissive;",
		"uniform vec3 specular;",
		"uniform float shininess;",
	
		THREE.ShaderChunk[ "color_pars_fragment" ],
		THREE.ShaderChunk[ "map_pars_fragment" ],
		THREE.ShaderChunk[ "lightmap_pars_fragment" ],
		THREE.ShaderChunk[ "envmap_pars_fragment" ],
		THREE.ShaderChunk[ "fog_pars_fragment" ],
		THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
		THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
		THREE.ShaderChunk[ "bumpmap_pars_fragment" ],
		THREE.ShaderChunk[ "normalmap_pars_fragment" ],
		THREE.ShaderChunk[ "specularmap_pars_fragment" ],
	
		"void main() {",
	
			"gl_FragColor = vec4( vec3 ( 1.0 ), opacity );",
	
			THREE.ShaderChunk[ "map_fragment" ],
			THREE.ShaderChunk[ "alphatest_fragment" ],
			THREE.ShaderChunk[ "specularmap_fragment" ],
	
			THREE.ShaderChunk[ "lights_phong_fragment" ],
	
			THREE.ShaderChunk[ "lightmap_fragment" ],
			THREE.ShaderChunk[ "color_fragment" ],
			THREE.ShaderChunk[ "envmap_fragment" ],
			THREE.ShaderChunk[ "shadowmap_fragment" ],
	
			THREE.ShaderChunk[ "linear_to_gamma_fragment" ],
	
			THREE.ShaderChunk[ "fog_fragment" ],
	
		"}"
	
	].join("\n")
	
}


var customShaderBG = {

	uniforms: THREE.UniformsUtils.merge( [
	
		THREE.UniformsLib[ "common" ],
		THREE.UniformsLib[ "fog" ],
		THREE.UniformsLib[ "shadowmap" ],
		{
			"myTile"   : { type: "f", value: 2.3},
			"myOffset" : { type: "f", value: 0}	
		}
	
	] ),
	
	vertexShader: [
		"uniform float myTile;",
		"uniform float myOffset;",
		"uniform sampler2D map;",
		"varying vec2 vUv;",
		//THREE.ShaderChunk[ "map_pars_vertex" ],
		THREE.ShaderChunk[ "lightmap_pars_vertex" ],
		THREE.ShaderChunk[ "envmap_pars_vertex" ],
		THREE.ShaderChunk[ "color_pars_vertex" ],
		THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
		THREE.ShaderChunk[ "skinning_pars_vertex" ],
		THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
	
		"void main() {",
	
			//THREE.ShaderChunk[ "map_vertex" ],
			THREE.ShaderChunk[ "lightmap_vertex" ],
			THREE.ShaderChunk[ "color_vertex" ],
			THREE.ShaderChunk[ "skinbase_vertex" ],
	
			"#ifdef USE_ENVMAP",
	
			THREE.ShaderChunk[ "morphnormal_vertex" ],
			THREE.ShaderChunk[ "skinnormal_vertex" ],
			THREE.ShaderChunk[ "defaultnormal_vertex" ],
	
			"#endif",
	
			THREE.ShaderChunk[ "morphtarget_vertex" ],
			THREE.ShaderChunk[ "skinning_vertex" ],
			THREE.ShaderChunk[ "default_vertex" ],
	
			THREE.ShaderChunk[ "worldpos_vertex" ],
			THREE.ShaderChunk[ "envmap_vertex" ],
			THREE.ShaderChunk[ "shadowmap_vertex" ],
			"vUv = ( uv * myTile ) + vec2( 1, 1);",
			"vUv.x = mod( vUv.x, 1.0 );",
			"vUv.y = mod( vUv.y, 1.0 );",
		
			"vec4 color = texture2D( map, vUv );",
			"float dist = ( color.r + color.g + color.b ) * myOffset;",
	
			"vec4 pos = vec4( position + position * dist, 1.0 );",
	
			"gl_Position = projectionMatrix * modelViewMatrix * pos;",
	
		"}"
	
	].join("\n"),
	
	fragmentShader: [
	
		"uniform vec3 diffuse;",
		"uniform float opacity;",
	
		THREE.ShaderChunk[ "color_pars_fragment" ],
		THREE.ShaderChunk[ "map_pars_fragment" ],
		THREE.ShaderChunk[ "lightmap_pars_fragment" ],
		THREE.ShaderChunk[ "envmap_pars_fragment" ],
		THREE.ShaderChunk[ "fog_pars_fragment" ],
		THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
		THREE.ShaderChunk[ "specularmap_pars_fragment" ],
	
		"void main() {",
	
			"gl_FragColor = vec4( diffuse, opacity );",
	
			THREE.ShaderChunk[ "map_fragment" ],
			THREE.ShaderChunk[ "alphatest_fragment" ],
			THREE.ShaderChunk[ "specularmap_fragment" ],
			THREE.ShaderChunk[ "lightmap_fragment" ],
			THREE.ShaderChunk[ "color_fragment" ],
			THREE.ShaderChunk[ "envmap_fragment" ],
			THREE.ShaderChunk[ "shadowmap_fragment" ],
	
			THREE.ShaderChunk[ "linear_to_gamma_fragment" ],
	
			THREE.ShaderChunk[ "fog_fragment" ],
	
		"}"
	
	].join("\n")
	
}
