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

// ===== utilitats compartides per a t2..t5 =====
H.bubble=(x,y,txt,k,fs=34,bg='#fff')=>k<=0?'':`<g transform="translate(${x},${y}) scale(${H.sp(k)})"><rect x="${-txt.length*fs*.29-30}" y="-48" width="${txt.length*fs*.58+60}" height="92" rx="40" fill="${bg}" stroke="#16171B" stroke-width="6"/><path d="M-20 42 L-38 74 L6 44Z" fill="${bg}" stroke="#16171B" stroke-width="6" stroke-linejoin="round"/><text y="12" text-anchor="middle" font-family="Inst" font-weight="700" font-size="${fs}" fill="#16171B">${txt}</text></g>`;
H.big=(lines,y,k,fs=96,col='#16171B')=>`<g transform="translate(540,${y}) scale(${H.sp(k)})"><text text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="${fs}" fill="${col}">${lines.map((l,i)=>`<tspan x="0" y="${i*fs*1.12}">${l}</tspan>`).join('')}</text></g>`;
H.web=(name,items,k,head='#FFB3C7')=>`<rect x="-150" y="-300" width="300" height="190" fill="${head}"/><text x="0" y="-190" text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="32" fill="#16171B">${name}</text>
 ${items.map((x,i)=>k>i*.3?`<rect x="-125" y="${-80+i*95}" width="250" height="75" rx="16" fill="#F6F6F6"/><text x="-100" y="${-32+i*95}" font-family="Inst" font-weight="700" font-size="30" fill="#16171B">${x}</text>`:'').join('')}
 ${k>.95?`<rect x="-125" y="210" width="250" height="64" rx="32" fill="#25A35A"/><text x="0" y="252" text-anchor="middle" font-family="Inst" font-weight="700" font-size="28" fill="#fff">WhatsApp</text>`:''}`;
H.critical=(lt,phoneSvg,char)=>`<rect width="1080" height="1920" fill="#16171B"/><g opacity=".08">${Array.from({length:12},(_,i)=>`<circle cx="540" cy="760" r="${(i*90+lt*160)%1100}" fill="none" stroke="#5EE08F" stroke-width="10"/>`).join('')}</g>
 ${H.badge(540,330,H.P(lt,.1,.5))}${H.phone({x:540,y:900,s:1.05*H.sp(H.P(lt,1.1,1.6)),screen:phoneSvg})}${char}`;
H.endCard=(lt,bg,lines,char)=>`<rect width="1080" height="1920" fill="${bg}"/>${char}${H.big(lines,330,H.P(lt,.1,.5),76)}
 <g transform="translate(540,1520) scale(${H.sp(H.P(lt,.5,.9))})"><rect x="-230" y="-60" width="460" height="120" rx="60" fill="#16171B"/><text y="22" text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="58" fill="#fff">bekora.es</text></g>`;

// ===== t2 · Taller d'en Pere (ganxo: POV + telèfon que no para) =====
(function(){
const pere=o=>H.person(Object.assign({skin:'#E0AC7E',shirt:'#3A6EA5',pants:'#2B3A55',hair:H.hairShort('#3B3B3B'),hat:H.cap('#E8574A')},o));
const cli=o=>H.person(Object.assign({skin:'#8D5A3B',shirt:'#B48CFF',pants:'#2D3142',hair:H.hairLong('#1E1E1E')},o));
const car=(x,y,c='#4DA3FF')=>`<g transform="translate(${x},${y})"><rect x="-300" y="-170" width="600" height="150" rx="50" fill="${c}" stroke="#16171B" stroke-width="8"/><path d="M-170 -170 Q-120 -290 0 -290 Q120 -290 170 -170Z" fill="${c}" stroke="#16171B" stroke-width="8"/><path d="M-130 -175 Q-95 -255 -10 -255 V-175Z M10 -175 V-255 Q95 -255 130 -175Z" fill="#CFE8F5"/><circle cx="-180" cy="-20" r="62" fill="#16171B"/><circle cx="180" cy="-20" r="62" fill="#16171B"/><circle cx="-180" cy="-20" r="25" fill="#9A9CA6"/><circle cx="180" cy="-20" r="25" fill="#9A9CA6"/></g>`;
const ring=(x,y,lt)=>`<g transform="translate(${x},${y}) rotate(${Math.sin(lt*50)*14})">${H.phone({x:0,y:0,s:.35,screen:`<rect x="-150" y="-300" width="300" height="600" fill="#5EE08F"/><text y="20" text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="60" fill="#16171B">RING</text>`})}</g>`;
const Q={es:['¿Abrís el sábado?','¿Cuánto cuesta?','¿Dónde estáis?','¿Hacéis ruedas?','¿Tenéis hora?'],ca:['Obriu dissabte?','Quant costa?','On sou?','Feu rodes?','Teniu hora?']};
TOON.t2=[
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#E9EEF3"/>${H.ground('#B9C2CC',1380)}${car(540,1360)}
   ${pere({x:860,y:1440,s:.8,t:lt,expr:lt>1.2?'angry':'neutral',mouth:lt>1.2?'flat':'smile',armR:-30})}${ring(250,700,lt)}
   ${H.sticker(540,330,'POV',"#FFD23F",'#16171B',H.P(lt,0,.25),-5,72)}`, shake:lt>1.2?6:0}),
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#F2F4F7"/>${H.T(Q).map((q,i)=>H.bubble(i%2?700:380,330+i*190,q,H.P(lt,.2+i*.35,.5+i*.35),40)).join('')}
   ${pere({x:540,y:1450,s:.9,t:lt,expr:'shock',mouth:'shock',armL:160,armR:-160})}`, shake:lt>1.5?5:0}),
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#E9EEF3"/>${H.ground('#B9C2CC',1380)}${car(540,1360,'#FF8FB1')}
   ${pere({x:540,y:1500,s:.75,t:lt,expr:'shock',mouth:'o',lean:-90})}
   ${lt>.9?H.sticker(560,900,'BONK!','#FFD23F','#16171B',H.P(lt,.9,1.2),8,80):''}${ring(880,640,lt)}`, shake:lt>.9&&lt<1.2?16:0}),
 (lt,du)=>{const k=H.io(H.P(lt,.4,du));return {svg:`<rect width="1080" height="1920" fill="#FFF6EC"/>${H.ground('#E6D6C2',1380)}
   ${cli({x:H.lerp(300,1250,k),y:1460,s:.9,t:lt,walk:lt>.4,expr:lt>.4?'angry':'neutral',mouth:'flat',armR:-130})}
   ${H.sticker(540,420,H.T({es:'SIN RESPUESTA',ca:'SENSE RESPOSTA'}),'#E8574A','#fff',H.P(lt,.1,.4),-4,60)}
   ${H.bubble(560,700,H.T({es:'Pues me voy a otro taller',ca:'Doncs vaig a un altre taller'}),H.P(lt,.6,.9),38)}`}},
 (lt,du)=>({svg:H.critical(lt,H.web(H.T({es:'Taller Pere',ca:'Taller Pere'}),H.T({es:['Servicios','Horario','Pedir cita'],ca:['Serveis','Horari','Demanar hora']}),H.P(lt,1.4,2.2),'#9CC3FF'),
   pere({x:870,y:1420,s:.6,t:lt,expr:'happy',mouth:'big',armL:150,armR:-150,hat:H.cap('#E8574A')}))}),
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#E9F7EF"/>${H.ground('#BFE3CC',1380)}${car(380,1360,'#5EE08F')}
   ${pere({x:820,y:1450,s:.8,t:lt,expr:'happy',mouth:'smile',armR:-120,hold:`<g transform="translate(0,150)"><rect x="-30" y="-50" width="60" height="70" rx="10" fill="#fff" stroke="#16171B" stroke-width="5"/><path d="M-6 -70 q10 -15 0 -30 M10 -70 q10 -15 0 -30" stroke="#9A9CA6" stroke-width="5" fill="none"/></g>`})}
   ${[0,1,2].map(i=>H.bubble(540,360+i*170,H.T({es:'Cita reservada',ca:'Hora reservada'}),H.P(lt,.3+i*.35,.6+i*.35),38,'#D7F5E3')).join('')}`}),
 (lt,du)=>({svg:H.endCard(lt,'#9CC3FF',H.T({es:['¿Y tu teléfono,','para alguna vez?'],ca:['I el teu telèfon,','para mai?']}),pere({x:540,y:1350,s:.9,t:lt,expr:'happy',mouth:'talk',armR:-60})), capTop:1650})
];})();

// ===== t3 · Perruqueria de la Laia (ganxo: "Mira què li passa cada nit a les 11") =====
(function(){
const laia=o=>H.person(Object.assign({skin:'#F7D7C4',shirt:'#16171B',pants:'#B48CFF',hair:H.hairLong('#C0392B')},o));
const chair=(x,y)=>`<g transform="translate(${x},${y})"><rect x="-70" y="-180" width="140" height="160" rx="30" fill="#B48CFF" stroke="#16171B" stroke-width="7"/><rect x="-90" y="-60" width="180" height="40" rx="18" fill="#9B6FE8" stroke="#16171B" stroke-width="7"/><rect x="-10" y="-20" width="20" height="90" fill="#16171B"/><rect x="-60" y="70" width="120" height="16" rx="8" fill="#16171B"/></g>`;
const moon=(lt)=>`<circle cx="860" cy="300" r="90" fill="#FFF3B0"/><circle cx="820" cy="270" r="90" fill="#2A2350"/>${Array.from({length:14},(_,i)=>`<circle cx="${(i*173)%1080}" cy="${(i*97)%700+80}" r="${3+i%3}" fill="#fff" opacity="${.4+.6*Math.abs(Math.sin(lt*3+i))}"/>`).join('')}`;
TOON.t3=[
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#2A2350"/>${moon(lt)}
   ${laia({x:420,y:1500,s:1,t:lt,expr:'sad',mouth:'flat',armR:-120,look:1})}
   ${H.phone({x:800,y:1000,s:.55,r:8,screen:`<rect x="-150" y="-300" width="300" height="600" fill="#fff"/><text y="-200" text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="56" fill="#16171B">23:00</text>${[0,1,2].map(i=>`<rect x="-125" y="${-120+i*120}" width="250" height="90" rx="20" fill="#EEE8FF"/>`).join('')}`})}
   ${H.sticker(540,560,H.T({es:'CADA NOCHE A LAS 11',ca:'CADA NIT A LES 11'}),'#FFD23F','#16171B',H.P(lt,0,.25),-4,52)}`}),
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#F3EEFF"/>${H.T({es:['¿Tienes hora mañana?','¿Cuánto cuesta un tinte?','¿Hacéis mechas?','¿Abrís los lunes?'],ca:['Tens hora demà?','Quant costa un tint?','Feu metxes?','Obriu dilluns?']}).map((q,i)=>H.bubble(i%2?680:400,360+i*200,q,H.P(lt,.2+i*.4,.5+i*.4),38)).join('')}
   ${laia({x:540,y:1460,s:.85,t:lt,expr:'shock',mouth:'o',armR:-120})}`}),
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#2A2350"/>${moon(lt)}
   ${laia({x:540,y:1500,s:1,t:lt,expr:'sad',mouth:'flat',lean:lt>1?-14:0})}
   ${lt>1?H.sticker(560,820,'Zzz...','#fff','#16171B',H.P(lt,1,1.3),6,72):''}`}),
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#FFF6FA"/>${H.ground('#EEDCE6',1380)}${chair(300,1370)}${chair(540,1370)}${chair(780,1370)}
   ${H.sticker(540,420,H.T({es:'LUNES: 0 CITAS',ca:'DILLUNS: 0 HORES'}),'#E8574A','#fff',H.P(lt,.2,.5),-4,58)}
   ${H.tumble(H.lerp(-80,1160,H.P(lt,.3,du)),1320,lt)}`}),
 (lt,du)=>({svg:H.critical(lt,H.web(H.T({es:'Pelu Laia',ca:'Perruqueria Laia'}),H.T({es:['Precios','Horario','Reservar hora'],ca:['Preus','Horari','Reservar hora']}),H.P(lt,1.4,2.2),'#D9C9FF'),
   laia({x:870,y:1420,s:.6,t:lt,expr:'happy',mouth:'big',armL:150,armR:-150}))}),
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#FFF6FA"/>${H.ground('#EEDCE6',1380)}
   ${[260,540,820].map((x,i)=>chair(x,1370)+H.person({x,y:1250,s:.45,t:lt+i,skin:['#C68B59','#F2C9A5','#8D5A3B'][i],shirt:['#5EE08F','#FFD23F','#4DA3FF'][i],hair:H.hairShort('#2B2B2B'),expr:'happy',mouth:'smile'})).join('')}
   ${laia({x:960,y:1460,s:.6,t:lt,expr:'happy',mouth:'big',armR:-120})}${H.confetti(lt,40,['#B48CFF','#FFD23F','#FF8FB1'])}
   ${H.sticker(540,420,H.T({es:'AGENDA LLENA',ca:'AGENDA PLENA'}),'#5EE08F','#16171B',H.P(lt,.2,.5),-4,64)}`}),
 (lt,du)=>({svg:H.endCard(lt,'#D9C9FF',H.T({es:['¿Y tú, a qué hora','contestas?'],ca:['I tu, a quina hora','contestes?']}),laia({x:540,y:1350,s:.9,t:lt,expr:'happy',mouth:'talk',armR:-60})), capTop:1650})
];})();

// ===== t4 · Restaurant d'en Toni (ganxo: pregunta impossible + zoom pixelat) =====
(function(){
const toni=o=>H.person(Object.assign({skin:'#E8B894',shirt:'#fff',apron:'#16171B',pants:'#2D3142',hair:H.hairShort('#5A3A22'),hat:`<rect x="-80" y="-200" width="160" height="90" rx="40" fill="#fff" stroke="#16171B" stroke-width="6"/>`},o));
const tour=o=>H.person(Object.assign({skin:'#F2C9A5',shirt:'#FFD23F',pants:'#4DA3FF',hair:H.hairShort('#E0C068'),hat:H.cap('#5EE08F')},o));
const blur=(lt,z=1)=>`<g transform="translate(540,860) scale(${z})"><rect x="-330" y="-430" width="660" height="860" rx="20" fill="#FFF1D6" stroke="#16171B" stroke-width="8"/>
 ${Array.from({length:120},(_,i)=>{const x=-300+(i%10)*60,y=-400+Math.floor(i/10)*66;return `<rect x="${x}" y="${y}" width="56" height="62" fill="${['#D9C3A0','#C9AE85','#E6D2B0','#BFA27A'][(i*7+Math.floor(lt*2))%4]}"/>`}).join('')}</g>`;
TOON.t4=[
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#FFF8E6"/>${blur(lt,.8+lt*.06)}
   ${H.sticker(540,260,H.T({es:'¿QUÉ PONE AQUÍ?',ca:'QUÈ HI DIU AQUÍ?'}),'#FFD23F','#16171B',H.P(lt,0,.25),-4,62)}`}),
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#FFF8E6"/>${blur(lt,1.25+lt*.2)}${H.sticker(540,260,'ZOOM...',"#4DA3FF",'#fff',H.P(lt,0,.2),-4,62)}
   ${tour({x:540,y:1500,s:.8,t:lt,expr:'shock',mouth:'o',armR:-140})}`}),
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#FFF8E6"/>${H.ground('#E8D7B5',1380)}
   ${toni({x:300,y:1450,s:.85,t:lt,expr:'happy',mouth:'talk',armR:-60})}
   ${H.bubble(640,640,H.T({es:'Es la carta, ¡en Instagram!',ca:'És la carta, a Instagram!'}),H.P(lt,.2,.5),36)}
   ${tour({x:820,y:1450,s:.8,t:lt,expr:'neutral',mouth:'flat',look:-1})}`}),
 (lt,du)=>{const k=H.io(H.P(lt,.5,du));return {svg:`<rect width="1080" height="1920" fill="#FFF8E6"/>${H.ground('#E8D7B5',1380)}
   ${toni({x:300,y:1450,s:.85,t:lt,expr:'sad',mouth:'sad'})}${tour({x:H.lerp(820,1300,k),y:1450,s:.8,t:lt,walk:true,expr:'happy',mouth:'smile'})}
   ${H.sticker(700,560,H.T({es:'SE FUE AL DE AL LADO',ca:'SE\'N VA AL DEL COSTAT'}),'#E8574A','#fff',H.P(lt,.6,.9),4,46)}`}},
 (lt,du)=>({svg:H.critical(lt,H.web(H.T({es:'Casa Toni',ca:'Can Toni'}),H.T({es:['Carta','Horario','Reservar mesa'],ca:['Carta','Horari','Reservar taula']}),H.P(lt,1.4,2.2),'#FFE79A'),
   toni({x:870,y:1420,s:.6,t:lt,expr:'happy',mouth:'big',armL:150,armR:-150}))}),
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#FFF8E6"/>${H.ground('#E8D7B5',1380)}
   ${[200,420,640,860].map((x,i)=>`<rect x="${x-80}" y="1300" width="160" height="20" rx="10" fill="#8C5A3C"/>`+H.person({x,y:1440,s:.42,t:lt+i,skin:['#C68B59','#F2C9A5','#8D5A3B','#E8B894'][i],shirt:['#FF8FB1','#4DA3FF','#5EE08F','#B48CFF'][i],hair:i%2?H.hairLong('#3B2A20'):H.hairShort('#1E1E1E'),expr:'happy',mouth:'smile'})).join('')}
   ${H.sticker(540,420,H.T({es:'TERRAZA LLENA',ca:'TERRASSA PLENA'}),'#5EE08F','#16171B',H.P(lt,.2,.5),-4,64)}${H.confetti(lt,40)}`}),
 (lt,du)=>({svg:H.endCard(lt,'#FFE79A',H.T({es:['¿Tu carta','se puede leer?'],ca:['La teva carta','es pot llegir?']}),toni({x:540,y:1350,s:.9,t:lt,expr:'happy',mouth:'talk',armR:-60})), capTop:1650})
];})();

// ===== t5 · Floristeria de la Núria (ganxo: abans/després tallat a la meitat) =====
(function(){
const nuria=o=>H.person(Object.assign({skin:'#F2C9A5',shirt:'#5EE08F',pants:'#2D3142',apron:'#E9F7EF',hair:H.hairBun('#2B1A10')},o));
const guy=o=>H.person(Object.assign({skin:'#C68B59',shirt:'#E8574A',pants:'#2D3142',hair:H.hairShort('#1E1E1E')},o));
const flower=(x,y,c,s=1)=>`<g transform="translate(${x},${y}) scale(${s})"><path d="M0 0 V140" stroke="#2FBF6B" stroke-width="10"/>${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-30" rx="22" ry="34" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="18" fill="#FFD23F"/></g>`;
const bouquet=(x,y,s=1)=>`<g transform="translate(${x},${y}) scale(${s})">${['#FF6B9A','#FFD23F','#B48CFF','#FF8FB1','#4DA3FF'].map((c,i)=>flower(-80+i*40,-60-(i%2)*40,c,.8)).join('')}<path d="M-70 60 L70 60 L30 220 L-30 220Z" fill="#FFF1D6" stroke="#16171B" stroke-width="6"/></g>`;
TOON.t5=[
 (lt,du)=>{const half=lt>du*.55;return {svg:`<rect width="1080" height="1920" fill="#E9F7EF"/>
   <rect x="0" y="0" width="540" height="1920" fill="#F4F1EA"/>${H.big([H.T({es:'ANTES',ca:'ABANS'})],260,H.P(lt,0,.2),70)}
   <g transform="translate(-270,0)">${nuria({x:540,y:1400,s:.7,t:lt,expr:'sad',mouth:'sad'})}</g>
   <g transform="translate(270,0)">${half?'':H.big([H.T({es:'DESPUÉS',ca:'DESPRÉS'})],260,H.P(lt,.3,.5),70)}</g>
   <g transform="translate(270,0)">${half?H.big(['???'],900,H.P(lt,du*.55,du*.55+.3),160,'#E8574A'):nuria({x:540,y:1400,s:.7,t:lt,expr:'happy',mouth:'big',armR:-140,hold:bouquet(0,120,.5)})}</g>
   <rect x="532" y="0" width="16" height="1920" fill="#16171B"/>`, shake:half&&lt<du*.55+.2?12:0}},
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#2A2350"/>${Array.from({length:14},(_,i)=>`<circle cx="${(i*173)%1080}" cy="${(i*97)%700+80}" r="4" fill="#fff" opacity=".7"/>`).join('')}
   ${guy({x:540,y:1500,s:.95,t:lt,expr:'shock',mouth:'o',armR:-150})}
   ${H.phone({x:760,y:900,s:.6,r:8,screen:`<rect x="-150" y="-300" width="300" height="600" fill="#fff"/><text y="-180" text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="40" fill="#E8574A">${H.T({es:'MAÑANA:',ca:'DEMÀ:'})}</text><text y="-120" text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="34" fill="#16171B">${H.T({es:'aniversario',ca:'aniversari'})}</text>`})}
   ${H.sticker(540,330,H.T({es:'DOMINGO, 22:00',ca:'DIUMENGE, 22:00'}),'#FFD23F','#16171B',H.P(lt,.1,.4),-4,60)}`}),
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#2A2350"/>${H.shop({x:90,y:420,w:900,h:960,wall:'#3B3366',awning:'#5EE08F',name:H.T({es:'FLORES NÚRIA',ca:'FLORS NÚRIA'}),fs:56,inside:`<rect x="590" y="300" width="240" height="70" rx="12" fill="#E8574A"/><text x="710" y="348" text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="34" fill="#fff">${H.T({es:'CERRADO',ca:'TANCAT'})}</text>`})}
   ${guy({x:300,y:1480,s:.7,t:lt,expr:'sad',mouth:'sad'})}${H.bubble(560,1100,H.T({es:'¿Y ahora cómo encargo?',ca:'I ara com ho encarrego?'}),H.P(lt,.4,.7),36)}`}),
 (lt,du)=>{const k=H.io(H.P(lt,.4,du));return {svg:`<rect width="1080" height="1920" fill="#F4F1EA"/>${H.ground('#E0D8C8',1380)}
   ${guy({x:H.lerp(300,1250,k),y:1460,s:.8,t:lt,walk:true,expr:'neutral',mouth:'flat'})}
   ${H.sticker(540,420,H.T({es:'COMPRÓ EN LA GASOLINERA',ca:'VA COMPRAR A LA BENZINERA'}),'#E8574A','#fff',H.P(lt,.2,.5),-4,32)}
   ${nuria({x:200,y:1460,s:.6,t:lt,expr:'sad',mouth:'sad'})}`}},
 (lt,du)=>({svg:H.critical(lt,H.web(H.T({es:'Flores Núria',ca:'Flors Núria'}),H.T({es:['Ramos','Horario','Encargar'],ca:['Rams','Horari','Encarregar']}),H.P(lt,1.4,2.2),'#BFF0D2'),
   nuria({x:870,y:1420,s:.6,t:lt,expr:'happy',mouth:'big',armL:150,armR:-150}))}),
 (lt,du)=>({svg:`<rect width="1080" height="1920" fill="#E9F7EF"/>${H.ground('#BFE3CC',1380)}
   ${[0,1,2,3,4].map(i=>bouquet(150+i*190,1100-Math.abs(Math.sin(lt*3+i))*120,.6)).join('')}
   ${nuria({x:540,y:1460,s:.7,t:lt,expr:'happy',mouth:'big',armL:150,armR:-150})}
   ${H.sticker(540,420,H.T({es:'ENCARGOS DE NOCHE',ca:'ENCÀRRECS DE NIT'}),'#FFD23F','#16171B',H.P(lt,.2,.5),-4,44)}`}),
 (lt,du)=>({svg:H.endCard(lt,'#BFF0D2',H.T({es:['¿Y si te buscan','de noche?'],ca:['I si et busquen','de nit?']}),nuria({x:540,y:1350,s:.9,t:lt,expr:'happy',mouth:'talk',armR:-60})), capTop:1650})
];})();
