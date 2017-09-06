import Expo from 'expo';
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


export default class App extends React.Component {

  componentDidMount() {

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
    

    WEBVR.getVRDisplay( function ( display ) {
      renderer.vr.setDevice( display );
      // document.body.appendChild( WEBVR.getButton( display, renderer.domElement ) );
    } );

    camera.position.z = 5;

    const render = () => {
      requestAnimationFrame(render);

      // cube.rotation.x += 0.07;
      // cube.rotation.y += 0.04;


      // find intersections
				raycaster.setFromCamera( { x: 0, y: 0 }, camera );
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



      renderer.render(scene, camera);
      
      // NOTE: At the end of each frame, notify `Expo.GLView` with the below
      gl.endFrameEXP();
    }
    render();
  }
}