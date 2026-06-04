// Carga y réplica del collage de referencia usando módulos PNG de manchas y trazos.
// Autor: Antigravity

let manchas = [];
let trazos = [];
let manchaBlanca;
let growthY = -120; // Altura del frente de crecimiento procedural
let growthWhiteY = 800; // Frente de crecimiento de los elementos blancos
let isAnimatingB = false; // Estado de la animación B
let activeKeys = new Set();
let sketchSeed;

// Paleta cromática enriquecida sin blanco puro para evitar elementos invisibles
const PALETTE_HEX = [
  '#151515', // Negro Profundo
  '#8B0024', // Carmesí / Borgoña
  '#D61C2A', // Rojo Brillante
  '#1F4096', // Azul Eléctrico
  '#00A3C4', // Turquesa / Cian
  '#8BBCE5', // Celeste Pastel
  '#5B2C84', // Violeta / Púrpura
  '#24B14C', // Verde Vibrante
  '#FED300', // Amarillo Sol
  '#F7941D', // Naranja Enérgico
  '#E52E71'  // Rosado Chicle
];

function preload() {
  // Carga de módulos PNG
  for (let i = 0; i < 4; i++) {
    const img = loadImage(`mancha0${i}.png`, loaded => {
      preprocessImage(loaded);
    });
    manchas.push(img);
  }
  // Carga de la mancha blanca para la parte superior
  manchaBlanca = loadImage('mancha04.png', loaded => {
    preprocessImage(loaded);
  });
  for (let i = 0; i <= 12; i++) {
    const img = loadImage(`trazo${i.toString().padStart(2, '0')}.png`, loaded => {
      preprocessImage(loaded);
    });
    trazos.push(img);
  }
}

function setup() {
  // Lienzo estático de 800x800 píxeles
  const canvas = createCanvas(800, 800);
  canvas.parent('canvas-container');
  noLoop();
  sketchSeed = floor(random(10000));
}

function draw() {
  if (keyIsPressed) {
    if (keyIsDown(65)) { // Tecla A
      growthY -= 2.5; // Velocidad del frente de avance
      if (growthY < -120) {
        growthY = -120; // Límite superior
      }
    }
    if (keyIsDown(66)) { // Tecla B
      growthWhiteY += 2.5; // Velocidad del frente de avance de blancos
      if (growthWhiteY > 800) {
        growthWhiteY = 800; // Límite inferior
      }
    }
  }
  drawComposition();
}

function drawComposition() {
  randomSeed(sketchSeed);
  background(255);

  const graffitiLimitY = -100;
  const smallSpotColors = ['#151515', '#8B0024', '#D61C2A', '#1F4096', '#00A3C4', '#24B14C', '#FED300', '#F7941D', '#E52E71'];
  const bigStrokeColors = ['#D61C2A', '#1F4096', '#00A3C4', '#24B14C', '#FED300', '#F7941D', '#E52E71', '#8BBCE5', '#151515', '#FFFFFF'];
  const overlayColors = ['#151515', '#FFFFFF', '#D61C2A', '#00A3C4', '#E52E71'];

  // ── Manchas muy pequeñas y puntuales ──
  for (let i = 0; i < 140; i++) {
    const x = random(0, width);
    const y = random(graffitiLimitY, height);
    const img = random(manchas);
    const safeScale = getSafeScale(img, y, graffitiLimitY);
    const scaleFactor = random(0.02, min(0.06, safeScale));
    if (y > growthY && (y >= 240 || y < growthWhiteY)) {
      placeModuleDirect(img, x, y, scaleFactor, random(-PI / 10, PI / 10), random(180, 230), random(smallSpotColors));
    }
  }

  // ── Trazos grandes base ──
  for (let i = 0; i < 250; i++) {
    const x = random(-120, width + 120);
    const y = random(graffitiLimitY, height + 120);
    const img = random(trazos);
    const safeScale = getSafeScale(img, y, graffitiLimitY);
    const scaleFactor = random(0.34, min(0.60, safeScale));
    if (y > growthY && (y >= 240 || y < growthWhiteY)) {
      placeModuleDirect(img, x, y, scaleFactor, random(-PI / 8, PI / 8), random(210, 255), random(bigStrokeColors));
    }
  }

  // ── Trazos superpuestos densos ──
  for (let i = 0; i < 240; i++) {
    const x = random(-140, width + 140);
    const y = random(graffitiLimitY, height + 140);
    const img = random(trazos);
    const safeScale = getSafeScale(img, y, graffitiLimitY);
    const scaleFactor = random(0.30, min(0.55, safeScale));
    if (y > growthY && (y >= 240 || y < growthWhiteY)) {
      placeModuleDirect(img, x, y, scaleFactor, random(-PI / 6, PI / 6), random(200, 255), random(bigStrokeColors));
    }
  }

  // ── Capas de contraste y trazos estructurales ──
  for (let i = 0; i < 130; i++) {
    const x = random(-100, width + 100);
    const y = random(graffitiLimitY, height + 100);
    const img = random(trazos);
    const safeScale = getSafeScale(img, y, graffitiLimitY);
    const scaleFactor = random(0.22, min(0.48, safeScale));
    if (y > growthY && (y >= 240 || y < growthWhiteY)) {
      placeModuleDirect(img, x, y, scaleFactor, random(-PI / 5, PI / 5), random(215, 255), random(overlayColors));
    }
  }

  // ── Manchas pequeñas finales encima de todo ──
  for (let i = 0; i < 90; i++) {
    const x = random(0, width);
    const y = random(graffitiLimitY, height);
    const img = random(manchas);
    const safeScale = getSafeScale(img, y, graffitiLimitY);
    const scaleFactor = random(0.02, min(0.06, safeScale));
    if (y > growthY && (y >= 240 || y < growthWhiteY)) {
      placeModuleDirect(img, x, y, scaleFactor, random(-PI / 8, PI / 8), random(190, 240), random(smallSpotColors));
    }
  }

  // ── Capa superior de manchas blancas (`mancha04.png`) ──
  // Dibuja manchas blancas para tapar orgánicamente el graffiti de arriba, imitando la referencia
  for (let i = 0; i < 75; i++) {
    const x = random(-80, width + 80);
    const y = random(-120, 160);
    const scaleFactor = random(0.35, 0.75);
    if (y < growthWhiteY) {
      placeModuleDirect(manchaBlanca, x, y, scaleFactor, random(-PI, PI), random(230, 255), '#FFFFFF');
    }
  }

  // ── Crecimiento Procedural por encima de las manchas blancas ──
  // Si el frente de crecimiento (growthY) ha entrado en la zona superior,
  // re-dibujamos los elementos del grafiti original que caen en la zona revelada (y > growthY)
  // por encima de las manchas blancas para que queden al frente, simulando que "se comen" el blanco.
  if (growthY < 220) {
    randomSeed(sketchSeed); // Reiniciamos la semilla para reproducir la misma posición y color exactos

    // 1. Manchas muy pequeñas y puntuales
    for (let i = 0; i < 140; i++) {
      const x = random(0, width);
      const y = random(graffitiLimitY, height);
      const img = random(manchas);
      const safeScale = getSafeScale(img, y, graffitiLimitY);
      const scaleFactor = random(0.02, min(0.06, safeScale));
      const angle = random(-PI / 10, PI / 10);
      const alpha = random(180, 230);
      const col = random(smallSpotColors);
      if (y < 220 && y > growthY && y < growthWhiteY) {
        placeModuleDirect(img, x, y, scaleFactor, angle, alpha, col);
      }
    }

    // 2. Trazos grandes base
    for (let i = 0; i < 250; i++) {
      const x = random(-120, width + 120);
      const y = random(graffitiLimitY, height + 120);
      const img = random(trazos);
      const safeScale = getSafeScale(img, y, graffitiLimitY);
      const scaleFactor = random(0.34, min(0.60, safeScale));
      const angle = random(-PI / 8, PI / 8);
      const alpha = random(210, 255);
      const col = random(bigStrokeColors);
      if (y < 220 && y > growthY && y < growthWhiteY) {
        placeModuleDirect(img, x, y, scaleFactor, angle, alpha, col);
      }
    }

    // 3. Trazos superpuestos densos
    for (let i = 0; i < 240; i++) {
      const x = random(-140, width + 140);
      const y = random(graffitiLimitY, height + 140);
      const img = random(trazos);
      const safeScale = getSafeScale(img, y, graffitiLimitY);
      const scaleFactor = random(0.30, min(0.55, safeScale));
      const angle = random(-PI / 6, PI / 6);
      const alpha = random(200, 255);
      const col = random(bigStrokeColors);
      if (y < 220 && y > growthY && y < growthWhiteY) {
        placeModuleDirect(img, x, y, scaleFactor, angle, alpha, col);
      }
    }

    // 4. Capas de contraste y trazos estructurales
    for (let i = 0; i < 130; i++) {
      const x = random(-100, width + 100);
      const y = random(graffitiLimitY, height + 100);
      const img = random(trazos);
      const safeScale = getSafeScale(img, y, graffitiLimitY);
      const scaleFactor = random(0.22, min(0.48, safeScale));
      const angle = random(-PI / 5, PI / 5);
      const alpha = random(215, 255);
      const col = random(overlayColors);
      if (y < 220 && y > growthY && y < growthWhiteY) {
        placeModuleDirect(img, x, y, scaleFactor, angle, alpha, col);
      }
    }

    // 5. Manchas pequeñas finales encima de todo
    for (let i = 0; i < 90; i++) {
      const x = random(0, width);
      const y = random(graffitiLimitY, height);
      const img = random(manchas);
      const safeScale = getSafeScale(img, y, graffitiLimitY);
      const scaleFactor = random(0.02, min(0.06, safeScale));
      const angle = random(-PI / 8, PI / 8);
      const alpha = random(190, 240);
      const col = random(smallSpotColors);
      if (y < 220 && y > growthY && y < growthWhiteY) {
        placeModuleDirect(img, x, y, scaleFactor, angle, alpha, col);
      }
    }
  }
}

/**
 * Coloca un módulo de imagen aplicando tintado, escala y rotación.
 */
function placeModuleDirect(img, posX, posY, scaleFactor, angle, alpha, tintColor) {
  push();
  translate(posX, posY);
  rotate(angle);

  let activeImg = img;
  let activeTintColor = tintColor;

  // En el 30% superior del lienzo (posY < 240), o si la animación B está activa y el elemento está por encima del frente, forzar a color blanco
  if (posY < 240 || (isAnimatingB && posY < growthWhiteY)) {
    activeImg = img.whiteVersion || img;
    activeTintColor = '#FFFFFF';
  }

  const scaleAdjustment = (activeImg.originalWidth || activeImg.width) / activeImg.width;
  scale(scaleFactor * scaleAdjustment * 0.7); // Reducir un 30% el tamaño

  if (activeTintColor) {
    const c = color(activeTintColor);
    c.setAlpha(alpha);
    tint(c);
  } else {
    noTint();
  }

  imageMode(CENTER);
  image(activeImg, 0, 0);
  pop();
}

/**
 * Calcula la escala máxima para garantizar que la imagen nunca supere el límite vertical (yLimit).
 * Usa la diagonal de la imagen para asegurar que se cumpla bajo cualquier rotación.
 */
function getSafeScale(img, posY = null, yLimit = null) {
  const w = img.originalWidth || img.width;
  const h = img.originalHeight || img.height;
  const diag = sqrt(w * w + h * h);
  if (posY !== null && yLimit !== null) {
    if (posY <= yLimit) return 0.001; // si ya está arriba del límite, escala mínima
    return (2 * (posY - yLimit)) / diag;
  }
  return min(0.75, width / diag);
}

function preprocessImage(img) {
  img.originalWidth = img.width;
  img.originalHeight = img.height;

  const targetWidth = img.width > 500 ? 500 : (img.width > 300 ? 300 : img.width);
  if (img.width > targetWidth) {
    img.resize(targetWidth, 0);
  }

  removeBlackBackground(img);
  img.whiteVersion = createWhiteImg(img);
}

function createWhiteImg(img) {
  let whiteImg = createImage(img.width, img.height);
  whiteImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  whiteImg.loadPixels();
  const pixels = whiteImg.pixels;
  const len = pixels.length;
  for (let i = 0; i < len; i += 4) {
    if (pixels[i + 3] > 0) {
      pixels[i] = 255;
      pixels[i + 1] = 255;
      pixels[i + 2] = 255;
    }
  }
  whiteImg.updatePixels();
  whiteImg.originalWidth = img.originalWidth;
  whiteImg.originalHeight = img.originalHeight;
  return whiteImg;
}

function removeBlackBackground(img) {
  img.loadPixels();
  const pixels = img.pixels;
  const len = pixels.length;
  const threshold = 90;
  const range = 255 - threshold;

  for (let i = 0; i < len; i += 4) {
    const alpha = pixels[i + 3];
    if (alpha === 0) continue;

    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const brightness = (r + g + b) / 3;

    if (brightness < threshold) {
      pixels[i + 3] = 0;
    } else {
      let opacity = 100 + ((brightness - threshold) * 155) / range;
      if (opacity < 100) opacity = 100;
      else if (opacity > 255) opacity = 255;
      pixels[i + 3] = opacity;
    }
  }
  img.updatePixels();
}

function windowResized() {
  // Sin redimensionamiento dinámico interno para preservar la fidelidad matemática de las escalas
}

function keyPressed() {
  const k = key.toLowerCase();
  if (k === 'b') {
    isAnimatingB = true; // Primer paso al presionar B
  }
  if (k === 'a' || k === 'b') {
    activeKeys.add(k);
    if (k === 'a') {
      isAnimatingB = false;
      growthWhiteY = 800; // Reset B animation
      if (growthY === -120) {
        growthY = 800;
      }
    }
    if (k === 'b') {
      if (growthWhiteY === 800) {
        growthWhiteY = -120;
      }
    }
    loop(); // Inicia la animación continua al presionar A o B
  }
}

function keyReleased() {
  const k = key.toLowerCase();
  if (k === 'a' || k === 'b') {
    activeKeys.delete(k);
    if (activeKeys.size === 0) {
      noLoop(); // Pausa la animación si no hay teclas activas
    }
  }
}

// Eventos globales del navegador para asegurar respuesta instantánea
window.addEventListener('keydown', function (e) {
  const k = e.key.toLowerCase();
  if (k === 'b') {
    isAnimatingB = true; // Primer paso al presionar B
  }
  if (k === 'a' || k === 'b') {
    activeKeys.add(k);
    if (!e.repeat) {
      if (k === 'a') {
        isAnimatingB = false;
        growthWhiteY = 800; // Reset B
        if (growthY === -120) {
          growthY = 800;
        }
      }
      if (k === 'b') {
        if (growthWhiteY === 800) {
          growthWhiteY = -120;
        }
      }
    }
    loop();
  }
});

window.addEventListener('keyup', function (e) {
  const k = e.key.toLowerCase();
  if (k === 'a' || k === 'b') {
    activeKeys.delete(k);
    if (activeKeys.size === 0) {
      noLoop();
    }
  }
});
