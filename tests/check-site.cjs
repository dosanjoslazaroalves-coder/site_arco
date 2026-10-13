const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'IDs duplicados');
const checked=new Set();
function checkFile(relative,base=root){
  if(!relative||/^(https?:|data:|blob:|mailto:)/.test(relative))return;
  if(relative.startsWith('#')){assert.ok(ids.includes(relative.slice(1)),`Âncora ausente: ${relative}`);return;}
  const resolved=path.resolve(base,decodeURI(relative.split(/[?#]/)[0]));
  assert.ok(fs.existsSync(resolved),`Arquivo ausente: ${resolved}`);checked.add(path.relative(root,resolved));
}
for(const m of html.matchAll(/(?:src|href|poster|data-lightbox)="([^"]+)"/g))checkFile(m[1]);
const css=fs.readFileSync(path.join(root,'css/style.css'),'utf8');
assert.ok(!html.includes('class="door-world"'),'A abertura ainda inclui a camada de cenário antigo');
assert.ok(!css.includes('.door-world'),'O CSS ainda referencia o cenário antigo da abertura');
assert.doesNotMatch(html,/<(?:img|video|source)\b[^>]*(?:src|poster)="https?:/i,'A página ainda referencia mídia externa');
assert.match(html,/family=Cinzel:wght@400;500;600&amp;family=DM\+Sans:wght@400;500;600/,'Google Fonts Cinzel e DM Sans não configuradas');
assert.match(css,/--font-title:'Cinzel'/,'Variável tipográfica de títulos ausente');
assert.match(css,/--font-body:'DM Sans'/,'Variável tipográfica de corpo ausente');
assert.equal((html.match(/<video\b/g)||[]).length,1,'A página deve carregar um único vídeo de apresentação');
assert.match(html,/id="videos"[\s\S]*?assets\/videos\/doce-multiverso-tour-01\.mp4/,'Vídeo geral não integrado antes dos parques');
assert.ok(html.indexOf('id="videos"')<html.indexOf('id="projetos"'),'A seção de vídeo precisa aparecer antes dos parques');
assert.ok(!html.includes('doce-multiverso-tour-02.mp4'),'A cópia duplicada do vídeo ainda está referenciada');
assert.ok(!html.includes('video-poster.webp'),'O pôster descartado do quiosque antigo ainda está referenciado');
for(const image of ['cabine-fotografica-pacoca.webp','pista-corrida-pacoca.webp','torre-amor-pacoca.webp','quiosque-alimentos-pacoca.webp','revele-7belo.webp','magic-mirror-dance-7belo.webp','snowboard-poosh.webp']){
  assert.ok(html.includes(`assets/images/${image}`),`Imagem de atração não integrada: ${image}`);
}
assert.match(css,/\.attraction-row\{[^}]*grid-template-columns:/,'Layout de atrações em duas colunas ausente');
assert.match(css,/@media\(max-width:820px\)[\s\S]*?\.attraction-row\{grid-template-columns:1fr/,'Layout móvel de atrações em uma coluna ausente');
assert.doesNotMatch(css,/\.attraction-media img\{[^}]*object-fit:cover/,'Imagens das atrações ainda podem ser cortadas');
for(const m of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))checkFile(m[1],path.join(root,'css'));
const scripts=['js/main.js','js/navigation.js','js/viewer3d.js','js/camera-constraints.mjs'];
for(const file of scripts){
  const absolute=path.join(root,file);execFileSync(process.execPath,['--check',absolute]);
  const source=fs.readFileSync(absolute,'utf8');
  for(const m of source.matchAll(/(?:from\s*|import\(|new URL\()\s*['"]([^'"]+)['"]/g)){if(m[1]!=='three')checkFile(m[1],path.dirname(absolute));}
}
const report={passed:true,ids:ids.length,localAssets:checked.size,syntaxChecked:scripts,missingAssets:[],timestamp:new Date().toISOString()};
fs.writeFileSync(path.join(__dirname,'static-checks.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
