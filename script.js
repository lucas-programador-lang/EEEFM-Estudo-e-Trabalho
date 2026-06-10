import * as THREE from 'three';

// --- Setup da cena 3D profissional e animada ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050b1a);
scene.fog = new THREE.FogExp2(0x050b1a, 0.008); // neblina sutil

// Câmera perspectiva com campo de visão dinâmico
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 3, 8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limita a 2 para evitar travamentos em telas Retina/4K
renderer.shadowMap.enabled = true; // ativa sombras para dar profundidade
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// --- Interatividade (Mouse Track) ---
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    // Transforma as coordenadas do mouse em valores de -1 a 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// --- Luzes ---
// Luz ambiente suave
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);

// Luz principal direcional
const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
mainLight.position.set(5, 10, 4);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

// Luz de preenchimento quente traseira
const backLight = new THREE.PointLight(0xffaa66, 0.6);
backLight.position.set(-2, 2, -4);
scene.add(backLight);

// Luz lateral azulada para dar contraste
const fillLight = new THREE.PointLight(0x6688ff, 0.5);
fillLight.position.set(3, 1, 2);
scene.add(fillLight);

// Um pequeno brilho no centro
const centerLight = new THREE.PointLight(0xffaa88, 0.4);
centerLight.position.set(0, 1, 0);
scene.add(centerLight);

// --- Objeto principal: Torus Knot com efeito metálico e rotação ---
const knotGeometry = new THREE.TorusKnotGeometry(1.1, 0.28, 200, 32, 3, 4);
const materialKnot = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    emissive: 0x1e3a8a,
    emissiveIntensity: 0.4,
    metalness: 0.85,
    roughness: 0.25,
    flatShading: false
});
const torusKnot = new THREE.Mesh(knotGeometry, materialKnot);
torusKnot.castShadow = true;
torusKnot.receiveShadow = false;
scene.add(torusKnot);

// Anéis orbitantes (partículas em anel)
const ringParticlesCount = 800;
const ringGeometry = new THREE.BufferGeometry();
const ringPositions = new Float32Array(ringParticlesCount * 3);
for (let i = 0; i < ringParticlesCount; i++) {
    const radius = 2.1;
    const angle = (i / ringParticlesCount) * Math.PI * 2;
    const yOffset = Math.sin(angle * 3) * 0.3;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    ringPositions[i*3] = x;
    ringPositions[i*3+1] = yOffset * 0.5;
    ringPositions[i*3+2] = z;
}
ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
const ringMaterial = new THREE.PointsMaterial({
    color: 0x5dade2,
    size: 0.045,
    transparent: true,
    blending: THREE.AdditiveBlending
});
const ringPoints = new THREE.Points(ringGeometry, ringMaterial);
scene.add(ringPoints);

// Segundo anel mais externo com partículas douradas
const outerRingCount = 1200;
const outerGeo = new THREE.BufferGeometry();
const outerPositions = new Float32Array(outerRingCount * 3);
for (let i = 0; i < outerRingCount; i++) {
    const radius = 2.9;
    const angle = (i / outerRingCount) * Math.PI * 2;
    const yFluctuation = Math.cos(angle * 5) * 0.2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    outerPositions[i*3] = x;
    outerPositions[i*3+1] = yFluctuation;
    outerPositions[i*3+2] = z;
}
outerGeo.setAttribute('position', new THREE.BufferAttribute(outerPositions, 3));
const outerMaterial = new THREE.PointsMaterial({
    color: 0xffaa55,
    size: 0.035,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
});
const outerPoints = new THREE.Points(outerGeo, outerMaterial);
scene.add(outerPoints);

// Esfera de partículas flutuantes (estilo nebulosa)
const starCount = 1800;
const starGeo = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    const radius = 3.8 + Math.random() * 1.7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
    const z = radius * Math.cos(phi);
    starPositions[i*3] = x;
    starPositions[i*3+1] = y;
    starPositions[i*3+2] = z;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({
    color: 0x88aaff,
    size: 0.025,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
});
const starField = new THREE.Points(starGeo, starMaterial);
scene.add(starField);

// Plano de fundo com grid elegante (chão imaginário)
const gridHelper = new THREE.GridHelper(20, 30, 0x88aaff, 0x335588);
gridHelper.position.y = -2.2;
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.25;
scene.add(gridHelper);

// Pequenos cubos flutuantes decorativos (Otimizados compartilhando Geometria e Material)
const floatingGroup = new THREE.Group();
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMat = new THREE.MeshStandardMaterial({ color: 0xffaa55, emissive: 0x442200, emissiveIntensity: 0.2 });

for (let i = 0; i < 24; i++) {
    const scale = 0.08 + Math.random() * 0.07;
    const cube = new THREE.Mesh(cubeGeometry, cubeMat);
    cube.scale.set(scale, scale, scale); // Altera o tamanho individual via escala
    
    const radiusC = 2.2 + Math.random() * 1.2;
    const angleC = Math.random() * Math.PI * 2;
    const yOff = (Math.random() - 0.5) * 1.8;
    
    cube.position.x = Math.cos(angleC) * radiusC;
    cube.position.z = Math.sin(angleC) * radiusC;
    cube.position.y = yOff;
    cube.castShadow = true;
    floatingGroup.add(cube);
}
scene.add(floatingGroup);

// Adicionar alguns raios de luz
const glowGeo = new THREE.BufferGeometry();
const
