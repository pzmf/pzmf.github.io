var cameraInc = 0.0;

function ChangeVertexColors(OBJ, SAT, BRT){
	var color, f, p, n, vertexIndex;
	var vNames = [ 'a', 'b', 'c', 'd' ];
							
	for ( var i = 0; i < OBJ.geometry.faces.length; i ++ ) {

		f  = OBJ.geometry.faces[ i ];
		
		var n = ( f instanceof THREE.Face3 ) ? 3 : 4;

		for( var j = 0; j < n; j++ ) {
			
			vertexIndex = f[ vNames[ j ] ];
			p = OBJ.geometry.vertices[ vertexIndex ];

			color = new THREE.Color( 0xffffff );
			
			color.setHSL( Math.random(), SAT, BRT );

			f.vertexColors[ j ] = color;

		}

	}
	
	OBJ.geometry.colorsNeedUpdate = true;
}

function ShiftVertexColors(OBJ, SAT, BRT, MOD){
	var color, f, p, n, vertexIndex;
	var vNames = [ 'a', 'b', 'c', 'd' ];
							
	for ( var i = 0; i < OBJ.geometry.faces.length; i ++ ) {

		f  = OBJ.geometry.faces[ i ];
		
		var n = ( f instanceof THREE.Face3 ) ? 3 : 4;

		for( var j = 0; j < n; j++ ) {
			
			vertexIndex = f[ vNames[ j ] ];
			p = OBJ.geometry.vertices[ vertexIndex ];

			color = new THREE.Color( 0xffffff );
			
			color.setHSL( i*MOD, SAT, BRT );

			f.vertexColors[ j ] = color;

		}

	}
	
	OBJ.geometry.colorsNeedUpdate = true;
}

function OrbitCamera(rad, maxY, spd){
	
	if(mouseCont)
		cameraInc+= (mouseX) * spd;
	else
		cameraInc += 100.0*spd;
		
	var xPos = Math.sin(cameraInc)*rad;
	var zPos = Math.cos(cameraInc)*rad;
	
	camera.position.x = xPos;
	camera.position.z = zPos;
	
	if(mouseCont)
		camera.position.y += ( -mouseY - camera.position.y ) * (spd*100);
	
	if(camera.position.y >maxY) camera.position.y = maxY;
	if(camera.position.y <-maxY) camera.position.y = -maxY;
	
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	if(cameraCopy && dynObj.currentBGMesh == "plane"){
		cameraCopy.position.copy(camera.position);
		cameraCopy.rotation.copy(camera.rotation);
	}
	
}

function setCanvasSize(img){
	var sze = 0.0;
	
	if(img.width > img.height)
		sze = img.height;	
	else
		sze = img.width;
	
	if(sze<=2){
		sze = 2;	
	}else if(sze>=4 && sze<8){
		sze = 4;
	}else if(sze>=8 && sze<16){
		sze = 8;
	}else if(sze>=16 && sze<32){
		sze = 16;
	}else if(sze>=32 && sze<64){
		sze = 32;	
	}else if(sze>=64 && sze<128){
		sze = 64;	
	}else if(sze>=128 && sze<256){
		sze = 128;	
	}else if(sze>=256 && sze<512){
		sze = 256;	
	}else if(sze>=512 && sze<1024){
		sze = 512;	
	}else if(sze>=1024 && sze<2048){
		sze = 1024;	
	}else if(sze>=2048){
		sze = 2048;	
	}
	
	return sze;
}

function initBG(){
	
	bgMat = addCustomBGMaterial();
	bgGeo = addBGMesh();
	bgMesh = new THREE.Mesh(bgGeo, bgMat);
	
	if(dynObj.currentBGMesh =="plane"){
		bgMesh.position.z = bgZpos;
		bgMesh.rotation.x = Math.PI;
		bgMesh.rotation.z = Math.PI;
		
	}
	
	cameraCopy.add(bgMesh);

}

function addBGMesh(){
	switch(dynObj.currentBGMesh){
		case "plane" : return new THREE.PlaneGeometry(bgSize, bgSize, 30, 30);
		break;
		case "cube" : return new THREE.CubeGeometry(bgSize*.5, bgSize*.5, bgSize*.5, 10, 10, 10);
		break;
		case "sphere" : return new THREE.SphereGeometry(bgSize*.5, 20, 20);
		break;
	}
		
}

function initDistortion(){
	distortionHolder = new THREE.Object3D();
	scene.add(distortionHolder);
	
	//if(currentDistortionGeo == "plane" || currentDistortionGeo == "sphere" || currentDistortionGeo == "cube"){
	var loader = new THREE.JSONLoader();
	loader.load( geoPath+""+dynObj.currentDistortionGeo+".js",function(geometry){
		
		distortionMat = addBaseMaterial();
		distortionMat.needsUpdate = true;
		
		distortionMesh = new THREE.Mesh(geometry, distortionMat);
		distortionHolder.add(distortionMesh);
		distortionHolder.rotation.x = dynObj.distortionRotX;
		distortionHolder.rotation.y = dynObj.distortionRotY;
		distortionHolder.rotation.z = dynObj.distortionRotZ;
		
		distortionObject= new DistortionObject(distortionMesh, dynObj.distortionDoNormals, dynObj.distortionAxis , dynObj.distortionHeight, dynObj.distortionWidth, dynObj.distortionSpeed, dynObj.distortionRandomMult, null);
		distortionObject.init();
	
	});
		
	//}else{
			

				
}

function addBaseMesh(){
	switch(dynObj.currentDistortionGeo){
		case "plane": return new THREE.PlaneGeometry(distortionScl, distortionScl, 200, 200);
		break;
		case "sphere": return new THREE.SphereGeometry(distortionScl, 200, 200);
		break;
		case "cube": return new THREE.CubeGeometry(distortionScl,distortionScl,distortionScl, 100,100,100);
		break;
	}
}


function addBaseMaterial(){	
	
	var shader = customShader;
	var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
		
	var material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
		lights:true,
		fog: true,
		wireframe: false
	});
	
	material.side = THREE.DoubleSide;
	material.shading = addShading();
		
	material.uniforms.shininess.value = dynObj.distortionShininess;
	
	var specCol = new THREE.Color(0xffffff);
	specCol.setHex(dynObj.distortionSpecColor);
	material.uniforms.specular.value = specCol;
	
	var col = new THREE.Color(0xffffff);
	col.setHex(dynObj.distortionColor);
	material.uniforms.diffuse.value = col;
	
	material.envMap = true;
	material.uniforms.envMap.value = reflections[dynObj.currentReflection];
	material.uniforms.reflectivity.value = dynObj.distortionReflectivity;
	material.uniforms.combine.value = dynObj.distortionReflectionOperation;
	
	if(distortionTexture){
		material.map = true;
		material.uniforms.map.value = distortionTexture;
		material.uniforms.myTile.value = dynObj.distortionTile;
		material.uniforms.myOffset.value = dynObj.distortionDistortionAmount;
		
	}
	
	material.needsUpdate = true;
	return material;
}


function addCustomBGMaterial(){	
	
	var shader = customShaderBG;
	var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
		
	var material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
		fog: true,
		wireframe: false
	});
	
	material.side = THREE.DoubleSide;
	var col = new THREE.Color(0xffffff);
	col.setHex(dynObj.bgColor);
	material.uniforms.diffuse.value = col;
	material.transparent = true;
	material.uniforms.opacity.value = dynObj.bgOpacity;

	if(bgTexture){
		material.map = true;
		material.uniforms.map.value = bgTexture;
		material.uniforms.myTile.value = dynObj.bgTile;
		material.uniforms.myOffset.value = 0.0;
	}
	
	material.needsUpdate = true;
	return material;
}

function setBaseReflection(val){
	// THREE.MultiplyOperation , THREE.MixOperation, THREE.AddOperation
	switch(val){
		case "multiply": distortionReflectionOperation = 0;
		break;
		case "mix": distortionReflectionOperation = 1;
		break;
		case "add": distortionReflectionOperation = 2;
	}	
}

function addShading(){
	// THREE.MultiplyOperation , THREE.MixOperation, THREE.AddOperation
	switch(dynObj.distortionShading){
		case "flat": return THREE.FlatShading;
		break;
		case "smooth": return THREE.SmoothShading;
		break;
		case "none": return THREE.NoShading;
	}	
}

function doLink(url){
	window.open(""+url, "_self");	
}



function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

function setDefault(v, st){
	var t;
	if(v){
		t = v;
	}else{
		switch(st){
			case "bool":t = false;	
			break;
			case "float":t = 0.0;
			break;
			case "string":t = "";
			break;
			
		}
	}
	
	return t;
}

function initWebCam(ob){
	
	window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
	if(!video){
		video = document.createElement( 'video' );
		video.width = 640;
		video.height = 480;
	
	
		navigator.getUserMedia( { video: true }, function ( stream ) {
	
			if ( navigator.mozGetUserMedia !== undefined ) {
	
				video.src = stream;
	
			} else {
	
				video.src = window.URL.createObjectURL( stream );
	
			}
	
			video.play();
			
			if(!videoTex){
				videoTex = new THREE.Texture( video );
				videoTex.minFilter = THREE.LinearFilter;
				videoTex.magFilter = THREE.LinearFilter;
				videoTex.format = THREE.RGBFormat;
				videoTex.generateMipmaps = false;
				videoTex.needsUpdate = true;
			}
			
			switch(ob){
				case "both":setVideoTextures();	
				break;
				case "distortion":setMainVideoTexture();
				break;
				case "bg":setBgVideoTexture();
				break;
			}
	
	
		}, function ( error ) {
			if(isRemix){
				alert("this sculpture requires a webcam, try building from scratch or remixing another sculpture");	
			}
			if(isBuild){
				if(!gifOverlayOT){
					killOb(loadingText);
					showOb(center);
				}else{
					alert("you need a webcam for this feature");
				}
			}else{
				alert("this sculpture requires a webcam, try viewing another sculpture.");
				window.open("http://builder.clubrothko.com/", "_self");	
			}
			
	
		} );	
	}else{
		video.play();
		switch(ob){
			case "both":setVideoTextures();	
			break;
			case "distortion":setMainVideoTexture();
			break;
			case "bg":setBgVideoTexture();
			break;
		}	
	}
}

function killWebCam(ob){
	if(!dynObj.isVideo && !dynObj.bgIsVideo){
		video.pause();
		video.src=null;
		video.mozSrcObject=null;
	}
	
	switch(ob){
		case "distortion":
			if(dynObj.urlString!=""){
				setMainTexture(dynObj.urlString);	
			}else{
				distortionTex = null;
			}
		break;
		case "bg":
			if(dynObj.bgUrlString!=""){
				setBGTexture(dynObj.urlString);
			}else{
				bgTex = null;
			}
		break;
	}
}

function killOb(o){
	o.style.opacity = 0;
	o.style.pointerEvents = 'none';
	//o.style.display = "none";
}

function killObDisp(o){
	o.style.display = "none";
}


function showOb(o){
	//o.style.display = "block";
	o.style.opacity = 1;
	o.style.pointerEvents = 'auto';
}

function showObDisp(o){
	o.style.display = "block";
}




/*

var doRandomBGColors = setDefault(dynObj.bgRandomColors, "bool");

var col = new THREE.Color(Math.random()*0xffffff);
if(doRandomBGColors){
	bgMat.uniforms.diffuse.value = col;
}

*/


