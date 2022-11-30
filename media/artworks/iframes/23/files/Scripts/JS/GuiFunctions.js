var bgBool;
var mainBool;

function setFogColor(color){	
	dynObj.fogCol = color;
	scene.fog.color.setHex(color);
}

function setFogAmount(amount){	
	dynObj.fogIntensity = amount;
	scene.fog.density = amount;
}

function setAmbientLightColor(color){
	dynObj.ambientLightCol = color;	
	ambientLight.color.setHex(color);
}

function setBackgroundColor(color){	
	dynObj.bgColor = color;
	if(bgMesh && bgMat){
		var col = new THREE.Color(0xffffff);
		col.setHex(color);
		bgMat.uniforms.diffuse.value = col;
		bgMat.needsUpdate = true;
	
	}
}

function setBackgroundTile(amount){
	dynObj.bgTile = amount;
	if(bgMesh && bgMat){
		bgMat.uniforms.myTile.value = amount;
	}
}

function setTextures(url){
	setMainTexture(url);
	setBGTexture(url);	
}


function setVideoTextures(){
	setMainVideoTexture();
	setBgVideoTexture();
}


function setMainVideoTexture(){
	dynObj.isVideo = true;
	//distortionTexture = videoTex;
	if(distortionObject){
		distortionObject = null;
	}	
	
	if(distortionHolder){
		scene.__removeObject(distortionHolder);	
	}

	initDistortion();
		
}

function setBgVideoTexture(){
	dynObj.bgIsVideo = true;
	//bgTexture = videoTex; 
	if(cameraCopy){
		scene.__removeObject(cameraCopy);
	}
	
	cameraCopy = new THREE.Object3D();
	scene.add(cameraCopy);
	
	initBG();
}


function setMainTexture(url){
	
	urlImg = new Image();
	urlImg.crossOrigin = "anonymous";
	
	var ext = url.substring(url.length-3, url.length);
	var mime = "";
	
	if(ext=="gif"){
		mime = "image/gif";
	}else if (ext=="jpg"||ext=="peg"){
		mime = "image/jpeg";
	}else if (ext=="png"){
		mime = "image/png";
	}
	
	urlImg.src = url; //phpPath+'proxy.php?url='+url+"&mimeType="+mime;
	
	//urlImg.src = proxify(decodeURIComponent(url));
				
	urlImg.onload=function(){
		dynObj.urlString = url;
		dynObj.isVideo = false;
		if(mainBool)
			mainBool.show();
		if(ext=="gif"){
			isGif = true;
			initObjectGif();	
		}else{
			isGif = false;
			killOverlay();
			initObjectStill();	
		}
	
	}
	
	urlImg.onerror=function(){
		if(resetOverlay){
			if(loadingText && center){
				killOb(loadingText);
				showOb(center);
			}
		}
	}
}


function setBGTexture(url){
	
	bgUrlImg = new Image();
	bgUrlImg.crossOrigin = "anonymous";
	
	var ext = url.substring(url.length-3, url.length);
	var mime = "";
	
	if(ext=="gif"){
		mime = "image/gif";
	}else if (ext=="jpg"||ext=="peg"){
		mime = "image/jpeg";
	}else if (ext=="png"){
		mime = "image/png";
	}
	
	bgUrlImg.src = url; //phpPath+'proxy.php?url='+url+"&mimeType="+mime;
	
	//bgUrlImg.src = proxify(decodeURIComponent(url));
				
	bgUrlImg.onload=function(){
		dynObj.bgUrlString = url;
		dynObj.bgIsVideo = false;
		
		if(bgBool)
			bgBool.show();
		
		if(ext=="gif"){
			bgIsGif = true;
			initBGGif();	
		}else{
			bgIsGif = false;
			initBGStill();
		}
	}
}

function initObjectGif(){
	if(document.getElementById('gifImg')){
		gifHolder.innerHTML ="";
	}
 	
	gifHolder.innerHTML =" <img style='display:none;' id='gifImg' rel:animated_src='"+urlImg.src+"' rel:auto_play='1' width='" + urlImg.width + "' height='" + urlImg.height + "' />";
	
	gifObject = new SuperGif({ gif: document.getElementById('gifImg') } );
	gifObject.load();
	
	/*
	if(cameraCopy){
		scene.__removeObject(cameraCopy);
	}
	
	cameraCopy = new THREE.Object3D();
	scene.add(cameraCopy);
	
	initBG();
	*/
		
	if(distortionObject){
		distortionObject = null;
	}	
	
	if(distortionHolder){
		scene.__removeObject(distortionHolder);	
	}

	initDistortion();

}


function initBGGif(){
	if(document.getElementById('bgGifImg')){
		bgGifHolder.innerHTML ="";
	}
 	
	bgGifHolder.innerHTML =" <img style='display:none;' id='bgGifImg' rel:animated_src='"+bgUrlImg.src+"' rel:auto_play='1' width='" + bgUrlImg.width + "' height='" + bgUrlImg.height + "' />";
	
	bgGifObject= new SuperGif({ gif: document.getElementById('bgGifImg') } );
	bgGifObject.load();
	
	if(cameraCopy){
		scene.__removeObject(cameraCopy);
	}
	
	cameraCopy = new THREE.Object3D();
	scene.add(cameraCopy);
	
	initBG();

}



function initObjectStill(){
		
	if(distortionObject){
		distortionObject = null;
	}	
	
	if(distortionHolder){
		scene.__removeObject(distortionHolder);	
	}
	
	distortionCanvas.width = urlImg.width;
	distortionCanvas.height = urlImg.height;

	distortionCTX.drawImage(urlImg, 0, 0, urlImg.width, urlImg.height);
	
	distortionTexture = new THREE.Texture(distortionCanvas); 
	distortionTexture.needsUpdate = true;
	
	initDistortion();	
}


function initBGStill(){
		
		
	if(cameraCopy){
		scene.__removeObject(cameraCopy);
	}
	
	cameraCopy = new THREE.Object3D();
	scene.add(cameraCopy);
	
	bgCanvas.width = bgUrlImg.width;
	bgCanvas.height = bgUrlImg.height;

	bgCTX.drawImage(bgUrlImg, 0, 0, bgUrlImg.width, bgUrlImg.height);
	
	bgTexture = new THREE.Texture(bgCanvas); 
	bgTexture.needsUpdate = true;
	
	initBG();
}


function setBackgroundOpacity(opacity){	
	dynObj.bgOpacity = opacity;
	if(bgMesh && bgMat){
		bgMat.uniforms.opacity.value = opacity;
		bgMat.needsUpdate = true;
	}
}

function setBackgroundMesh(val){
	
	
	if(cameraCopy){
		scene.__removeObject(cameraCopy);
	}
	
	cameraCopy = new THREE.Object3D();
	scene.add(cameraCopy);
	
	dynObj.currentBGMesh = val;
	
	initBG();
	
}

function setLightAmount(amount, show){
	if(!show){
		
		lightsHolder = new THREE.Object3D();
		scene.add(lightsHolder);
	
		for(var i = 0; i < amount; i++){
			var plight = new THREE.PointLight(dynObj.lightCol, 0);
			lightsHolder.add(plight);
			allLights.push(plight);
			if(i<=dynObj.lightAmt){
				
				var col = new THREE.Color(0xffffff);
				switch(i){
					case 0:col.setHex(dynObj.lightCol0);
					break;
					case 1:col.setHex(dynObj.lightCol1);
					break;
					case 2:col.setHex(dynObj.lightCol2);
					break;
					case 3:col.setHex(dynObj.lightCol3);
					break;
					case 4:col.setHex(dynObj.lightCol4);
					break;	
				}
				
				allLights[i].color=col;
				allLights[i].intensity= dynObj.lightInt;
				
				var s = 360/dynObj.lightAmt;
				var angle = (i*s)*(Math.PI/180);
				
				var xPos = (Math.cos(angle) * 1200);
				var zPos = (Math.sin(angle) * 1200); 
				
				allLights[i].position.y = -200+Math.random()*400;
				allLights[i].position.x = xPos;
				allLights[i].position.z = zPos;
				
			}
		}	
		
	}else{
		dynObj.lightAmt = amount;
		for(var i = 0; i < allLights.length; i++){
			if(	i<= amount){
				
				allLights[i].intensity = dynObj.lightInt;
				
				var col = new THREE.Color(0xffffff);
				
				switch(i){
					case 0:col.setHex(dynObj.lightCol0);
					break;
					case 1:col.setHex(dynObj.lightCol1);
					break;
					case 2:col.setHex(dynObj.lightCol2);
					break;
					case 3:col.setHex(dynObj.lightCol3);
					break;
					case 4:col.setHex(dynObj.lightCol4);
					break;	
				}
				
				allLights[i].color=col;
				
				var s = 360/amount;
				var angle = (i*s)*(Math.PI/180);
				
				var xPos = (Math.cos(angle) * 1200);
				var zPos = (Math.sin(angle) * 1200); 
				
				allLights[i].position.y = -200+Math.random()*400;
				allLights[i].position.x = xPos;
				allLights[i].position.z = zPos;
				
			}else{
				allLights[i].intensity = 0.0;
				allLights[i].position = new THREE.Vector3(0,0,0);
			}
			
		}
	
	}
}


function setLightColor(color){
	
	dynObj.lightCol = color;
	dynObj.lightCol0 = color;
	dynObj.lightCol1 = color;
	dynObj.lightCol2 = color;
	dynObj.lightCol3 = color;
	dynObj.lightCol4 = color;
	
	for(var i = 0; i < allLights.length; i++){
		allLights[i].color.setHex(color);	
	}
}

function setLightIntensity(val){
	dynObj.lightInt = val;
	for(var i = 0; i < allLights.length; i++){
		if(i<dynObj.lightAmt){
			allLights[i].intensity = val;	
		}else{
			allLights[i].intensity = 0.0;
		}
	}
}

function setRandomLightColors(){
	for(var i = 0; i < allLights.length; i++){
		var col = new THREE.Color(0xffffff);
		col.setHSL(Math.random(), 1.0, 0.5);	
		switch(i){
			case 0:dynObj.lightCol0 = "0x"+col.getHexString();
			break;
			case 1:dynObj.lightCol1 = "0x"+col.getHexString();
			break;
			case 2:dynObj.lightCol2 = "0x"+col.getHexString();	
			break;
			case 3:dynObj.lightCol3 = "0x"+col.getHexString();
			break;
			case 4:dynObj.lightCol4 = "0x"+col.getHexString();
			break;	
		}
		
		allLights[i].color = col;
		
	}
}

function setBaseMesh(mesh){
	
	if(distortionObject){
		distortionObject = null;
	}	
	
	if(distortionHolder){
		scene.__removeObject(distortionHolder);
	}
	
	dynObj.currentDistortionGeo = mesh;
	initDistortion();
}

function setTextureTile(amount){
	dynObj.distortionTile = amount;
	if(distortionTexture && distortionMat){
		distortionMat.uniforms.myTile.value = amount;
	}
}


function setDistortionAmount(amount){
	dynObj.distortionDistortionAmount = amount;
	if(distortionTexture && distortionMat){
		distortionMat.uniforms.myOffset.value = amount;
	}
}


function setDistortionColor(color){
	dynObj.distortionColor = color;	
	if(distortionMesh && distortionMat){
		var col = new THREE.Color();
		col.setHex(color);
		distortionMat.uniforms.diffuse.value = col;
		distortionMat.needsUpdate = true;
	}
}

function setDistortionSpecColor(color){
	dynObj.distortionSpecColor = color;	
	if(distortionMesh && distortionMat){
		var col = new THREE.Color();
		col.setHex(color);
		distortionMat.uniforms.specular.value = col;
		distortionMat.needsUpdate = true;
	}
}

function setDistortionShininess(val){	
	dynObj.distortionShininess = val;
	if(distortionMesh && distortionMat){
	
		distortionMat.uniforms.shininess.value = val;
			
		distortionMat.needsUpdate = true;
	}
}

function setDistortionReflectivity(val){	
	dynObj.distortionReflectivity = val;
	if(distortionMesh && distortionMat){
		distortionMat.uniforms.reflectivity.value = val;
	}
}

function returnReflectionOperation(){
	switch(dynObj.distortionReflectionOperation){
		//multiply:"multiply", mix:"mix", add:"add
		case 0:return "multiply";
		break;
		case 1:return "mix";
		break;
		case 2:return "add";
		break;	
	}
}

function setDistortionReflectionCombine(val){
	if(distortionMesh && distortionMat){
		setBaseReflection(val);
		distortionMat.uniforms.combine.value = dynObj.distortionReflectionOperation;
		distortionMat.needsUpdate = true;
	}
}

function setDistortionShading(val){
	
	if(distortionObject){
		distortionObject = null;
	}	
	
	if(distortionHolder){
		scene.__removeObject(distortionHolder);
	}
	
	dynObj.distortionShading = val;
	initDistortion();
	
}

function returnEnvironmentMap(){
	switch(dynObj.currentReflection){
		case 0:	return "studio1";
		break;
		case 1:	return "studio2";
		break;
		case 2:	return "ocean";
		break;
		case 3:	return "mountain";
		break;
		case 4:	return "desert";
		break;
	}
}

function setEnvironmentMap(val){
	
	switch(val){
		case "studio1":	dynObj.currentReflection = 0;
		break;
		case "studio2": dynObj.currentReflection = 1;
		break;
		case "ocean": dynObj.currentReflection = 2;
		break;
		case "mountain":dynObj.currentReflection = 3;
		break;
		case "desert":dynObj.currentReflection = 4;
		break;
	}
	
	distortionMat.uniforms.envMap.value = reflections[dynObj.currentReflection];
	distortionMat.needsUpdate = true;
	
}


function setDistortionDoNormals(value){
	dynObj.distortionDoNormals = value;
	if(distortionObject && distortionMesh){
		distortionObject.updateDoNormals(value);
	}
}

function setDistortionAxis(value){
	dynObj.distortionAxis = value;
	if(distortionObject && distortionMesh){
		distortionObject.updateAxis(value);
	}
}

function setDistortionHeight(value){
	dynObj.distortionHeight = value;
	if(distortionObject && distortionMesh){
		distortionObject.updateHeight(value);
	}
}

function setDistortionWidth(value){
	dynObj.distortionWidth = value*.001;
	if(distortionObject && distortionMesh){
		distortionObject.updateWidth(value*.001);
	}
}

function setDistortionSpeed(value){
	dynObj.distortionSpeed = value*.01;
	if(distortionObject && distortionMesh){
		distortionObject.updateSpeed(value*.01);
	}
}

function setDistortionRandom(rnd){
	dynObj.distortionRandomMult = rnd;
	if(distortionObject && distortionMesh){
		distortionObject.updateRandomMult(rnd);	
	}
}




	