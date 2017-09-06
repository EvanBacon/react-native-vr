import Expo, {Accelerometer, Gyroscope} from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import WEBVR from 'three/examples/js/vr/WebVR';
import './FakeBrowser';
import './VR';
import Util from './VR/util'; 


if (!console.time) {
  console.time = () => {};
}
if (!console.timeEnd) {
  console.timeEnd = () => {};
}

console.ignoredYellowBox = [
  'THREE.WebGLRenderer',
  'THREE.WebGLProgram',
  'Invalid timestamps detected. Time step between'
];



const StereoEffect = function ( renderer ) {
  
    var _stereo = new THREE.StereoCamera();
    _stereo.aspect = 0.5;
  
    this.setEyeSeparation = function ( eyeSep ) {
  
      _stereo.eyeSep = eyeSep;
  
    };
  
    this.setSize = function ( width, height ) {
  
      renderer.setSize( width, height );
  
    };
  
    this.render = function ( scene, camera, gl ) {
      
      scene.updateMatrixWorld();
  
      if ( camera.parent === null ) camera.updateMatrixWorld();

      _stereo.update( camera );
      renderer.render(scene, camera);
      
      var size = renderer.getSize();
  
      if ( renderer.autoClear ) renderer.clear();
      renderer.setScissorTest( true );
  
      renderer.setScissor( 0, 0, size.width / 2, size.height );
      renderer.setViewport( 0, 0, size.width / 2, size.height );
      renderer.render( scene, _stereo.cameraL );
  
      renderer.setScissor( size.width / 2, 0, size.width / 2, size.height );
      renderer.setViewport( size.width / 2, 0, size.width / 2, size.height );
      renderer.render( scene, _stereo.cameraR );
  
      renderer.setScissorTest( false );
  
    };
  
  };

class DeviceMotion {
  _framerate;
  set frameRate(value) {
    this._framerate = value;
    Accelerometer.setUpdateInterval(value);
    Gyroscope.setUpdateInterval(value);
  }
  get framerate() {
    return this._framerate;
  }

  acceleration = {x: 0, y: 0, z: 0};
  accelerationIncludingGravity = {x: 0, y: 0, z: 0};
  rotationRate = {alpha: 0, beta: 0, gamma: 0};

  constructor() {
    _framerate = 24;
  }
  _listeners = [];
  addListener = (listener) => {
    return this._listeners.push(listener);
  }
  removeListener = (listener) => {
    const index = this._listeners.indexOf(listener);
    if (index >= 0) {
      this._listeners.splice(index, 1);
    }
  }
  start = () => {
    const timestamp = () => new Date().getTime();
    let deviceMotion = {accelerationIncludingGravity: {x: 0, y: 0, z: 0}, rotationRate: {alpha: 0, beta: 0, gamma: 0}, timeStamp: 0 }
    Accelerometer.addListener(({ x, y, z }) => {
      this.acceleration = {
        x: x,
        y: y,
        z: z
      };
      this.update();
    });
    Accelerometer.setUpdateInterval(frameRate)
  
    Gyroscope.addListener(({ x, y, z }) => {
      this.rotationRate = {
        alpha: z,
        beta: x,
        gamma: y
      };
      this.update();
    });
    Gyroscope.setUpdateInterval(frameRate)
  
  }
  stop = () => {
    Accelerometer.removeAllListeners();
    Gyroscope.removeAllListeners();
  }
  update = () => {
    for (const listener of _listeners) {
      listener && listener({
        timestamp: new Date().getTime(),
        acceleration: this.acceleration,
        accelerationIncludingGravity: this.accelerationIncludingGravity,
        rotationRate: this.rotationRate,
        interval: this.framerate
      })
    }
  }
}

export default class App extends React.Component {

  componentDidMount() {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.LANDSCAPE_LEFT);
  }
  render() {
    // return (null);
    // Create an `Expo.GLView` covering the whole screen, tell it to call our
    // `_onGLContextCreate` function once it's initialized.
    return (
      <Expo.GLView
        style={{ flex: 1 }}
        onContextCreate={this._onGLContextCreate}
      />
    );
  }

  // This is called by the `Expo.GLView` once it's initialized
  _onGLContextCreate = async (gl) => {
    // Based on https://threejs.org/docs/#manual/introduction/Creating-a-scene
    // In this case we instead use a texture for the material (because textures
    // are cool!). All differences from the normal THREE.js example are
    // indicated with a `NOTE:` comment.

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);

      const crosshair = new THREE.Mesh(
        new THREE.RingGeometry( 0.02, 0.04, 32 ),
        new THREE.MeshBasicMaterial( {
          color: 0xffffff,
          opacity: 0.5,
          transparent: true
        } )
      );
      crosshair.position.z = - 2;
      camera.add( crosshair );


      room = new THREE.Mesh(
        new THREE.BoxGeometry( 6, 6, 6, 8, 8, 8 ),
        new THREE.MeshBasicMaterial( { color: 0x404040, wireframe: true } )
      );
      scene.add( room );
      scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );
      var light = new THREE.DirectionalLight( 0xffffff );
      light.position.set( 1, 1, 1 ).normalize();
      scene.add( light );
      var geometry = new THREE.BoxGeometry( 0.15, 0.15, 0.15 );
      for ( var i = 0; i < 200; i ++ ) {
        var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        object.position.x = Math.random() * 4 - 2;
        object.position.y = Math.random() * 4 - 2;
        object.position.z = Math.random() * 4 - 2;
        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
        object.scale.x = Math.random() + 0.5;
        object.scale.y = Math.random() + 0.5;
        object.scale.z = Math.random() + 0.5;
        object.userData.velocity = new THREE.Vector3();
        object.userData.velocity.x = Math.random() * 0.01 - 0.005;
        object.userData.velocity.y = Math.random() * 0.01 - 0.005;
        object.userData.velocity.z = Math.random() * 0.01 - 0.005;
        room.add( object );
      }
      const raycaster = new THREE.Raycaster();

    // NOTE: How to create an `Expo.GLView`-compatible THREE renderer
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.vr.enabled = true;
    const effect = new StereoEffect(renderer);

    WEBVR.getVRDisplay( function ( display ) {
      renderer.vr.setDevice( display );
      // document.body.appendChild( WEBVR.getButton( display, renderer.domElement ) );
    } );

    camera.position.z = 5;

    const render = () => {
      requestAnimationFrame(render);

      // cube.rotation.x += 0.07;
      // cube.rotation.y += 0.04;

      effect.render(scene, camera, gl);

      // find intersections
				// raycaster.setFromCamera( { x: 0, y: 0 }, camera );
				// var intersects = raycaster.intersectObjects( room.children );
				// if ( intersects.length > 0 ) {
				// 	if ( INTERSECTED != intersects[ 0 ].object ) {
				// 		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
				// 		INTERSECTED = intersects[ 0 ].object;
				// 		INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
				// 		INTERSECTED.material.emissive.setHex( 0xff0000 );
				// 	}
				// } else {
				// 	if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
				// 	INTERSECTED = undefined;
				// }
				// // Keep cubes inside room
				// for ( var i = 0; i < room.children.length; i ++ ) {
				// 	var cube = room.children[ i ];
				// 	cube.userData.velocity.multiplyScalar( 1 - ( 0.001 * delta ) );
				// 	cube.position.add( cube.userData.velocity );
				// 	if ( cube.position.x < - 3 || cube.position.x > 3 ) {
				// 		cube.position.x = THREE.Math.clamp( cube.position.x, - 3, 3 );
				// 		cube.userData.velocity.x = - cube.userData.velocity.x;
				// 	}
				// 	if ( cube.position.y < - 3 || cube.position.y > 3 ) {
				// 		cube.position.y = THREE.Math.clamp( cube.position.y, - 3, 3 );
				// 		cube.userData.velocity.y = - cube.userData.velocity.y;
				// 	}
				// 	if ( cube.position.z < - 3 || cube.position.z > 3 ) {
				// 		cube.position.z = THREE.Math.clamp( cube.position.z, - 3, 3 );
				// 		cube.userData.velocity.z = - cube.userData.velocity.z;
				// 	}
				// 	cube.rotation.x += cube.userData.velocity.x * 2 * delta;
				// 	cube.rotation.y += cube.userData.velocity.y * 2 * delta;
				// 	cube.rotation.z += cube.userData.velocity.z * 2 * delta;
				// }



      // renderer.render(scene, camera);
      
      // NOTE: At the end of each frame, notify `Expo.GLView` with the below
      gl.endFrameEXP();
    }
    render();
  }
}