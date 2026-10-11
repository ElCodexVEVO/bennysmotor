// Deriva las imágenes de fondo a partir de las dos originales de Halloween (generadas con ImageGen a partir de las
// fotografías del taller). Todo es recomposición del mismo material; no se genera contenido nuevo:
// Entrada: scripts/fuentes/bennys-acceso-fachada.webp (original, sin recomponer) y dist/assets/halloween/bennys-panel-interior.webp.
//  - bennys-acceso-panel.webp   fachada recompuesta para un panel CENTRADO: el tramo que quedaría tapado por el panel
//                               se sustituye por una zona desenfocada y la puerta, el neón BENNY’S y las calabazas pasan
//                               al lado derecho, visibles junto al panel (1440×900 y 1920×1080).
//  - bennys-acceso-movil.webp   versión vertical: neón arriba y calabazas abajo, con el centro desenfocado tras la tarjeta.
//  - bennys-panel-fondo.webp    interior del taller con un desenfoque suave y algo más oscuro, para el fondo del panel.
// Requiere Playwright y un Chromium (ver tests/cloud-browser.cjs). Uso: npm run backgrounds
import {readFileSync,writeFileSync,statSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/Mateo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const halloween=path.join(root,'dist/assets/halloween');
const facade=readFileSync(path.join(root,'scripts/fuentes/bennys-acceso-fachada.webp')).toString('base64');
const interior=readFileSync(path.join(halloween,'bennys-panel-interior.webp')).toString('base64');

const browser=await chromium.launch({executablePath:process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const page=await browser.newPage();await page.setContent('<body></body>');
const results=await page.evaluate(async({facade,interior})=>{
  const load=async b64=>{const image=new Image();image.src='data:image/webp;base64,'+b64;await image.decode();return image;};
  const make=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')];};
  // Dibuja `source` en (dx,dy) con un borde difuminado (alfa en degradado) por los lados indicados.
  const feather=(target,source,sx,sy,sw,sh,dx,dy,dw,dh,{left=0,right=0,top=0,bottom=0}={},blur=0)=>{
    const [layer,g]=make(dw,dh);if(blur)g.filter=`blur(${blur}px)`;g.drawImage(source,sx,sy,sw,sh,0,0,dw,dh);g.filter='none';
    g.globalCompositeOperation='destination-in';
    const mask=(x0,y0,x1,y1,stops)=>{const gr=g.createLinearGradient(x0,y0,x1,y1);for(const [o,a] of stops)gr.addColorStop(o,`rgba(0,0,0,${a})`);g.fillStyle=gr;g.fillRect(0,0,dw,dh);};
    if(left)mask(0,0,left,0,[[0,0],[1,1]]);
    if(right)mask(dw,0,dw-right,0,[[0,0],[1,1]]);
    if(top)mask(0,0,0,top,[[0,0],[1,1]]);
    if(bottom)mask(0,dh,0,dh-bottom,[[0,0],[1,1]]);
    target.drawImage(layer,dx,dy);
  };
  const facadeImage=await load(facade),interiorImage=await load(interior);
  const out={};

  // 1) Fachada recompuesta para panel centrado (1672×941 → 2063×941)
  {
    const W=2063,H=941,[canvas,g]=make(W,H);
    g.drawImage(facadeImage,0,0,554,H,0,0,554,H);                                   // izquierda: coche y grafitis
    feather(g,facadeImage,470,0,100,H,500,0,500,H,{left:70,right:70},22);          // zona tras el panel: tramo del mural desenfocado
    feather(g,facadeImage,560,0,1112,H,951,0,1112,H,{left:90});                    // derecha: pilar, calabazas, puerta, neón, ruedas
    // pequeña viñeta de unión para que ninguna costura se lea
    out.panel=canvas.toDataURL('image/webp',0.84);
  }

  // 2) Versión vertical para móvil (700×1515)
  {
    const W=700,H=1515,[canvas,g]=make(W,H);
    // fondo: la fachada entera, muy desenfocada y estirada
    g.filter='blur(26px) brightness(.85)';g.drawImage(facadeImage,380,120,700,820,-40,-40,W+80,H+80);g.filter='none';
    // arriba: neón BENNY’S y telarañas
    feather(g,facadeImage,590,212,420,200,0,0,W,333,{bottom:80});
    // abajo: calabazas y suelo mojado
    feather(g,facadeImage,540,600,440,200,0,H-333,W,333,{top:100});
    out.movil=canvas.toDataURL('image/webp',0.84);
  }

  // 3) Fondo del panel: interior del taller, desenfoque suave y algo más oscuro
  {
    const W=1600,H=900,[canvas,g]=make(W,H);
    g.filter='blur(5px) saturate(1.12) brightness(.82)';g.drawImage(interiorImage,-30,-30,W+60,H+60);
    out.fondo=canvas.toDataURL('image/webp',0.78);
  }
  return out;
},{facade,interior});

const save=(name,dataUrl)=>{const file=path.join(halloween,name);writeFileSync(file,Buffer.from(dataUrl.split(',')[1],'base64'));console.log(path.relative(root,file),Math.round(statSync(file).size/1024)+' KB');};
save('bennys-acceso-panel.webp',results.panel);
save('bennys-acceso-movil.webp',results.movil);
save('bennys-panel-fondo.webp',results.fondo);
await browser.close();
