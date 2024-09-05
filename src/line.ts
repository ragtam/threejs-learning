import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const initialCameraPosition = new THREE.Vector3(3, 0, 5);

export function drawLine() {
   // Scene setup
   const scene = new THREE.Scene();

   // Camera setup
   const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
   camera.lookAt(0,0,0);
   
   // Renderer setup
   const renderer = new THREE.WebGLRenderer({
    antialias:true,
    canvas: document.getElementById('car-model') as any
   });
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);

   // Lighting setup
   const light = new THREE.AmbientLight(0x404040, 1); // soft white light
   scene.add(light);

   const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

   scene.add(directionalLight);

   let model: THREE.Group<THREE.Object3DEventMap> | null = null;

   const loader = new GLTFLoader();
   loader.load(
       '/porsche/scene.gltf',  // replace with the correct path to your .gltf file
       function (gltf) {
            model = gltf.scene;
           scene.add(gltf.scene);
           render();
       },
       undefined, // onProgress callback
       function (error) {
           console.error('An error happened:', error);
       }
   );

   let scrollPercent = 0;

   window.addEventListener('scroll', () => {
    scrollPercent = getScrollProgressAsPercent();
   });

   function getScrollProgressAsPercent() {
    return ((document.documentElement.scrollTop || document.body.scrollTop) /
        ((document.documentElement.scrollHeight ||
            document.body.scrollHeight) -
            document.documentElement.clientHeight)) *
    100
   }

   const animations: { start: number, end: number, func: () => void }[] = [];
   animations.push({
    start: 0,
    end: 40,
    func: () => {
        if(model) {
            model.rotation.y = lerp(1.5, 1.5, scalePercent(0, 40));

            camera.lookAt(0,0,0);
            camera.position.z = lerp(4, 1, scalePercent(0, 40));
        }
    }
   });
   animations.push({
    start: 40,
    end: 70,
    func: () => {
        if(model) {
            model.rotation.y = lerp(1.5, 0, scalePercent(40, 70));

            camera.lookAt(0,0,0);
            camera.position.y = lerp(0.5, 1, scalePercent(40, 70));
        }

    },
   });

   animations.push({
    start: 70,
    end: 100,
    func: () => {
        if(model) {
            model.rotation.y = lerp(0, -2, scalePercent(70, 100));

            camera.position.z = lerp(1, 2, scalePercent(70, 100));

            // camera.lookAt(0,0,0);
            // camera.position.y = lerp(0.5, 1, scalePercent(30, 50));
        }

    }});

    animations.push({
        start: 80,
        end: 100,
        func: () => {
            if(model) {
                // model.rotation.y = lerp(0, -2, scalePercent(50, 80));
    
                // camera.position.x = lerp(0, 5, scalePercent(80, 100));
    
                // camera.lookAt(0,0,0);
                // camera.position.y = lerp(0.5, 1, scalePercent(30, 50));
            }
    
        }});

//    animations.push({
//     start: 60,
//     end: 100,
//     func: () => {
//         if(model) {
//             model.rotation.x = lerp(1, 0, scalePercent(60, 100));
//             camera.lookAt(0,0,0);
//             camera.position.z = lerp(0, 0.1, scalePercent(60, 100));
//         }
//         // model.rotation.x = lerp(0.4, 0.4, scalePercent(0, 30));

//     }
//    });



   function playScrollAnimations() {
        animations.forEach( a => {
            if (scrollPercent >= a.start && scrollPercent < a.end) {
                a.func()
            }
        } )
   }

   /* Liner Interpolation
 * lerp(min, max, ratio)
 * eg,
 * lerp(20, 60, .5)) = 40
 * lerp(-20, 60, .5)) = 20
 * lerp(20, 60, .75)) = 50
 * lerp(-20, -10, .1)) = -.19
 */
function lerp(x: number, y: number, a: number): number {
    return (1 - a) * x + a * y
}

function scalePercent(start: number, end: number) {
    return (scrollPercent - start) / (end - start)
}

   // Render loop
   function render() {
        requestAnimationFrame(render);

        playScrollAnimations();

        // controls.update();
       renderer.render(scene, camera);
   }


   renderer.render( scene, camera );

   window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    }
}
