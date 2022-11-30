

var DistortionObject = function(OBJ, NORMAL, AXIS, HEIGHT, WIDTH, SPEED, RANDOMMULT, IMAGE){
	
	this.axis = AXIS;
	this.width = WIDTH;
	this.obj = OBJ;
	this.geo = this.obj.geometry;
	this.doNormals = NORMAL;
	this.height = HEIGHT;
	this.image = IMAGE;
	this.speed = SPEED;
	this.randomMult = RANDOMMULT;
	this.fvNames = [ 'a', 'b', 'c', 'd' ];
	this.positions = [];
	this.ax = AXIS;
	this.axis = [];
	this.directions = [];
	this.randoms=[];
	this.ot = false;
	this.vertIndex = 0;
	this.vertCount = 0;
	this.ot = false;
	
	this.init = function(){
		
		for( var i = 0; i < this.geo.faces.length; i ++ ) {
			
			var face = this.geo.faces[i];		
			
			var dr = [];
			var og = [];
			var ax = [];
			var rd = [];
				
			for(var k = 0; k<face.vertexNormals.length; k++){
				this.vertCount++;
				dr[k] = new THREE.Vector3(face.vertexNormals[k].x, face.vertexNormals[k].y, face.vertexNormals[k].z);
				og[k] = new THREE.Vector3(this.geo.vertices[face[this.fvNames[k]]].x, this.geo.vertices[face[this.fvNames[k]]].y, this.geo.vertices[face[this.fvNames[k]]].z);
				rd[k] = Math.random()*20.0;
				switch(this.ax){
					case "x":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].x*this.width);
					break;	
					case "y":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].y*this.width);
					break;	
					case "z":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].z*this.width);
					break;
					case "xy":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].x*this.geo.vertices[face[this.fvNames[k]]].y*this.width);
					break;
					case "xz":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].x*this.geo.vertices[face[this.fvNames[k]]].z*this.width);
					break;
					case "yz":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].y*this.geo.vertices[face[this.fvNames[k]]].z*this.width);
					break;	
					case "xyz":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].y*this.geo.vertices[face[this.fvNames[k]]].x*this.geo.vertices[face[this.fvNames[k]]].z*this.width);
					break;	
						
				}
			}
			
			this.positions[i] = og;
			
			this.axis[i] = ax;	
			
			this.directions[i]  = dr;
			
			this.randoms[i] = rd;
			
		}
	
		//this.updateSpeed(this.speed);
		//this.updateHeight(this.height);
		//this.updateWidth(this.width);
		this.updateRandomMult(this.randomMult);		
		
	}
	
	this.animate = function(shouldPhase){
		
		for( var i = 0; i < this.geo.faces.length; i ++ ) {
				
			var face = this.geo.faces[i];
		
			var dr = this.directions[i];
			var og = this.positions[i];
			var ax = this.axis[i];
			var rd = this.randoms[i];
			
			for(var k = 0; k<face.vertexNormals.length; k++){
				
				var vertPhase = ((this.height)*.5)+Math.sin(dynObj.distortionPhase + ax[k])*((this.height)*.5);
			
				var thisVert = this.geo.vertices[face[this.fvNames[k]]];
				
				if(this.doNormals){
					
					thisVert.x = og[k].x + (vertPhase+ (rd[k]*this.randomMult)) * dr[k].x;
			
					thisVert.y = og[k].y + (vertPhase+ (rd[k]*this.randomMult)) * dr[k].y;
				
					thisVert.z = og[k].z + (vertPhase+ (rd[k]*this.randomMult)) * dr[k].z;
					
				}else{
				
					thisVert.x = og[k].x + vertPhase;
					
					thisVert.y = og[k].y + vertPhase;
				
					thisVert.z = og[k].z + vertPhase;	
				}
				
						
			}
			
		}
		if(shouldPhase){
			dynObj.distortionPhase+=this.speed;
		}
		
		this.obj.geometry.verticesNeedUpdate = true;
			
	}
	
	this.updateDoNormals = function(val){
		this.doNormals = val;
		this.animate(true);	
	}

	this.updateRandomMult = function(rnd){
		this.randomMult = rnd;
		this.animate(true);
	}
	
	this.updateSpeed = function(spd){
		this.speed = spd;
		this.animate(true);
	}
	
	this.updateHeight = function(hght){
		this.height = hght;
		this.animate(true);
	}
	
	this.updateWidth = function(wdth){
		this.width = wdth;
		this.resetAxis();
		this.animate(true);
	}
	
	this.updateAxis = function(a){
		this.ax = a;
		this.resetAxis();
		this.animate(true);
	}
	
	this.randomize = function(hght, wdth, spd, a){
		
		this.height = hght;
		this.width = wdth;
		this.speed = spd;
		this.ax = a;
		
		this.resetAxis();
		
		dynObj.distortionPhase = 0;
		this.animate(false);
	}
	
	
	this.resetAxis = function(){
		for( var i = 0; i < this.geo.faces.length; i ++ ) {
			
			var face = this.geo.faces[i];		
			
			var ax = [];
				
			for(var k = 0; k<face.vertexNormals.length; k++){
					

				switch(this.ax){
					case "x":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].x*this.width);
					break;	
					case "y":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].y*this.width);
					break;	
					case "z":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].z*this.width);
					break;
					case "xy":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].x*this.geo.vertices[face[this.fvNames[k]]].y*this.width);
					break;
					case "xz":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].x*this.geo.vertices[face[this.fvNames[k]]].z*this.width);
					break;
					case "yz":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].y*this.geo.vertices[face[this.fvNames[k]]].z*this.width);
					break;	
					case "xyz":
						ax[k] =  (this.geo.vertices[face[this.fvNames[k]]].y*this.geo.vertices[face[this.fvNames[k]]].x*this.geo.vertices[face[this.fvNames[k]]].z*this.width);
					break;	
						
				}
			}
			
			this.axis[i] = ax;	
				
		}
					
	}

}


