import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {Float32BufferAttribute} from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//fog
const fog = new THREE.Fog('#262837', 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')


const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
/**
 * House
 */

const house = new THREE.Group();

//z glitch offset
const glitchOffset = 0.001;

//walls
const wallsSizes = {
    width: 4,
    height: 4,
    depth: 4,
}
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(wallsSizes.width, wallsSizes.height, wallsSizes.depth),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        roughnessMap: bricksRoughnessTexture,
        normalMap: bricksNormalTexture,
    })
);
walls.position.y = wallsSizes.height / 2;
walls.geometry.setAttribute('uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)

// roof

const roofSizes = {
    radius: 3.5,
    height: 1.5,
    radialSegments: 4,
}
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(roofSizes.radius, roofSizes.height, roofSizes.radialSegments),
    new THREE.MeshStandardMaterial({color: '#b35f45'})
)
roof.position.y = wallsSizes.height + roofSizes.height / 2;
roof.rotation.y = Math.PI * .25;

// door
const doorSizes = {
    width: 2.2,
    height: 2.2,
}
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(doorSizes.width, doorSizes.height, 200, 200),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: .1,
        normalMap: doorNormalTexture,
        roughnessMa: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,

    })
)
door.geometry.setAttribute('uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.z = wallsSizes.depth / 2 + glitchOffset;
door.position.y = doorSizes.height / 2;


house.add(walls, roof, door)
scene.add(house)

//bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'});

const bushesArray = [
    {
        position: [wallsSizes.width / 2 + .48, .2, wallsSizes.depth / 2],
        scale: [.5, .5, .5]
    },
    {
        position: [wallsSizes.width / 2, .1, wallsSizes.depth / 2 + .2],
        scale: [.25, .25, .25]
    },
    {
        position: [-wallsSizes.width / 4, .1, wallsSizes.depth / 2 + .36],
        scale: [.4, .4, .4],
    },
    {
        position: [wallsSizes.width / 2 + .2, .1, wallsSizes.depth / 2 + .5],
        scale: [.15, .15, .15],
    },
    {
        position: [-wallsSizes.width / 3, .1, wallsSizes.depth / 2 + .6],
        scale: [.15, .15, .15],
    },
]
for (let i = 0; i < bushesArray.length; i++) {
    const bush = new THREE.Mesh(bushGeometry, bushMaterial);
    bush.position.set(...bushesArray[i].position)
    bush.scale.set(...bushesArray[i].scale)
    bush.castShadow = true;
    bush.receiveShadow = true;
    scene.add(bush)
}

// graves
const graves = new THREE.Group();
scene.add(graves)
const graveSizes = {
    width: .6,
    height: .8,
    depth: .2,
}
const graveGeometry = new THREE.BoxBufferGeometry(graveSizes.width, graveSizes.height, graveSizes.depth)
const graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'})


for (let i = 0; i < 50; i++) {

    const angle = Math.random() * Math.PI * 2;
    const radius = 3.5 + Math.random() * 6;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, .35, z)
    grave.rotation.set(
        (Math.random() - .5) * .5,
        (Math.random() - .5) * 1.2,
        (Math.random() - .5) * .25);
    grave.castShadow = true;
    grave.receiveShadow = true;
    graves.add(grave)
}


// ghosts
const ghostsArray = [
    {
        color: '#ff00ff',
        animationSets: {
            correction: .55,
            x: 4,
            y: 2,
            z: -4,
        }
    },
    {
        color: '#00ffff',
        animationSets: {
            correction: .34,
            x: -5,
            y: 2,
            z: 5,
        }
    },
    {
        color: '#ffff00',
        animationSets: {
            correction: .44,
            x: 3,
            y: 2,
            z: -3,
        }
    },
    {
        color: '#00aa3a',
        animationSets: {
            correction: .25,
            x: -3,
            y: 1.2,
            z: 4,
        }
    },
]

for (let i = 0; i < ghostsArray.length; i++) {

    const ghost = new THREE.PointLight(ghostsArray[i].color, 2.5, 4)
    ghost.position.set(ghostsArray[i].animationSets.x, ghostsArray[i].animationSets.y, ghostsArray[i].animationSets.z)
    ghostsArray[i].ghost = ghost;
    // const plhelper = new THREE.PointLightHelper(ghost)
    ghost.castShadow = true;
    ghost.shadow.mapSize.width = 256;
    ghost.shadow.mapSize.height = 256;
    ghost.shadow.camera.far = 7;
    scene.add(ghost)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
    })
)
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
floor.geometry.setAttribute('uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('ambientLight intensity')
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.25)
moonLight.position.set(4, 5, -2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001).name('moonLight intensity')
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

//door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 10);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

// shadow

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
walls.castShadow = true;
floor.receiveShadow = true;
// roof.castShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;



/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    //ghost anim

    ghostsArray.map((el, id) => {
        const ghostAngle = elapsedTime * el.animationSets.correction;
        if (id % 2 === 0) {
            el.ghost.position.y = Math.abs(Math.cos(ghostAngle) * el.animationSets.y * 2 + Math.cos(elapsedTime * el.animationSets.y / 2))

        } else {
            el.ghost.position.y = Math.abs(Math.cos(ghostAngle) * el.animationSets.y * 7 + Math.cos(elapsedTime * el.animationSets.y / 2))
        }
        el.ghost.position.x = Math.sin(ghostAngle) * el.animationSets.x * el.animationSets.x / 4
        el.ghost.position.z = Math.sin(elapsedTime * el.animationSets.z) * el.animationSets.z / 2

    })

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()