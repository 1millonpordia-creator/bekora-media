// Escenes de les històries animades. Cada entrada = array de funcions (una per segment de cfg.js).
// Cada funció rep (lt = temps dins l'escena, du = durada, t = temps global) i retorna {svg, z, rot, shake, cy, capTop}.
window.TOON = window.TOON || {};

// ===== t1 · Pastisseria de la Marta (ganxo: "la millor... i ningú ho sap") =====
(function(){
const MARTA = {skin:'#F2C9A5', shirt:'#FF8FB1', apron:'#FFFFFF', pants:'#6D4C7D'};
const marta = (o)=>H.person(Object.assign({}, MARTA, {hair:H.hairBun('#6B3E26')}, o));
const CLIENT = {skin:'#C68B59', shirt:'#4DA3FF', pants:'#2D3142'};
const client = (o)=>H.person(Object.assign({}, CLIENT, {hair:H.hairShort('#2B2B2B')}, o));
const cake = `<g transform="translate(0,150)"><rect x="-55" y="-60" width="110" height="60" rx="10" fill="#FFF1D6" stroke="#16171B" stroke-width="5"/><rect x="-55" y="-75" width="110" height="20" rx="10" fill="#FF8FB1" stroke="#16171B" stroke-width="5"/><circle cx="0" cy="-88" r="12" fill="#E8574A"/></g>`;
const name = ()=>H.T({es:'La de Marta', ca:'Ca la Marta'});
const shopM = (extra='')=>H.shop({x:90,y:420,w:900,h:960,wall:'#FFE1EA',awning:'#FF8FB1',name:H.T({es:'PASTELERÍA',ca:'PASTISSERIA'}),fs:60,inside:extra});
TOON.t1 = [
 // 0 · ganxo
 (lt,du)=>{const cut=du*0.55, after=lt>cut;
  const bg = after ? '#FFE3E0' : '#FFF6EC';
  return {svg:`<rect width="1080" height="1920" fill="${bg}"/>${H.ground('#F0D9C4')}${shopM()}
   ${marta({x:540,y:1450,s:1.05,t:lt,expr:after?'shock':'happy',mouth:after?'shock':(lt<cut?'talk':'big'),armR:-40,hold:cake})}
   ${after?'':H.sticker(540,300,H.T({es:'LA MEJOR DEL BARRIO',ca:'LA MILLOR DEL BARRI'}),'#FFD23F','#16171B',H.P(lt,.15,.5),-4,52)}
   ${after?H.sticker(540,300,H.T({es:'0 CLIENTES',ca:'0 CLIENTS'}),'#E8574A','#fff',H.P(lt,cut,cut+.3),5,70):''}`,
   z:after?1.12:1, shake:after&&lt<cut+.25?14:0, cy:900}},
 // 1 · busca al mòbil
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#EAF4FF"/>
   ${client({x:300,y:1450,s:.95,t:lt,expr:'neutral',mouth:'flat',look:1,armR:-110})}
   ${H.phone({x:720,y:760,s:1.15,r:4,screen:H.search(H.T({es:'pastelería cerca',ca:'pastisseria a prop'}),[
     {n:'Dulces Rosa',d:'★ 4,8 · Web',c:'#FFB3C7'},{n:'Horno Sol',d:'★ 4,6 · Web',c:'#FFD9A0'},
     {n:name(),d:H.T({es:'No aparece',ca:'No hi surt'}),c:'#E5E2DC',me:1}],lt)})}`, cy:800}),
 // 2 · se'n van al del davant
 (lt,du)=>{const k=H.io(H.P(lt,.2,du-.3));
  return {svg:`<rect width="1080" height="1920" fill="#F4F1EA"/>${H.ground('#DCD3C3',1300)}
   <g transform="translate(-20,640) scale(.5)">${shopM()}</g>
   <g transform="translate(560,640) scale(.5)">${H.shop({x:90,y:420,w:900,h:960,wall:'#FFF3D6',awning:'#F5B700',name:'HORNO SOL',fs:64})}</g>
   ${marta({x:200,y:1340,s:.55,t:lt,expr:'sad',mouth:'sad'})}
   ${client({x:H.lerp(180,860,k),y:1330,s:.55,t:lt,walk:true,expr:'happy',mouth:'smile',look:1})}
   ${H.tumble(H.lerp(-80,620,H.P(lt,.6,du)),1300,lt)}
   ${H.sticker(300,820,H.T({es:'VACÍA',ca:'BUIDA'}),'#fff','#16171B',H.P(lt,.8,1.1),-6,54)}`, z:1.2, cy:1050}},
 // 3 · fulletons (fail)
 (lt,du)=>{const fl=Array.from({length:9},(_,i)=>{const k=H.P(lt,.5+i*.06,du);const x=560+i*40+k*700*(i%2?1:.7),y=900-k*900+i*20;return `<rect x="${x}" y="${y}" width="90" height="120" rx="8" fill="#fff" stroke="#16171B" stroke-width="5" transform="rotate(${k*540+i*30} ${x+45} ${y+60})"/>`}).join('');
  const wind=Array.from({length:6},(_,i)=>`<path d="M${(lt*900+i*230)%1300-200} ${600+i*90} q80 -30 160 0" stroke="#9CC3FF" stroke-width="8" fill="none" stroke-linecap="round"/>`).join('');
  return {svg:`<rect width="1080" height="1920" fill="#EEF6F1"/>${H.ground('#CFE3D6',1380)}${wind}
   ${marta({x:440,y:1450,s:1,t:lt,expr:lt>.7?'shock':'happy',mouth:lt>.7?'shock':'smile',armR:-150,lean:lt>.7?-6:0})}${fl}
   ${H.sticker(540,330,'PLAN B',"#4DA3FF",'#fff',H.P(lt,0,.3),-5,64)}
   ${lt>1.2?H.sticker(800,520,'FAIL','#E8574A','#fff',H.P(lt,1.2,1.5),10,70):''}`, shake:lt>.7&&lt<1?10:0}},
 // 4 · punt crític: Bekora
 (lt,du)=>{const web=H.P(lt,1.4,2.2);
  return {svg:`<rect width="1080" height="1920" fill="#16171B"/>
   <g opacity=".08">${Array.from({length:12},(_,i)=>`<circle cx="540" cy="760" r="${(i*90+lt*160)%1100}" fill="none" stroke="#5EE08F" stroke-width="10"/>`).join('')}</g>
   ${H.badge(540,330,H.P(lt,.1,.5))}
   ${H.phone({x:540,y:900,s:1.05*H.sp(H.P(lt,1.1,1.6)),screen:`<rect x="-150" y="-300" width="300" height="190" fill="#FFB3C7"/><text x="0" y="-190" text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="34" fill="#16171B">${name()}</text>
     ${[H.T({es:'Pasteles',ca:'Pastissos'}),H.T({es:'Horario',ca:'Horari'}),H.T({es:'Encargos',ca:'Encàrrecs'})].map((x,i)=>web>i*.3?`<rect x="-125" y="${-80+i*95}" width="250" height="75" rx="16" fill="#F6F6F6"/><text x="-100" y="${-32+i*95}" font-family="Inst" font-weight="700" font-size="30" fill="#16171B">${x}</text>`:'').join('')}
     ${web>.95?`<rect x="-125" y="210" width="250" height="64" rx="32" fill="#25A35A"/><text x="0" y="252" text-anchor="middle" font-family="Inst" font-weight="700" font-size="28" fill="#fff">WhatsApp</text>`:''}`})}
   ${marta({x:870,y:1420,s:.6,t:lt,expr:'happy',mouth:'big',armL:150,armR:-150})}`, capTop:1480}},
 // 5 · cua
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#FFF6EC"/>${H.ground('#F0D9C4')}<g transform="translate(-140,0)">${shopM()}</g>
   ${marta({x:200,y:1400,s:.62,t:lt,expr:'happy',mouth:'big',armL:150,armR:-150})}
   ${[['#4DA3FF','#C68B59'],['#5EE08F','#F2C9A5'],['#FFD23F','#8D5A3B'],['#B48CFF','#E8B894'],['#FF6B6B','#F2C9A5']].map((c,i)=>H.person({x:440+i*150,y:1460,s:.5,t:lt+i,shirt:c[0],skin:c[1],hair:i%2?H.hairLong('#3B2A20'):H.hairShort('#1E1E1E'),expr:'happy',mouth:'smile',look:-1})).join('')}
   ${H.confetti(lt)}${H.sticker(560,300,H.T({es:'COLA HASTA LA ESQUINA',ca:'CUA FINS A LA CANTONADA'}),'#5EE08F','#16171B',H.P(lt,.2,.5),-4,44)}`}),
 // 6 · final
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#FFD23F"/>
   ${marta({x:540,y:1350,s:.9,t:lt,expr:'happy',mouth:'talk',armR:-60})}
   <g transform="translate(540,330) scale(${H.sp(H.P(lt,.1,.5))})"><text text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="76" fill="#16171B"><tspan x="0" y="0">${H.T({es:'¿Y tu negocio,',ca:'I el teu negoci,'})}</tspan><tspan x="0" y="92">${H.T({es:'sale en Google?',ca:'surt a Google?'})}</tspan></text></g>
   <g transform="translate(540,1520) scale(${H.sp(H.P(lt,.5,.9))})"><rect x="-230" y="-60" width="460" height="120" rx="60" fill="#16171B"/><text y="22" text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="58" fill="#fff">bekora.es</text></g>`, capTop:1650})
];
})();
