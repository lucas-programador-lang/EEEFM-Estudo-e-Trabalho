import * as THREE from 'three';

// --- Setup da cena 3D profissional e animada ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05060f); // Sincronizado com --bg-void do CSS
scene.fog = new THREE.FogExp2(0x05060f, 0.008);

// Câmera perspectiva com campo de visão dinâmico
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 3, 8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Evita quedas de FPS em telas 4K/Retina
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// --- Interatividade Inteligente (Mouse Track) ---
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// --- Iluminação Avançada ---
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
mainLight.position.set(5, 10, 4);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

const backLight = new THREE.PointLight(0xffaa66, 0.6); // Realce quente traseiro
backLight.position.set(-2, 2, -4);
scene.add(backLight);

const fillLight = new THREE.PointLight(0x4d82ff, 0.5); // Sincronizado com --cobalt
fillLight.position.set(3, 1, 2);
scene.add(fillLight);

const centerLight = new THREE.PointLight(0xffaa88, 0.4);
centerLight.position.set(0, 1, 0);
scene.add(centerLight);

// --- Objeto Principal: Torus Knot Metálico ---
const knotGeometry = new THREE.TorusKnotGeometry(1.1, 0.28, 200, 32, 3, 4);
const materialKnot = new THREE.MeshStandardMaterial({
    color: 0x4d82ff, // Cor inicial Cobalt
    emissive: 0x1a2035,
    emissiveIntensity: 0.4,
    metalness: 0.85,
    roughness: 0.25,
    flatShading: false
});
const torusKnot = new THREE.Mesh(knotGeometry, materialKnot);
torusKnot.castShadow = true;
scene.add(torusKnot);

// Anéis de partículas azuladas (Interno)
const ringParticlesCount = 800;
const ringGeometry = new THREE.BufferGeometry();
const ringPositions = new Float32Array(ringParticlesCount * 3);
for (let i = 0; i < ringParticlesCount; i++) {
    const radius = 2.1;
    const angle = (i / ringParticlesCount) * Math.PI * 2;
    const yOffset = Math.sin(angle * 3) * 0.3;
    ringPositions[i*3] = Math.cos(angle) * radius;
    ringPositions[i*3+1] = yOffset * 0.5;
    ringPositions[i*3+2] = Math.sin(angle) * radius;
}
ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
const ringMaterial = new THREE.PointsMaterial({ color: 0x7aa5ff, size: 0.045, transparent: true, blending: THREE.AdditiveBlending });
const ringPoints = new THREE.Points(ringGeometry, ringMaterial);
scene.add(ringPoints);

// Segundo anel externo (Dourado)
const outerRingCount = 1200;
const outerGeo = new THREE.BufferGeometry();
const outerPositions = new Float32Array(outerRingCount * 3);
for (let i = 0; i < outerRingCount; i++) {
    const radius = 2.9;
    const angle = (i / outerRingCount) * Math.PI * 2;
    outerPositions[i*3] = Math.cos(angle) * radius;
    outerPositions[i*3+1] = Math.cos(angle * 5) * 0.2;
    outerPositions[i*3+2] = Math.sin(angle) * radius;
}
outerGeo.setAttribute('position', new THREE.BufferAttribute(outerPositions, 3));
const outerMaterial = new THREE.PointsMaterial({ color: 0xffe484, size: 0.035, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
const outerPoints = new THREE.Points(outerGeo, outerMaterial);
scene.add(outerPoints);

// Campo de estrelas (Nebulosa)
const starCount = 1800;
const starGeo = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    const radius = 3.8 + Math.random() * 1.7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i*3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i*3+1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
    starPositions[i*3+2] = radius * Math.cos(phi);
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0x9f7aea, size: 0.025, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
const starField = new THREE.Points(starGeo, starMaterial);
scene.add(starField);

// Grid de Chão Futurista
const gridHelper = new THREE.GridHelper(20, 30, 0x4d82ff, 0x1a2035);
gridHelper.position.y = -2.2;
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.25;
scene.add(gridHelper);

// Instanciação Única de Cubos Decorativos (Otimização de GPU)
const floatingGroup = new THREE.Group();
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMat = new THREE.MeshStandardMaterial({ color: 0xffe484, emissive: 0x442200, emissiveIntensity: 0.2 });
for (let i = 0; i < 24; i++) {
    const scale = 0.08 + Math.random() * 0.07;
    const cube = new THREE.Mesh(cubeGeometry, cubeMat);
    cube.scale.set(scale, scale, scale);
    const radiusC = 2.2 + Math.random() * 1.2;
    const angleC = Math.random() * Math.PI * 2;
    cube.position.set(Math.cos(angleC) * radiusC, (Math.random() - 0.5) * 1.8, Math.sin(angleC) * radiusC);
    cube.castShadow = true;
    floatingGroup.add(cube);
}
scene.add(floatingGroup);

// Brilho volumétrico (Glow Points)
const glowGeo = new THREE.BufferGeometry();
const glowPositions = [];
for (let i = 0; i < 300; i++) {
    const angleGlow = Math.random() * Math.PI * 2;
    glowPositions.push(Math.cos(angleGlow) * 4.5, (Math.random() - 0.5) * 3, Math.sin(angleGlow) * 4.5);
}
glowGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(glowPositions), 3));
const glowPointsMat = new THREE.PointsMaterial({ color: 0xffaa88, size: 0.02, transparent: true, blending: THREE.AdditiveBlending });
const glowPoints = new THREE.Points(glowGeo, glowPointsMat);
scene.add(glowPoints);

// --- Loop de Renderização e Animação ---
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.012;
    
    torusKnot.rotation.x = Math.sin(time * 0.2) * 0.3;
    torusKnot.rotation.y = time * 0.45;
    torusKnot.rotation.z = Math.cos(time * 0.3) * 0.2;
    
    ringPoints.rotation.y = time * 0.2;
    ringPoints.rotation.x = Math.sin(time * 0.15) * 0.1;
    outerPoints.rotation.y = -time * 0.18;
    outerPoints.rotation.z = Math.sin(time * 0.2) * 0.05;
    
    starField.rotation.y = time * 0.03;
    starField.rotation.x = Math.sin(time * 0.07) * 0.1;
    floatingGroup.rotation.y = time * 0.1;
    glowPoints.rotation.y = time * 0.05;
    
    centerLight.intensity = 0.4 + Math.sin(time * 1.8) * 0.15;
    
    // Efeito Cinematográfico: Movimento orbital autônomo + Controle suave via Mouse (Paralaxe)
    const targetX = Math.sin(time * 0.05) * 0.5 + (mouse.x * 0.8);
    const targetY = 2.5 + Math.sin(time * 0.2) * 0.1 + (mouse.y * 0.5);
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 0.2, 0);
    
    // Transição de Matiz Metálica Harmônica (Azul Violeta)
    const hue = 0.55 + Math.sin(time * 0.2) * 0.05;
    materialKnot.color.setHSL(hue, 0.9, 0.55);
    materialKnot.emissiveIntensity = 0.35 + Math.sin(time * 1.2) * 0.1;
    
    renderer.render(scene, camera);
}
animate();

// --- Ajuste Fino de Responsividade ---
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

console.log('Site 3D EEEFM Estudo e Trabalho atualizado e rodando em alta performance!');
