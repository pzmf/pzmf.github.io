function HandleLights(){
	if(lightsHolder){
		lightsHolder.rotation.x += dynObj.las;
		lightsHolder.rotation.y += dynObj.las;		
	}
}

function HandleDistortion(){
	if(distortionObject && distortionMesh){
		if(dynObj.distortionAnimate){
			distortionObject.animate(true);
		}	
	}
}

function HandleGif(){
	if(dynObj.isVideo || dynObj.bgIsVideo){
		if(video){
			//video.play();	
			if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
				if(!gifOverlayOT){
					killOverlay();
					gifOverlayOT = true;
				}
				videoIsPlaying = true;
				videoTex.needsUpdate = true;
				if(dynObj.isVideo){
					distortionTexture = videoTex;
					distortionMat = addBaseMaterial();
					distortionMat.needsUpdate = true;
					distortionMesh.material = distortionMat;
				}
				if(dynObj.bgIsVideo){
					bgTexture = videoTex;
					bgMat = addCustomBGMaterial();
					bgMat.needsUpdate = true;
					bgMesh.material = bgMat;
				}
			}
		}
	}	
	
	if(!dynObj.isVideo){
		if(gifObject && isGif){
			if(!gifObject.get_loading()){
				if(!gifOverlayOT){
					killOverlay();
					gifOverlayOT = true;
				}
				handleObjectCanvasTexture(false);
			}
		}
	}
	
	if(!dynObj.bgIsVideo){
		if(bgGifObject && bgIsGif){
			if(!bgGifObject.get_loading()){
				handleBGCanvasTexture(false);
			}
		}
	}
	
}


function handleObjectCanvasTexture(){
	var tex = new THREE.Texture(gifObject.get_canvas());
	
	if(distortionMesh){
		distortionTexture = tex;
		
		distortionMat = addBaseMaterial();
		
		distortionMesh.material = distortionMat;
		
		distortionMat.needsUpdate = true;
		distortionTexture.needsUpdate = true;
	
	}

}

function handleBGCanvasTexture(){
	var tex = new THREE.Texture(bgGifObject.get_canvas());
	if(bgMesh){
		bgTexture = tex;
		bgMat = addCustomBGMaterial();
		bgMat.needsUpdate = true;
		
		bgTexture.needsUpdate = true;
		bgMesh.material = bgMat;
	}	

}


function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseDown( event ) {
}

function killGUIClick(){
	
	mouseCont = true;
	
	document.getElementById("bottom").style.display = "none";
	document.getElementById("guiHolder").style.display = "none";
	
	if(document.getElementById("topLeft"))
		document.getElementById("topLeft").style.display = "none";
	
}

function onDocumentMouseUp( event ) {
	mouseCont = false;
	
	document.getElementById("bottom").style.display = "block";
	document.getElementById("guiHolder").style.display = "block";
	
	if(isBuild){
		camera.position.y = 0;
		if(document.getElementById("topLeft"))
			document.getElementById("topLeft").style.display = "block";
	}
}


function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX );
	mouseY = ( event.clientY - windowHalfY );
}

function onDocumentMouseWheel( event ) {
	
	if ( event.wheelDeltaY ) {
		cameraRad -= event.wheelDeltaY * 0.1;
	} else if ( event.wheelDelta ) {
		cameraRad -= event.wheelDeltaY * 0.1;
	} else if ( event.detail ) {
		cameraRad -= event.wheelDeltaY * 0.1;
	}

	if(cameraRad<0)cameraRad=0;
	if(cameraRad>1000)cameraRad=1000;
						
}