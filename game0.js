/*
Game 0
This is a ThreeJS program which implements a simple game
The user moves a cube around the board trying to knock balls into a cone

*/


	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, avatarCam, edgeCam;  // we have two cameras in the main scene
	var avatar;
	var building1, building2, building3;
	var numBalls =1;

	//var npc1, npc2;
	// here are some mesh objects ...

	//var cone;

	var endScene, endCamera, endText;
	var endScene2, endCamera2, endText2;
	var startScene, startCamera, startText;




	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, fly:false, reset:false,
		    camera:camera}

	var gameState =
	     {score:0, health:10, scene:'start', camera:'none' }


	// Here is the main game control
  init(); //
	initControls();
	animate();  // start the animation loop!

	function createStartScene(){

		startScene = initScene();
		var geometry = new THREE.SphereGeometry( 80, 80, 80 );
		var texture = new THREE.TextureLoader().load( '../images/startscreen.png' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 4, 4 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var startText = new THREE.Mesh( geometry, material, 0 );
		startText.receiveShadow = false;
		startScene.add(startText);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		startScene.add(light1);
		startCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		startCamera.position.set(0,0,0);
		startCamera.lookAt(0,0,10);
	}


	function createEndScene(){
		endScene = initScene();
		endText = createSkyBox('youwon.png',10);
		//endText.rotateX(Math.PI);
		endScene.add(endText);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		endScene.add(light1);
		endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		endCamera.position.set(0,50,1);
		endCamera.lookAt(0,0,0);

	}

	function createLoseScene(){
			endScene2 = initScene();
			endText2 = createSkyBox('youlose.png',10);
			//endText.rotateX(Math.PI);
			endScene2.add(endText2);
			var light2 = createPointLight();
			light2.position.set(0,200,20);
			endScene2.add(light2);
			endCamera2 = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			endCamera2.position.set(0,50,1);
			endCamera2.lookAt(0,0,0);

	}

	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs();
			scene = initScene();
			createStartScene();
			createEndScene();
			createLoseScene();
			initRenderer();
			createMainScene();
	}


	function createMainScene(){
      // setup lighting
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			scene.add(light1);
			var light0 = new THREE.AmbientLight( 0xffffff,0.25);
			scene.add(light0);

			// create main camera
			camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera.position.set(0,50,0);
			camera.lookAt(0,0,0);



			// create the ground and the skybox
			var ground = createGround('lava.png');
			scene.add(ground);
			var skybox = createSkyBox('sky.jpg',1);
			scene.add(skybox);

			// create the avatar
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			avatar = createAvatar();
			avatar.translateY(20);
			avatarCam.translateY(-4);
			avatarCam.translateZ(3);
			scene.add(avatar);
			gameState.camera = avatarCam;

      edgeCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
      edgeCam.position.set(20,20,10);

			//addBalls();

			//for (int i=0, i<20, i++){
				ball = createBall();
				ball.position.set(randN(5)+15,randN(5)+15,randN(5)+15);
				scene.add(ball);
			//}

			/*ball2 = createBall();
			ball2.position.set(randN(20)+15,randN(20)+15,randN(20)+15);
			scene.add(ball2);

			ball3 = createBall();
			ball3.position.set(randN(20)+15,randN(20)+15,randN(20)+15);
			scene.add(ball3);*/

			// This part adds the buildings the helicopter avoids.
			building1 = createBox();
			building1.position.set(10,3,7);
			scene.add(building1);

			building2 = createBox();
			building2.position.set(20,3,12);
			scene.add(building2);

			building3 = createBox();
			building3.position.set(5,3,3);
			scene.add(building3);

			building4 = createBox();
			building4.position.set(0,3,15);
			scene.add(building4);

			building5 = createBox();
			building5.position.set(-5,3,17);
			scene.add(building5);

			building6 = createBox();
			building6.position.set(-10,3,2);
			scene.add(building6);

			building7 = createBox();
			building7.position.set(-15,3,10);
			scene.add(building7);
			/*cone = createConeMesh(4,6);
			cone.position.set(10,3,7);
			scene.add(cone);*/

			//playGameMusic();

	}


	function randN(n){
		return Math.random()*n;
	}


	/*function addBalls(){
		for(i=0;i<numBalls;i++){
			var ball = createBall();
			ball.position.set(randN(20)+15,randN(20)+15,randN(20)+15);
			scene.add(ball);
		}
	}*/

	/*function addBalls(){
		var numBalls = 20;


		for(i=0;i<numBalls;i++){
			var ball = createBall();
			ball.position.set(randN(20)+15,randN(20)+15,randN(20)+15);
			scene.add(ball);

			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==avatar){
						console.log("avatar hit the ball");
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						if (gameState.score==numBalls) {
							soundEffect('harp.wav');
							gameState.scene='youwon';
						}
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
					}
				}
			)
		}
	}
*/

	function playGameMusic(){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/loop.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 0.05 );
			sound.play();
		});
	}

	function soundEffect(file){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/'+file, function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( 0.5 );
			sound.play();
		});
	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
    var scene = new Physijs.Scene();
		return scene;
	}

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
  }
	/*
		The renderer needs a size and the actual canvas we draw on
		needs to be added to the body of the webpage. We also specify
		that the renderer will be computing soft shadows
	*/
	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}


	function createPointLight(){
		var light;
		light = new THREE.PointLight( 0xffffff);
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		return light;
	}

	function createSphereMesh(color){
		var geometry = new THREE.SphereGeometry( 2.5,16,16);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new THREE.Mesh( geometry, material );
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}



	function createGround(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 180, 180, 128 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 15, 15 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );

		mesh.receiveShadow = true;

		mesh.rotateX(Math.PI/2);
		mesh.addEventListener( 'collision',
			function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				if (other_object==avatar){
					console.log("You touched the ground");
					soundEffect('fail.wav');
					gameState.scene='youlose';
				}
			}
		)
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}



	function createSkyBox(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.SphereGeometry( 80, 80, 80 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new THREE.Mesh( geometry, material, 0 );

		mesh.receiveShadow = false;


		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical


	}

	function createAvatar(other_object){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var geometry = new THREE.BoxGeometry( 5, 5, 6);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		//var suzanne = initSuzanneJSON();
		avatarCam.position.set(0,4,0);
		avatarCam.lookAt(0,4,10);
		mesh.add(avatarCam);

		return mesh;
	}

	function initSuzanneJSON() {

		var loader = new THREE.JSONLoader();
		loader.load("../models/suzanne.json",
					function ( geometry, materials ) {
						console.log("loading suzanne");
						var material = new THREE.MeshLambertMaterial( {color: 0x00ff00});
						var pmaterial = new Physijs.createMaterial(material, 0.9, 0.5);
						 //materials[ 0 ];
						var suzanne = new Physijs.BoxMesh( geometry, pmaterial );
						//var suzanne = new THREE.Mesh(geometry, material);
						avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
						gameState.camera = avatarCam;
						console.log("created suzanne mesh");
						console.log(JSON.stringify(suzanne.scale));// = new THREE.Vector3(4.0,1.0,1.0);
						scene.add( suzanne  );
						var s = 0.5;
						suzanne.scale.y=s;
						suzanne.scale.x=s;
						suzanne.scale.z=s;
						suzanne.position.z = 0;
						suzanne.position.y = 0;
						suzanne.position.x = 0;
						suzanne.castShadow = true;
						avatarCam.position.set(0,4,0);
						avatarCam.lookAt(0,4,10);
						suzanne.add(avatarCam);
						scene.add(suzanne);
						return suzanne;
					},
					function(xhr){
						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
					function(err){console.log("error in loading: "+err);}
				)
	}


		function createBox(){
			var geometry = new THREE.BoxGeometry(5,40,5);
			var texture = new THREE.TextureLoader().load( '../images/skyScraper.jpg' );
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( 1, 1 );
			var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
			var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
			var mesh = new Physijs.ConeMesh( geometry, pmaterial, 0 );
			mesh.castShadow = true;
			return mesh;
		}



	function createBall(){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var geometry = new THREE.SphereGeometry( 1, 16, 16);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		mesh = new Physijs.BoxMesh( geometry, material,0 );
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		mesh.addEventListener( 'collision',
			function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				console.dir(other_object)
				if (other_object==avatar){
					console.log("avatar hit the ball");
					soundEffect('good.wav');
					gameState.score += 1;  // add one to the score
					if (gameState.score==numBalls) {
						soundEffect('harp.wav');
						gameState.scene='youwon';
					}
					mesh.position.y = mesh.position.y - 100;
					mesh.__dirtyPosition = true;
				}
			}
		)
		return mesh;
	}


	var clock;

	function initControls(){
		// here is where we create the eventListeners to respond to operations

		  //create a clock for the time-based animation ...
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
			window.addEventListener( 'keyup',   keyup );
			window.addEventListener('p', p);
  }

	function keydown(event){
		console.log("Keydown: '"+event.key+"'");
		//console.dir(event);
		if (gameState.scene == 'start' && event.key == 'p') {
			gameState.scene = 'main';
			gameState.score = 0;
			//addBalls();
			return;
		}
		// first we handle the "play again" key in the "youwon" scene
		if (gameState.scene == 'youwon' && event.key=='r') {
			gameState.scene = 'main';
			gameState.score = 0;
			//addBalls();
			return;
		}
		if (gameState.scene == 'youlose' && event.key=='r') {
			gameState.scene = 'main';
			gameState.score = 0;
			//addBalls();
			return;
		}
		if(gameState.scene == 'start' && event.key == 'p') {

			gameState.scene = 'main';
			gameState.score = 0;
			//addBalls();
			return;
		}
		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "r": controls.up = true; break;
			case "f": controls.down = true; break;
			case "m": controls.speed = 30; break;
      case " ": controls.fly = true;
			case "p": controls.start = true; break;
			case "y": controls.color = true; break;
          console.log("space!!");
          break;
      case "h": controls.reset = true; break;



			// switch cameras
			case "1": gameState.camera = camera; break;
			case "2": gameState.camera = avatarCam; break;
      case "3": gameState.camera = edgeCam; break;

			// move the camera around, relative to the avatar
			case "ArrowLeft": avatarCam.translateY(1);break;
			case "ArrowRight": avatarCam.translateY(-1);break;
			case "ArrowUp": avatarCam.translateZ(-1);break;
			case "ArrowDown": avatarCam.translateZ(1);break;
			case "q": avatarCam.rotateY(0.25);break;
			case "e": avatarCam.rotateY(-0.25);break;
			case "t": avatarCam.rotateX(-0.25);break;
			case "u": avatarCam.rotateX(0.25);break;
			case "g": avatarCam.rotateZ(0.25);break;
			case "j": avatarCam.rotateZ(-0.25);break;
			case "g": avatarCam.rotateY(-0.25);break;
			case "j": avatarCam.rotateY(0.25);break;

		}

	}

	function keyup(event){
		//console.log("Keydown:"+event.key);
		//console.dir(event);
		switch (event.key){
			case "W": controls.fwd   = false;  break;
			case "S": controls.bwd   = false; break;
			case "A": controls.left  = false; break;
			case "D": controls.right = false; break;
			case "r": controls.up    = false; break;
			case "f": controls.down  = false; break;
			case "m": controls.speed = 10; break;
      case " ": controls.fly = false; break;
      case "h": controls.reset = false; break;
		}
	}

	function p(event) {

		if (gameState.scene == 'startScene' && event.key=='P') {
			gameState.scene = 'main';
			gameState.score = 0;
			//addBalls();
			return;
		}

	}

	function color(event) {


		if(event.key =='Y') {

			avatar.material.color.setHex( 0xff0000 );
		}
	}

  function updateAvatar(){
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = avatar.getWorldDirection();

		if (controls.fwd){
			avatar.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			avatar.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = avatar.getLinearVelocity();
			velocity.x=velocity.z=0;
			avatar.setLinearVelocity(velocity); //stop the xz motion
		}

    if (controls.fly){
      avatar.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
    }

		if (controls.left){
			avatar.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0));
		} else if (controls.right){
			avatar.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0));
		}

    if (controls.reset){
      avatar.__dirtyPosition = true;
      avatar.position.set(40,10,40);
    }

	}



	function animate() {

		requestAnimationFrame( animate );

		switch(gameState.scene) {

			case "start":
				renderer.render( startScene, startCamera );
				break;

			case "youwon":
				endText.rotateY(0.005);
				renderer.render( endScene, endCamera );
				break;

			case "youlose":
					endText2.rotateY(0.005);
					renderer.render( endScene2, endCamera2 );
					break;

			case "main":
				updateAvatar();
        edgeCam.lookAt(avatar.position);
	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
				}
				break;

			default:
			  console.log("don't know the scene "+gameState.scene);

		}

		//draw heads up display ..
	  var info = document.getElementById("info");
		//info.innerHTML='<div style="font-size:24pt">Score: ' + gameState.score + ';  Health: ' + gameState.health +'</div>';
		//info.innerHTML='<div style="font-size:24pt">Score: ' + gameState.score +'</div>';
		info.innerHTML='<div style="font-size:24pt">Find the ball and do not touch the lava and avoid the buildings!Use the WASD keys to move and the spacebar to rise up. W is up, A left, S down, D right </div>';

	}
