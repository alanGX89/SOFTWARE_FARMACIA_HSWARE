/**
 * Convierte banner_precios.html en una imagen PNG de alta resolución
 * Uso: node exportar_banner.js
 */

const puppeteer = require('puppeteer');
const path      = require('path');

(async () => {
  console.log('Abriendo navegador...');

  const browser = await puppeteer.launch({ headless: 'new' });
  const page    = await browser.newPage();

  // Escala x2 = resolución Retina / pantalla HD
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  const file = path.resolve(__dirname, 'banner_precios.html');
  await page.goto(`file:///${file}`, { waitUntil: 'networkidle0', timeout: 15000 });

  // Esperar que el QR se genere
  await new Promise(r => setTimeout(r, 1500));

  // Capturar la página completa
  await page.screenshot({
    path: path.resolve(__dirname, 'banner_precios.png'),
    fullPage: true,
    type: 'png',
  });

  await browser.close();

  console.log('');
  console.log('Imagen generada: banner_precios.png');
  console.log('Resolución: 1280px x 2 = 2560px de ancho — lista para LinkedIn y WhatsApp');
})();
