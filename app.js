'use strict';
const $ = x=>document.querySelector(x);
const escapeHtml = value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const paths = {
 mic:'<rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5.5 10.5v1a6.5 6.5 0 0 0 13 0v-1M12 18v3.5m-4 0h8"/>',
 sound:'<path d="M5 9h4l5-4v14l-5-4H5zM17 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
 food:'<path d="M3 12h18l-3 7H6zM6 21h12M8 9c-2-2 2-3 0-5m5 5c-2-2 2-3 0-5"/>',
 board:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
 home:'<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-7h6v7"/>',
 gift:'<rect x="3" y="8" width="18" height="5" rx="1.5"/><path d="M5 13v8h14v-8M12 8v13"/><path d="M12 8C6 9 4 5 7 3c3-1 5 4 5 5s2-6 5-5c3 2 1 6-5 5z"/>',
 settings:'<path d="m9.5 3 .6-1h3.8l.6 2 2.2 1.3 2-.4 1.8 3.1-1.4 1.6v2.8l1.4 1.6-1.8 3.1-2.1-.4-2.2 1.3-.5 2h-3.8l-.6-2-2.3-1.3-2 .4L3.5 14l1.4-1.6V9.6L3.5 8l1.8-3.1 2 .4L9.5 4z" transform="translate(0 1)"/><circle cx="12" cy="12" r="3"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
 down:'<path d="m6 10 6 6 6-6"/>', up:'<path d="m6 14 6-6 6 6"/>',left:'<path d="m14 6-6 6 6 6"/>',right:'<path d="m10 6 6 6-6 6"/>',
 paw:'<ellipse cx="5.1" cy="9.2" rx="2.3" ry="3.2" transform="rotate(-27 5 9)"/><ellipse cx="9.3" cy="5.5" rx="2.1" ry="3.1" transform="rotate(-10 9 5)"/><ellipse cx="15.1" cy="5.6" rx="2.1" ry="3.1" transform="rotate(14 15 6)"/><ellipse cx="19.3" cy="9.4" rx="2.2" ry="3.1" transform="rotate(27 19 9)"/><path d="M12 10c-2.7 0-3.5 2.4-5.4 4.4-2.9 3-.8 6.6 2.5 5.6 2.2-.8 3.2-.8 5.6 0 3.5 1 5.5-2.8 2.6-5.7C15.4 12.2 14.6 10 12 10z"/>',
 school:'<path d="m2 8 10-5 10 5-10 5zM6 11v5c4 3 8 3 12 0v-5m4-3v7"/>',
 users:'<circle cx="9" cy="8" r="3"/><path d="M2 20v-2a7 7 0 0 1 14 0v2m0-15a3 3 0 0 1 0 6m3 3c2 1 3 3 3 5"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',check:'<path d="m5 12 4 4 10-10"/>',sparkle:'<path d="m12 2 2.5 6.8L21 12l-6.5 2.5L12 22l-2.5-7.5L3 12l6.5-3.2z"/>',
 leaf:'<path d="M20 3C9 2 3 7 5 15c6 6 15 2 15-12zM4 21l10-12"/>',heart:'<path d="M21 8c0 6-9 12-9 12S3 14 3 8c0-5 6-7 9-2 3-5 9-3 9 2z"/>',moon:'<path d="M20 15a9 9 0 0 1-11-12 9 9 0 1 0 11 12z"/>',
 filter:'<path d="M3 6h18M6 12h12m-8 6h4"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 x:'<path d="m6 6 12 12M18 6 6 18"/>',full:'<path d="M3 9V3h6m6 0h6v6m0 6v6h-6m-6 0H3v-6"/>',
 palette:'<path d="M21 12c0 3-2 4-5 3-3-1-4 1-3 3 1 2 0 3-2 3A9 9 0 1 1 21 12z"/><circle cx="8" cy="10" r=".8"/><circle cx="12" cy="7" r=".8"/><circle cx="16" cy="9" r=".8"/>',
 edit:'<path d="m4 16-1 5 5-1L20 8l-4-4zM13 7l4 4"/>',trash:'<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15m-8 3v9m4-9v9"/>',
 save:'<path d="M12 3v12m-4-4 4 4 4-4M4 15v5h16v-5"/>',load:'<path d="M12 16V4m-4 4 4-4 4 4M4 15v5h16v-5"/>',
 flag:'<path d="M5 21V4c4-4 9 4 15 0v10c-6 4-11-4-15 0"/>',bag:'<path d="M5 8h14l2 13H3zM9 9V6a3 3 0 1 1 6 0v3"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-9v.4"/>',play:'<path d="m7 3 13 9-13 9z"/>'
};
function ic(k,size=20){return '<svg aria-hidden="true" class="icon i-'+k+'" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">'+(paths[k]||'')+'</svg>';}
const btn=(a,label,icon,cls='btn',attrs='')=>'<button type="button" class="'+cls+'" data-action="'+a+'" '+attrs+'>'+ (icon?ic(icon,18):'')+label+'</button>';
const round=(a,label,icon,attrs='')=>btn(a,'',icon,'round','aria-label="'+escapeHtml(label)+'" title="'+escapeHtml(label)+'" '+attrs);
const KEY='kitten-club-classrooms-v1';
let data,readProblem='',lastSaved=null;
try {const raw=localStorage.getItem(KEY);if(raw){lastSaved=raw;data=Club.readClassrooms(raw);}}
catch{readProblem='Your saved classroom could not be opened. Restore a backup in Settings.';}
if(!data)data=Club.initial();
let view=['board','room','shop','noise'].includes(location.hash.slice(1))?location.hash.slice(1):'board';
let filter='all',roomPage=0,shopKind='kitten',shopId='',modal='',modalId='',toastTimer,restoreData,returnFocus;
let servingUntil=0, servingClass='', servingFood='snack';
const pantrySelection=new Map();
let turns=null,turnTimer,storageBlocked=Boolean(readProblem);
const getClass=()=>data.classes.find(c=>c.id===data.active);
const findStudent=id=>getClass().students.find(s=>s.id===id);
let lookDraft=null;
const todayLabel=()=>new Intl.DateTimeFormat(undefined,{weekday:'long',month:'long',day:'numeric'}).format(new Date());
const titleMap={board:'Classroom board',room:'Pet room',shop:'Reward shop',noise:'Noise monitor'};
function notify(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400);}
function storageMessage(msg){const el=$('#storage-msg');el.textContent=msg;el.hidden=!msg;}
function save(){
 if(storageBlocked)return;
 try{
   const raw=localStorage.getItem(KEY);
   if(raw && raw!==lastSaved){
     data=Club.readClassrooms(raw);lastSaved=raw;closeModal();stopTurns();render();
     notify('Another tab updated this classroom. Please repeat your change.');
     return;
   }
   const serialized=JSON.stringify(data);localStorage.setItem(KEY,serialized);lastSaved=serialized;storageMessage('');
 }catch{storageMessage('This browser could not save your changes. Download a backup in Settings.');}
}
const strappedAccessories=new Set(['bow','butterfly','medal','compass','camera']);
function kitten(student, preview) {
  const kind=Club.petOf(student);
  if(!kind)return '<span class="pet-placeholder" aria-label="Choose a pet">'+ic('paw',40)+'</span>';
  const accessory=preview && preview.slot!=='clothing'?preview.id:student.worn;
  const clothing=preview?.slot==='clothing'?preview.id:student.clothing;
  const look=Club.lookOf(student);
  const coat=kind==='kitten'?look%Club.paletteCount:student.coat;
  const garment=clothing?'<span class="wear fitted-garment wear-'+clothing+'" aria-hidden="true"></span>':'';
  const strap=strappedAccessories.has(accessory)?'<span class="wear-strap" aria-hidden="true"></span>':'';
  const accessoryImage=accessory?'<img draggable="false" class="wear wear-'+accessory+'" src="assets/accessory-'+accessory+'.webp" alt="">':'';
  return '<span class="kitten-art" data-species="'+kind+'" data-coat="'+coat+'" data-worn="'+(accessory||'')+'" data-clothing="'+(clothing||'')+'">'+
    PetArt.image(kind,look)+garment+strap+accessoryImage+'</span>';
}
function moodPill(s){const m=Club.moods[s.mood];return '<span class="mood mood-'+s.mood+'">'+ic(m.icon,14)+m.name+'</span>';}
function wallet(n){return '<span class="wallet">'+ic('paw',16)+'<b>'+n+'</b> <span>paw '+(n===1?'point':'points')+'</span></span>';}
function classAwardButton(c) {
  return btn('give-class','Give 1 class point','paw','btn class-award',
    'data-class="'+c.id+'" aria-label="Award 1 class paw point"'+(c.students.length?'':' disabled'));
}
function focusAttr(action,id){const matches=[...document.querySelectorAll('[data-action="'+action+'"]')];(id?matches.find(b=>b.dataset.id===id):matches[0])?.focus({preventScroll:true});}
function nav(){
 $('#nav').innerHTML=[['board','Class board','board'],['room','Pet room','home'],['shop','Reward shop','gift'],['noise','Noise monitor','sound']].map(([v,n,i])=>btn(v,n,i,'nav-btn '+(v===view?'active':''),v===view?'aria-current="page"':'')).join('');
 $('#tools').innerHTML=btn('classes','<span>'+escapeHtml(getClass().name)+'</span>'+ic('down',15),'school','class-switch','aria-label="Switch classroom, '+escapeHtml(getClass().name)+'"')+round('settings','Classroom settings','settings');
}
function go(v){
 if(view==='noise'&&v!=='noise')NoiseMeter.stop();
 if(turns && v!=='shop'){stopTurns();}
 if(view!==v){view=v;history.replaceState(null,'','#'+v);window.scrollTo({top:0,behavior:'auto'});}
 render();
}
function hero(c) {
  const chosenPets=c.students.filter(Club.petOf);
  const featured=chosenPets.length?chosenPets:[{species:'puppy',coat:0},{species:'rabbit',coat:0}];
  const roomArt = featured.slice(0,2).map((student,index) =>
    '<div class="hero-pet hp-'+index+'">'+kitten(student)+'</div>'
  ).join('');
  const action = c.demo
    ? btn('new-class','Set up my class','users','btn primary')
    : btn('room','Visit pet room','home','btn primary');
  const intro = c.demo ? 'Choose a pet, dress it with personal points, and feed the class pets together.' : 'Choose a pet on each student’s card. Award points for effort and teamwork.';
  return '<section class="hero"><div class="hero-art" aria-hidden="true"><div class="hero-image"></div>'+roomArt+'</div>'+
    '<div class="hero-content"><div class="date">'+ic('sun',18)+escapeHtml(todayLabel())+'</div>'+
    '<h1>Classroom board</h1><p>'+intro+'</p>'+action+'</div></section>';
}
function card(student) {
  const name = escapeHtml(student.name);
  const id = 'data-id="'+student.id+'"';
  const mood = Club.moods[student.mood];
  const options = Club.moods.map((choice,index) =>
    '<option value="'+index+'"'+(index===student.mood?' selected':'')+'>'+choice.name+'</option>'
  ).join('');
  const moodPicker = '<label class="card-mood"><span class="mood-label">Mood</span>'+
    '<span class="mood-picker mood-'+student.mood+'">'+ic(mood.icon,14)+
    '<select data-action="choose-mood" '+id+' aria-label="Mood for '+name+'">'+options+'</select>'+ic('down',13)+'</span></label>';
  const give = btn('give','Give 1 point','paw','award-point',id+' aria-label="Give 1 point to '+name+'"');
  const portrait = '<button class="portrait" data-action="student" '+id+' aria-label="Open '+name+'’s pet, '+mood.name+'">'+
    '<span class="picture-dot dot-a"></span><span class="picture-dot dot-b"></span>'+kitten(student)+'</button>';
  return '<article class="student-card tone-'+student.coat+'">'+portrait+
    '<div class="card-info"><button class="card-name" data-action="student" '+id+'>'+name+'</button>'+
    btn('choose-pet',Club.petOf(student)?Club.species[Club.petOf(student)]+' · Change pet':'Choose a pet','','pet-choose-link',id+' aria-label="Choose a pet for '+name+'"')+
    moodPicker+wallet(student.points)+give+'</div></article>';
}
function board(c){
 const list=c.students.filter(s=>filter==='all'||s.mood===Number(filter));
 return hero(c)+'<section aria-labelledby="roster-heading"><div class="section-head"><div class="heading-count"><h2 id="roster-heading">Class pets</h2><span class="count">'+c.students.length+'</span></div><div class="actions"><label class="select-wrap">'+ic('filter',17)+'<select id="mood-filter" aria-label="Filter pets by mood"><option value="all">All moods</option>'+Club.moods.map((m,i)=>'<option value="'+i+'" '+(filter===String(i)?'selected':'')+'>'+m.name+'</option>').join('')+'</select>'+ic('down',14)+'</label>'+btn('roster','Manage students','users','btn light')+'</div></div>'+
 (list.length?'<div class="cards">'+list.map(card).join('')+'</div>':'<div class="empty"><h3>'+(c.students.length?'No pets in this mood':'Meet your first class pet')+'</h3><p>'+(c.students.length?'Choose another mood to see more pets.':'Add your students so each one can choose a pet.')+'</p>'+btn(c.students.length?'clear-filter':'roster',c.students.length?'Show all pets':'Add students','plus','btn light')+'</div>')+'</section>'+
 '<div class="board-foot"><div class="class-points"><span class="coin">'+ic('paw',20)+'</span><div><b>Class paw points</b><span>For food to share with every pet</span></div><strong>'+c.points+'</strong>'+classAwardButton(c)+btn('food-shop','Food pantry','food','btn light')+'</div><div class="foot-actions">'+btn('fullscreen',projectLabel(),'full','btn quiet')+btn('endday',c.lastDay===Club.day()?'Day summary':'End school day','flag','btn light')+'</div></div>';
}
const petsPerRoomPage=10;
const narrow=matchMedia('(max-width: 650px)');
// Each spot is [horizontal center, baseline, width] as a percentage of the room.
// Special spots have floor alternatives for pets that stay on the ground.
const roomLayouts={
 wide:{
  standard:{floor:[[22,86,15],[85,81,14.6],[44,95,17],[65,90,15.7],[57,70,11],[35,73,11]],quiet:[10,62,12],perches:[[73.3,29.3,9.8],[33.8,47.9,11.4]]},
  full:{floor:[[13,69,9.5],[32,96,11],[52,94,11],[73,97,11],[93,93,10.5],[12,98,10.5],[51,65,9],[89,65,9],[70,64,9],[32,65,9]],quiet:[10,63,9],perches:[[73.3,30,8],[34,46,9]]}
 },
 small:{
  standard:{floor:[[20,81,24],[82,79,23],[40,96,26],[61,86,24],[68,62,17],[35,61,18]],quiet:[15,51,19],perches:[[76,34,16],[37,43,18]]},
  full:{floor:[[18,57,16],[12,78,16],[37,77,16],[63,77,16],[88,78,16],[21,98,17],[50,98,17],[79,98,17],[79,57,15],[49,57,15]],quiet:[15,51,16],perches:[[76,34,13],[37,43,13]]}
 }
};
function roomSpots(group,layout){
 const spots=new Map();
 const floor=layout.floor.slice();
 const resting=group.find(pet=>pet.mood===0);
 if(resting){
   spots.set(resting.id,layout.quiet);
   floor.shift();
 }
 const climbers=group.filter(pet=>pet!==resting && ['parrot','monkey','kitten'].includes(Club.petOf(pet)))
   .sort((a,b)=>Number(Club.petOf(b)==='parrot')-Number(Club.petOf(a)==='parrot'));
 const shelfCount=Math.min(climbers.length,layout.perches.length);
 for(let i=0;i<shelfCount;i++)spots.set(climbers[i].id,layout.perches[i]);
 // The final two floor spots are paired with the shelves, in the same order.
 if(shelfCount)floor.splice(floor.length-layout.perches.length,shelfCount);
 for(const pet of group){
   if(!spots.has(pet.id))spots.set(pet.id,floor.shift());
 }
 return spots;
}
function room(c){
 const mood=Club.roomMood(c);
 const pets=c.students.filter(Club.petOf);
 const total=Math.max(1,Math.ceil(pets.length/petsPerRoomPage));
 roomPage=Math.max(0,Math.min(roomPage,total-1));
 const start=roomPage*petsPerRoomPage;
 const group=pets.slice(start,start+petsPerRoomPage);
 const layouts=narrow.matches?roomLayouts.small:roomLayouts.wide;
 const full=group.length>layouts.standard.floor.length;
 const spots=roomSpots(group,full?layouts.full:layouts.standard);
 const serving=servingClass===c.id&&Date.now()<servingUntil;
 return '<section><div class="page-head"><div><div class="context">'+ic('school',17)+escapeHtml(c.name)+'</div><h1>Pet room</h1><p>Visit a pet or share a meal with the whole group.</p></div><div class="actions">'+btn('decor','Room toys','palette','btn light')+btn('food-shop','Food pantry','food','btn primary')+'</div>'+'</div>'+
 '<div class="room-stage room-'+mood.tone+(full?' full-room':'')+'"><picture><source media="(max-width:650px)" srcset="assets/room-mobile.webp"><img class="room-bg" src="assets/room.webp" alt="Sunny pet room with a woven bed, climbing tower, and peach rug."></picture><div class="room-glow"></div><div class="room-status">'+ic(mood.icon,17)+mood.name+'</div>'+
 c.placed.map(id=>'<img class="room-decor decor-'+id+'" alt="'+Club.items.find(x=>x.id===id).name+'" src="assets/decor-'+id+'.webp">').join('')+
 group.map((s,i)=>{const [x,y,w]=spots.get(s.id);return '<button class="room-pet level-'+s.mood+'" style="--x:'+x+'%;--y:'+y+'%;--w:'+w+'%;--delay:-'+i*.71+'s;z-index:'+Math.round(y)+'" data-id="'+s.id+'" data-action="student" aria-label="'+escapeHtml(s.name)+', '+Club.moods[s.mood].name+'"><span class="room-body">'+kitten(s)+(s.mood===4?'<span class="shine">'+ic('sparkle',18)+'</span>':s.mood<=1?'<span class="rest">'+ic(s.mood===0?'moon':'heart',16)+'</span>':'')+(serving?'<img class="serving-bowl" src="assets/food-'+servingFood+'.webp" alt="Meal served">':'')+'</span><span class="nametag">'+escapeHtml(s.name)+'</span></button>';}).join('')+
 '</div><div class="room-foot"><div class="room-legend">'+ic('paw',20)+'<b>'+pets.length+' '+(pets.length===1?'pet':'pets')+'</b><span>•</span><span>'+c.points+' class paw points</span>'+classAwardButton(c)+'</div>'+(total>1?'<nav class="pager" aria-label="Pet room pages">'+round('prev-room','Previous page','left',roomPage===0?'disabled':'')+'<span>Page '+(roomPage+1)+' of '+total+'</span>'+round('next-room','Next page','right',roomPage+1>=total?'disabled':'')+'</nav>':'')+btn('fullscreen',projectLabel(),'full','btn light')+'</div>'+pantry(c)+(!pets.length?'<p class="empty">Choose pets on the class board to welcome them into this room. '+btn('board','Class board','board','btn light')+'</p>':'')+'</section>';
}
function pantry(c) {
  const count=c.meals||0, pets=c.students.filter(Club.petOf).length;
  const fed=c.students.filter(s=>Club.petOf(s)&&s.lastMeal===Club.day()).length;
  const stock=Club.foodStock(c);
  const available=Club.pantryFoods.filter(food=>stock[food.id]>0);
  const chosen=available.find(food=>food.id===pantrySelection.get(c.id))||available[0];
  const options=available.map(food=>'<option value="'+food.id+'" '+(food.id===chosen.id?'selected':'')+'>'+food.name+' ('+stock[food.id]+')</option>').join('');
  const picker=chosen?'<label class="pantry-choice">Food to serve<select id="pantry-food">'+options+'</select></label>':'';
  return '<div class="pantry"><div><b>Class food pantry</b><p>'+count+' shared '+(count===1?'meal':'meals')+' ready · '+pets+' '+(pets===1?'pet':'pets')+' to feed</p>'+(fed?'<small>'+fed+' '+(fed===1?'pet has':'pets have')+' eaten today.</small>':'')+'</div><div class="pantry-controls">'+picker+
    btn('feed','Feed all pets','food','btn primary',count&&pets?'':'disabled')+'</div></div>';
}
function foodShop(c){
  return pantry(c)+'<p class="shop-hint">One shared meal feeds every chosen pet. Buy a variety with class points, choose it in the pantry, then select Feed all pets.</p><div class="shop-grid">'+Club.meals.map((meal,i)=>{
    const missing=meal.price-c.points;
    return '<article class="shop-card"><div class="product product-'+(i%6)+'"><img src="assets/food-'+meal.id+'.webp" alt=""></div><div class="product-info"><h2>'+meal.name+'</h2><p class="meal-size">'+meal.servings+' shared '+(meal.servings===1?'meal':'meals')+'</p><span class="product-price">'+ic('paw',16)+meal.price+' class points</span>'+
      btn('buy-food',missing>0?'Need '+missing+' more':'Buy food','','btn primary','data-meal="'+meal.id+'" '+(missing>0?'disabled':''))+'</div></article>';
  }).join('')+'</div>';
}
function outfitShop(s){
  if(!s)return '<div class="empty"><h3>Add your first student</h3>'+btn('roster','Add students','plus','btn light')+'</div>';
  if(!Club.petOf(s))return '<div class="empty"><h3>'+escapeHtml(s.name)+', choose your pet first</h3>'+btn('choose-pet','Choose a pet','paw','btn primary','data-id="'+s.id+'"')+'</div>';
  return '<div class="shop-grid">'+Club.items.filter(it=>it.kind==='kitten').map((it,i)=>{
    const bought=s.owned.includes(it.id), using=(it.slot==='clothing'?s.clothing:s.worn)===it.id, missing=it.price-s.points;
    const label=bought?(using?'Take off':'Wear it'):missing>0?'Need '+missing+' more':'Buy and wear';
    return '<article class="shop-card"><div class="product product-'+(i%6)+' outfit-preview" role="img" aria-label="'+escapeHtml(s.name)+'’s '+Club.species[Club.petOf(s)].toLowerCase()+' wearing the '+it.name+'">'+kitten(s,it)+'</div><div class="product-info"><h2>'+it.name+'</h2><span class="product-price">'+(bought?ic('check',16)+(using?'Wearing now':'Owned'):ic('paw',16)+it.price+' personal points')+'</span>'+btn('buy',label,'',bought?'btn light':'btn primary','data-item="'+it.id+'" '+(!bought&&missing>0?'disabled':''))+'</div></article>';
  }).join('')+'</div>';
}
function shop(c){
  const isFood=shopKind==='food', s=findStudent(shopId)||c.students[0];
  if(s)shopId=s.id;
  const selected=turns&&findStudent(turns.id);
  const header='<div class="page-head"><div><div class="context">'+ic('school',17)+escapeHtml(c.name)+'</div><h1>Reward shop</h1><p>Personal points buy clothes and accessories. Class points buy food for everyone.</p></div>'+(!turns&&c.students.length?btn('turn-setup','Take turns','clock','btn light'):'')+'</div>';
  const turnBar=turns?'<div class="turnbar">'+ic('clock')+'<b>'+(selected?escapeHtml(selected.name)+'’s turn':'Choose a student for the next turn')+'</b>'+(selected?'<span id="turn-time"></span>'+btn('turn-done','Finish turn','check','btn light'):'')+btn('stop-turns','End turns','x','btn quiet')+'</div>':'';
  if(turns&&!selected)return header+turnBar+'<div class="turn-grid">'+c.students.map(v=>btn('turn-choose',kitten(v)+'<b>'+escapeHtml(v.name)+'</b>'+(turns.done.includes(v.id)?'<small>Turn finished</small>':''),'','turn-choice','data-id="'+v.id+'" '+(turns.done.includes(v.id)?'disabled':''))).join('')+'</div>';
  const chooser=!isFood&&s&&!turns?'<label class="select-wrap recipient-picker"><span>Dress</span><select id="shop-kitten" aria-label="Choose a student to dress their pet">'+c.students.map(v=>'<option value="'+v.id+'" '+(v.id===s.id?'selected':'')+'>'+escapeHtml(v.name)+'</option>').join('')+'</select>'+ic('down',14)+'</label>':'';
  const balance=isFood?'Class food points':s?escapeHtml(s.name)+'’s personal points':'';
  return '<section>'+header+turnBar+'<div class="shop-tools"><div class="tabs">'+btn('kitten-shop','Pet outfits','paw',!isFood?'tab selected':'tab')+(!turns?btn('food-shop','Class food','food',isFood?'tab selected':'tab'):'')+'</div><div class="actions">'+chooser+(balance?'<span class="shop-balance">'+balance+' '+wallet(isFood?c.points:s.points)+'</span>':'')+'</div></div>'+(isFood?foodShop(c):outfitShop(s))+'</section>';
}
function render(){
 const c=getClass();document.body.classList.toggle('large-roster',c.students.length>12);document.documentElement.classList.toggle('no-motion',!data.motion);nav();
 document.title=titleMap[view]+' | Class Pets';
 $('#content').innerHTML=(view==='board'?board(c):view==='room'?room(c):view==='noise'?NoiseMeter.page(c):shop(c))+
 '<footer><span>'+ic('paw',15)+'Class Pets</span><button data-action="classes">'+escapeHtml(c.name)+(c.demo?' · Demo class':'')+'</button></footer>';
 if(view==='shop' && document.body.classList.contains('projector'))$('#content').insertAdjacentHTML('afterbegin',btn('fullscreen','Exit projector','full','btn quiet'));
 PetArt.paint($('#content'));
 if(view==='noise')NoiseMeter.paint();
 updateTurnClock();
}
const dlg=$('#dialog');
const footerButton=(label)=>'<button class="btn primary" type="submit">'+label+'</button>';
const dialogHead=(title)=>'<div class="dialog-head"><h2 id="dialog-title">'+title+'</h2>'+round('close','Close dialog','x')+'</div>';
const field=(label,input)=>'<label class="field"><span>'+label+'</span>'+input+'</label>';
function suggestedLook(s,kind,available){
  const current=Club.lookOf(s);
  if(Club.petOf(s)===kind&&available.includes(current))return current;
  const coat=kind==='kitten'?available.find(look=>look%Club.paletteCount===s.coat):undefined;
  return coat??available[0];
}
function petPicker(s){
  const current=Club.petOf(s);
  const choices=Object.entries(Club.species).map(([id,label])=>{
    const look=suggestedLook(s,id,Club.availableLooks(getClass(),s.id,id));
    const image=PetArt.image(id,look)+'<span>'+label+'</span>';
    return btn('pick-species',image,'','animal-choice','data-id="'+s.id+'" data-species="'+id+'" aria-pressed="'+(current===id)+'"');
  });
  return dialogHead('Choose a pet for '+escapeHtml(s.name))+
    '<p>Choose an animal, then pick its colors and markings.</p><div class="species-picker">'+choices.join('')+'</div>';
}
function paletteLook(available,selected,palette){
  const marking=Math.floor(selected/Club.paletteCount);
  const preferred=marking*Club.paletteCount+palette;
  return available.includes(preferred)?preferred:available.find(look=>look%Club.paletteCount===palette);
}
function lookPicker(s){
  const kind=lookDraft.kind, available=Club.availableLooks(getClass(),s.id,kind);
  const selected=available.includes(lookDraft.look)?lookDraft.look:suggestedLook(s,kind,available);
  lookDraft.look=selected;
  const palette=selected%Club.paletteCount, marking=Math.floor(selected/Club.paletteCount);
  const colors=PetArt.paletteNames(kind).map((name,i)=>{
    const look=paletteLook(available,selected,i);
    const thumbnail=PetArt.image(kind,look??i);
    return btn('pick-color',thumbnail+'<span>'+escapeHtml(name)+'</span>','','look-color',
      'data-palette="'+i+'" aria-pressed="'+(i===palette)+'" '+(look===undefined?'disabled':''));
  }).join('');
  const patterns=PetArt.markingNames(kind).map((name,i)=>{
    const id=i*Club.paletteCount+palette, free=available.includes(id);
    return '<option value="'+id+'" '+(i===marking?'selected ':'')+(free?'':'disabled')+'>'+escapeHtml(name)+(free?'':' (in use)')+'</option>';
  }).join('');
  const label=Club.species[kind].toLowerCase();
  const preview=kitten({...s,species:kind,look:selected});
  return dialogHead('Choose your '+label+'’s look')+
    '<div class="look-preview"><div class="look-portrait" role="img" aria-label="'+escapeHtml(PetArt.name(kind,selected))+'">'+preview+'</div>'+
    '<div><h3>'+escapeHtml(PetArt.paletteNames(kind)[palette])+'</h3><p>'+escapeHtml(PetArt.markingNames(kind)[marking])+'</p></div></div>'+
    '<fieldset class="look-colors"><legend>Color</legend><div>'+colors+'</div></fieldset>'+
    field('Markings','<select id="look-marking">'+patterns+'</select>')+
    '<p class="look-help">Each classmate gets a different look.</p><div class="dialog-actions split">'+
    btn('choose-pet','Back to animals','','btn light','data-id="'+s.id+'"')+
    btn('save-look','Save this look','check','btn primary','data-id="'+s.id+'"')+'</div>';
}
function refreshLookPicker(selector){
 const scroll=dlg.scrollTop;
 dlg.innerHTML=modalContent();PetArt.paint(dlg);dlg.scrollTop=scroll;
 dlg.querySelector(selector)?.focus({preventScroll:true});
}
function decorDialog(c){
  return dialogHead('Pet room toys')+'<p>Choose toys for the room. Decorating is free.</p><div class="toy-picker">'+Club.items.filter(item=>item.kind==='room').map(item=>{
    const placed=c.placed.includes(item.id);
    return btn('place-toy','<img src="assets/'+item.file+'.webp" alt=""><b>'+item.name+'</b><small>'+(placed?'Put away':'Place in room')+'</small>','','animal-choice','data-item="'+item.id+'" aria-pressed="'+placed+'"');
  }).join('')+'</div>';
}
async function changePetOrShop(action,classId,studentId,choice){
  function commit(){
    if(storageBlocked)throw Error();
    const raw=localStorage.getItem(KEY);
    const next=Club.readClassrooms(raw&&raw!==lastSaved?raw:JSON.stringify(data));
    const c=next.classes.find(entry=>entry.id===classId);
    if(!c||next.active!==classId){notify('The classroom changed. Open it again to continue.');return;}
    const student=c.students.find(entry=>entry.id===studentId);
    let message;
    if(action==='save-look'){
      if(!student||!Object.hasOwn(Club.species,choice.species))return;
      if(!Club.choosePet(c,student,choice.species,choice.look)){
        data=next;lastSaved=raw;render();
        const message='Another classmate chose this look. Pick an available one.';
        if(modal==='pick-look'&&modalId===studentId&&lookDraft?.kind===choice.species){
          refreshLookPicker('#look-marking');
          const help=dlg.querySelector('.look-help');
          help.textContent=message;
          help.setAttribute('role','alert');
        }else notify(message);
        return;
      }
      message=student.name+'’s '+Club.species[choice.species].toLowerCase()+' is ready.';
    }else if(action==='buy-food'){
      const meal=Club.meals.find(item=>item.id===choice.meal);
      if(turns||!Club.buyMeal(c,meal)){notify('Check the class food balance.');return;}
      message=meal.name+' added to the pantry.';
    }else if(action==='feed'){
      const food=Club.pantryFoods.find(entry=>entry.id===choice.meal);
      const count=food&&Club.feedClass(c,food.id);
      if(!count){notify('Choose a pet and stock the pantry first.');return;}
      message=food.name+' served to '+count+' class '+(count===1?'pet':'pets')+'.';
    }else{
      const item=Club.items.find(entry=>entry.id===choice.item);
      const decor=action==='place-toy';
      if(!item||item.kind!==(decor?'room':'kitten')||(turns&&(decor||turns.id!==studentId)))return;
      if(!Club.useItem(c,student,item)){notify('Check the student’s pet and personal points.');return;}
      const wearing=decor?c.placed.includes(item.id):(item.slot==='clothing'?student.clothing:student.worn)===item.id;
      message=wearing?(decor?item.name+' is in the room.':student.name+'’s pet is wearing the '+item.name+'.'):item.name+' put away.';
    }
    const saved=JSON.stringify(next);
    localStorage.setItem(KEY,saved);data=next;lastSaved=saved;storageMessage('');
    if(action==='buy-food')pantrySelection.set(c.id,choice.meal);
    if(action==='save-look')closeModal();
    if(action==='feed'){
      servingClass=c.id;servingFood=choice.meal==='saved'?'snack':choice.meal;servingUntil=Date.now()+6500;go('room');
    }else updateUi();
    if(action==='save-look')focusAttr('choose-pet',studentId);
    else if(choice.item||choice.meal){
      const root=dlg.open?dlg:document;
      root.querySelector(choice.item?'[data-item="'+choice.item+'"]':'[data-meal="'+choice.meal+'"]')?.focus({preventScroll:true});
    }
    notify(message);
  }
  try{
    if(navigator.locks)await navigator.locks.request(KEY,commit);
    else commit();
  }catch{notify('This change could not be saved. Check browser storage and try again.');}
}
function studentDialog(s){
 const name=escapeHtml(s.name),kind=Club.petOf(s);
 const appearance=kind?'<p class="pet-look-name">'+escapeHtml(PetArt.name(kind,Club.lookOf(s)))+'</p>':'';
 return dialogHead(name+'’s '+(Club.species[Club.petOf(s)]||'pet').toLowerCase())+'<div class="pet-summary tone-'+s.coat+'"><div class="pet-tile">'+kitten(s)+'</div><div>'+appearance+moodPill(s)+'<p>'+Club.moods[s.mood].msg+'</p>'+wallet(s.points)+'<p class="meal-history">'+(s.mealsEaten||0)+' shared '+(s.mealsEaten===1?'meal':'meals')+' enjoyed</p>'+btn('choose-pet',Club.petOf(s)?'Change pet':'Choose a pet','','btn light','data-id="'+s.id+'"')+'</div></div><h3>Check-in mood</h3><div class="mood-options">'+Club.moods.map((m,i)=>btn('set-mood',m.name,m.icon,'mood-choice '+(s.mood===i?'chosen':''),'aria-pressed="'+(s.mood===i)+'" data-level="'+i+'" data-id="'+s.id+'"')).join('')+'</div><div class="dialog-actions">'+btn('give','Award 1 paw point','paw','btn primary','data-id="'+s.id+'"')+btn('dress','Dress pet','gift','btn light','data-id="'+s.id+'"')+'</div>';
}
function rosterDialog(c){
 return dialogHead('Manage students')+'<p>'+escapeHtml(c.name)+' · '+c.students.length+' of 35 students</p><form id="students-form">'+field('Add student names','<textarea name="names" rows="3" maxlength="2834" placeholder="One name per line" required></textarea>')+'<div class="form-foot"><span class="error" role="alert"></span>'+footerButton('Add students')+'</div></form><div class="list">'+c.students.map(s=>'<div class="list-row"><span class="mini-pet">'+kitten(s)+'</span><b>'+escapeHtml(s.name)+'</b>'+round('edit','Edit '+s.name,'edit','data-id="'+s.id+'"')+'</div>').join('')+'</div>';
}
function editDialog(s){
 const available=Club.availableLooks(getClass(),s.id,'kitten');
 const kittenCoats=Club.petOf(s)==='kitten'?PetArt.paletteNames('kitten').map((name,i)=>{
   const look=paletteLook(available,Club.lookOf(s),i);
   return '<label><input type="radio" name="coat" aria-label="'+escapeHtml(name)+'" value="'+i+'" '+(i===s.coat?'checked ':'')+(look===undefined?'disabled':'')+'><span>'+PetArt.image('kitten',look??i)+'</span></label>';
 }).join(''):'';
 return dialogHead('Edit student')+'<form id="edit-form">'+field('Student name','<input name="name" value="'+escapeHtml(s.name)+'" maxlength="40" required>')+(kittenCoats?'<h3>Kitten coat</h3><div class="coat-grid">'+kittenCoats+'</div>':'')+'<div class="dialog-actions split">'+btn('remove-confirm','Remove student','trash','btn danger','data-id="'+s.id+'"')+footerButton('Save changes')+'</div><p class="error" role="alert"></p></form>';
}
function classesDialog(c){
 return dialogHead('Your classrooms')+'<div class="class-list">'+data.classes.map(k=>'<button class="class-choice" data-action="switch-class" data-id="'+k.id+'">'+ic('school')+'<span><b>'+escapeHtml(k.name)+'</b><small>'+k.students.length+' students'+(k.demo?' · Demo class':'')+'</small></span>'+(k.id===c.id?ic('check'):'')+'</button>').join('')+'</div>'+btn('new-class','Start my own class','plus','btn primary wide');
}
function newDialog(){
 return dialogHead('Start a classroom')+'<form id="class-form">'+field('Class name','<input name="classname" placeholder="e.g. Grade 3 Blue" maxlength="40" required>')+field('Student names','<textarea rows="5" name="names" maxlength="2834" placeholder="One name per line"></textarea>')+'<p class="hint">Add up to 35 students. Each student chooses a pet from the class board.</p><span class="error" role="alert"></span><div class="dialog-actions">'+footerButton('Create classroom')+'</div></form>';
}
function settingsDialog(){
 return dialogHead('Classroom settings')+'<div class="settings-row"><span><b>Room animation</b><small>Gentle movement for the pets</small></span><button class="switch" role="switch" aria-label="Room animation" aria-checked="'+data.motion+'" data-action="motion"></button></div><div class="settings-row"><span><b>Classroom display</b><small>Show your board or pet room full screen</small></span>'+btn('fullscreen','Project','full','btn light')+'</div><h3>Classroom backups</h3><p>Names and progress stay in this browser. Save a backup to move your classrooms to another device.</p><div class="dialog-actions">'+btn('export','Save backup','save','btn light')+btn('import','Restore backup','load','btn light')+'</div><div class="settings-row last"><span><b>Daily paw points</b><small>Review today’s awards before ending the day.</small></span>'+btn('endday','Review','flag','btn light')+'</div>';
}
function dayDialog(c){
 const done=c.lastDay===Club.day(),total=c.students.reduce((a,s)=>a+Club.dailyEarn(s),0);
 return dialogHead(done?'School day complete':'End school day')+(done?'<p>Today’s rewards are saved. Each pet begins the next check-in at Ready.</p><div class="summary-box"><b>Student paw points</b><strong>+'+(c.lastSummary?.total||0)+'</strong><b>Class paw points</b><strong>+'+(c.lastSummary?.room||0)+'</strong></div>':
 '<p>Each pet earns 1 to 3 paw points for today’s check-in. Returning from Needs support or Quiet corner to Ready or Shining earns one extra.</p><div class="daily-list">'+c.students.map(s=>'<div><span>'+escapeHtml(s.name)+'</span><b>'+ic('paw',14)+' +'+Club.dailyEarn(s)+'</b></div>').join('')+'</div><div class="summary-box"><b>Student paw points</b><strong>+'+total+'</strong><b>Class paw points</b><strong>+'+Club.classEarn(c)+'</strong></div><p class="hint">Awarding points resets moods to Ready. Daily awards run once per class each day.</p>')+'<div class="dialog-actions">'+(done?btn('close','Done','check','btn primary'):btn('finish-day','Award points and end day','paw','btn primary',c.students.length?'':'disabled'))+'</div>';
}
function modalContent(){
 const c=getClass(),s=findStudent(modalId);
 switch(modal){
 case 'student':return s?studentDialog(s):rosterDialog(c);
 case 'pick-look':return s&&lookDraft?lookPicker(s):rosterDialog(c);
 case 'choose-pet':return s?petPicker(s):rosterDialog(c);
 case 'decor':return decorDialog(c);
 case 'roster':return rosterDialog(c);
 case 'edit':return s?editDialog(s):rosterDialog(c);
 case 'remove-confirm':return dialogHead('Remove '+escapeHtml(s.name)+'?')+'<p>This removes the student, their pet, and their paw points from '+escapeHtml(c.name)+'.</p><div class="dialog-actions">'+btn('edit','Keep student','','btn light','data-id="'+s.id+'"')+btn('remove','Remove student','trash','btn danger','data-id="'+s.id+'"')+'</div>';
 case 'classes':return classesDialog(c);
 case 'new-class':return newDialog();
 case 'settings':return settingsDialog();
 case 'endday':return dayDialog(c);
 case 'restore':return dialogHead('Restore classrooms?')+'<p>This backup contains '+restoreData.classes.length+' classroom'+(restoreData.classes.length===1?'':'s')+'. Restoring replaces the classrooms saved in this browser.</p><div class="dialog-actions">'+btn('settings','Keep current classrooms','','btn light')+btn('restore-confirm','Restore backup','load','btn primary')+'</div>';
 case 'turn-setup':return dialogHead('Reward shop turns')+'<p>Each student picks their pet and dresses it using their own paw points. Choose the time for each turn.</p><form id="turn-form">'+field('Time per student','<select name="minutes"><option value="1">1 minute</option><option value="2" selected>2 minutes</option><option value="3">3 minutes</option></select>')+'<div class="dialog-actions">'+footerButton('Start turns')+'</div></form>';
 }
}
function openModal(m,id=''){
 if(!dlg.open){const b=document.activeElement;returnFocus=b?.dataset.action?{action:b.dataset.action,id:b.dataset.id}:null;}
 modal=m;modalId=id;dlg.innerHTML=modalContent();PetArt.paint(dlg);dlg.scrollTop=0;
 if(!dlg.open)dlg.showModal();
 dlg.querySelector('h2').setAttribute('tabindex','-1');dlg.querySelector('h2').focus({preventScroll:true});
}
function closeModal(){if(dlg.open)dlg.close();modal='';modalId='';}
dlg.addEventListener('close',()=>{if(dlg.open)return;modal='';modalId='';if(returnFocus){focusAttr(returnFocus.action,returnFocus.id);returnFocus=null;}});
dlg.addEventListener('click',ev=>{if(ev.target===dlg){const r=dlg.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)closeModal();}});
function updateUi(action,id){
 const scroll=dlg.scrollTop;render();if(dlg.open){dlg.innerHTML=modalContent();PetArt.paint(dlg);dlg.scrollTop=scroll;}
 if(action){const root=dlg.open?dlg:document;const els=[...root.querySelectorAll('[data-action="'+action+'"]')];(els.find(b=>(!id||b.dataset.id===id)&&!b.disabled)||els.find(b=>!b.disabled))?.focus({preventScroll:true});}
}
// Resolve the same classroom and student against the latest saved balances.
async function awardPoints(action, classId, studentId) {
  function feedback(message) {
    if (!dlg.open) {
      notify(message);
      return;
    }
    let line = dlg.querySelector('.award-feedback');
    if (!line) {
      line = document.createElement('p');
      line.className = 'award-feedback';
      line.setAttribute('role','status');
      dlg.append(line);
    }
    line.textContent = message;
  }

  function commit() {
    if (storageBlocked) {
      feedback('Points could not be saved. Restore your classroom backup in Settings.');
      return;
    }
    const raw = localStorage.getItem(KEY);
    const next = Club.readClassrooms(raw && raw !== lastSaved ? raw : JSON.stringify(data));
    const classroom = next.classes.find(entry => entry.id === classId);
    const student = classroom?.students.find(entry => entry.id === studentId);
    if (!classroom || (action === 'give' && !student)) {
      feedback('This classroom or pet has changed. Reopen the board to award the point.');
      return;
    }

    let message;
    if (action === 'finish-day') {
      Club.endDay(classroom);
    } else {
      const owner = action === 'give-class' ? classroom : student;
      owner.points += 1;
      const unit = owner.points === 1 ? 'point' : 'points';
      message = owner.name+' now has '+owner.points+' paw '+unit+'.';
    }

    const serialized = JSON.stringify(next);
    localStorage.setItem(KEY,serialized);
    data = next;
    lastSaved = serialized;
    storageMessage('');
    if (getClass().id !== classId) {
      closeModal();
      render();
      if(message) notify(message);
      return;
    }
    if (action === 'finish-day') {
      render();
      openModal('endday');
    } else {
      updateUi(action,studentId);
      feedback(message);
    }
  }

  try {
    if (navigator.locks) await navigator.locks.request(KEY,commit);
    else commit();
  } catch {
    feedback('The browser could not save these points. Check browser storage and try again.');
  }
}
function setMood(s,next,from){
 if(!s||!Club.mood(s,next))return;
 save();updateUi();const root=dlg.open?dlg:document;
 const action=from==='set-mood'?'[data-action="set-mood"][data-level="'+next+'"]':'[data-action="'+from+'"][data-id="'+s.id+'"]:not(:disabled)';
 const fallback=root.querySelector('[data-action="student"][data-id="'+s.id+'"]')||$('#mood-filter');
 (root.querySelector(action)||fallback)?.focus({preventScroll:true});
 notify(s.name+' is '+Club.moods[s.mood].name+'.');
}
function namesFrom(form){return new FormData(form).get('names').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);}
function formError(form,msg){form.querySelector('.error').textContent=msg;}
function stopTurns(){clearInterval(turnTimer);turns=null;turnTimer=null;}
function finishTurn(){if(!turns?.id)return;turns.done.push(turns.id);turns.id='';turns.end=0;const finished=turns.done.length>=getClass().students.length;if(finished){stopTurns();notify('Every student has had a turn.');}else notify('Time for the next student.');render();}
function updateTurnClock(){const el=$('#turn-time');if(!turns?.id||!el)return;const sec=Math.max(0,Math.ceil((turns.end-Date.now())/1000));el.textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');if(!sec)finishTurn();}
function exportBackup(){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='class-pets-'+Club.day()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function projectLabel(){return document.body.classList.contains('projector')?'Exit projector':'Projector view';}
function projector(){
 closeModal();const enable=()=>{document.body.classList.toggle('projector');render();};
 if(document.fullscreenElement)document.exitFullscreen().catch(enable);
 else if(document.body.classList.contains('projector'))enable();
 else if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(enable);
 else enable();
}
document.addEventListener('fullscreenchange',()=>{document.body.classList.toggle('projector',!!document.fullscreenElement);render();});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&document.body.classList.contains('projector')&&!document.fullscreenElement&&!dlg.open){document.body.classList.remove('projector');render();}
 if(!['ArrowUp','ArrowDown'].includes(e.key)||!e.target.matches('button[data-action="student"]')||dlg.open)return;
 const s=findStudent(e.target.dataset.id);if(!s)return;e.preventDefault();setMood(s,s.mood+(e.key==='ArrowUp'?1:-1),'student');
});
document.addEventListener('click',e=>{
 const el=e.target.closest('button[data-action]');if(!el||el.disabled)return;
 const a=el.dataset.action,id=el.dataset.id||'',s=findStudent(id),c=getClass();
 switch(a){
 case 'board':case 'room':case 'shop':case 'noise':go(a);break;
 case 'choose-pet':case 'decor':case 'student':case 'roster':case 'classes':case 'new-class':case 'settings':case 'endday':case 'turn-setup':case 'edit':case 'remove-confirm':openModal(a,id);break;
 case 'close':closeModal();break;
 case 'set-mood':setMood(s,Number(el.dataset.level),a);break;
 case 'give':
 case 'give-class':
 case 'finish-day':
   void awardPoints(a,el.dataset.class || c.id,id);
   break;
 case 'dress':closeModal();shopKind='kitten';shopId=id;go('shop');break;
 case 'food-shop':shopKind='food';go('shop');break;
 case 'kitten-shop':shopKind='kitten';go('shop');break;
 case 'pick-species':{
   const kind=el.dataset.species;
   if(!s||!Object.hasOwn(Club.species,kind))break;
   lookDraft={kind,look:suggestedLook(s,kind,Club.availableLooks(c,s.id,kind))};
   openModal('pick-look',s.id);break;
 }
 case 'pick-color':{
   const student=findStudent(modalId);
   if(modal!=='pick-look'||!student)break;
   const palette=Number(el.dataset.palette);
   const look=paletteLook(Club.availableLooks(c,student.id,lookDraft.kind),lookDraft.look,palette);
   if(look!==undefined){lookDraft.look=look;refreshLookPicker('[data-palette="'+palette+'"]');}
   break;
 }
 case 'save-look':
   if(modal==='pick-look'&&lookDraft&&id===modalId)void changePetOrShop(a,c.id,id,{species:lookDraft.kind,look:lookDraft.look});
   break;
 case 'buy': case 'buy-food': case 'feed': case 'place-toy':{
   void changePetOrShop(a,c.id,id||shopId,{item:el.dataset.item,species:el.dataset.species,meal:a==='feed'?$('#pantry-food')?.value:el.dataset.meal});break;
 }
 case 'mic-start':void NoiseMeter.start();break;
 case 'shh-preview':NoiseMeter.previewShh();break;
 case 'mic-resume':NoiseMeter.resume();break;
 case 'mic-stop':NoiseMeter.stop();render();break;
 case 'noise-stage':setNoiseStage(el.dataset.stage);break;
 case 'restore-target':{
   const stage=Club.stages.find(entry=>entry.id===(c.noise?.stage||'silent'));
   if(c.noise)delete c.noise.targets[stage.id];
   save();render();NoiseMeter.refresh();$('#noise-target')?.focus({preventScroll:true});break;
 }
 case 'switch-class':NoiseMeter.stop();if(!data.classes.some(k=>k.id===id))break;stopTurns();data.active=id;shopId='';roomPage=0;filter='all';closeModal();save();go('board');break;
 case 'clear-filter':filter='all';render();break;
 case 'remove':c.students=c.students.filter(v=>v.id!==id);if(turns)stopTurns();save();render();openModal('roster');notify('Student removed.');break;
 case 'fullscreen':projector();break;
 case 'motion':data.motion=!data.motion;save();updateUi('motion');break;
 case 'prev-room':case 'next-room':{
   roomPage+=a==='next-room'?1:-1;render();
   const pager=$('.room-foot .pager');
   (pager?.querySelector('[data-action="'+a+'"]:enabled')||pager?.querySelector('button:enabled'))?.focus({preventScroll:true});
   break;
 }
 case 'export':exportBackup();break;
 case 'import':$('#restore-file').click();break;
 case 'restore-confirm':if(restoreData){NoiseMeter.stop();data=restoreData;restoreData=null;storageBlocked=false;stopTurns();save();filter='all';roomPage=0;shopId='';closeModal();go('board');notify('Classrooms restored.');}break;
 case 'turn-choose':if(turns&&!turns.id&&!turns.done.includes(id)&&s){turns.id=id;turns.end=Date.now()+turns.minutes*60000;shopId=id;render();}break;
 case 'turn-done':finishTurn();break;
 case 'stop-turns':stopTurns();render();break;
 }
});
function setNoiseStage(id){
 const stage=Club.stages.find(entry=>entry.id===id);if(!stage)return;
 const c=getClass();
 c.noise={stage:stage.id,targets:c.noise?.targets||{}};save();render();NoiseMeter.refresh();
 const control=window.matchMedia('(max-width:700px)').matches?$('#mobile-stage'):document.querySelector('[data-stage="'+stage.id+'"]');
 control?.focus({preventScroll:true});
}
document.addEventListener('input',e=>{
 if(e.target.id==='noise-target'){
   const c=getClass(), stage=Club.stages.find(entry=>entry.id===(c.noise?.stage||'silent'));
   document.querySelector('#adjusted-target').textContent=e.target.value;
   document.querySelector('[data-action="restore-target"]').disabled=Number(e.target.value)===stage.target;
   document.querySelector('#target-reading').textContent=e.target.value;
   document.querySelector('#sound-meter').style.setProperty('--target',e.target.value+'%');
 }
});
document.addEventListener('change',async e=>{
 if(e.target.id==='look-marking'&&modal==='pick-look'){
   lookDraft.look=Number(e.target.value);refreshLookPicker('#look-marking');return;
 }
 if(e.target.id==='pantry-food'){pantrySelection.set(getClass().id,e.target.value);return;}
 if(e.target.id==='mobile-stage'){setNoiseStage(e.target.value);return;}
 if(e.target.id==='noise-target'){
   const c=getClass(), settings=c.noise||{stage:'silent',targets:{}};
   settings.targets[settings.stage]=Number(e.target.value);c.noise=settings;save();NoiseMeter.refresh();return;
 }
 if (e.target.matches('select[data-action="choose-mood"]')) {
   const student=findStudent(e.target.dataset.id);
   if(student) setMood(student,Number(e.target.value),'choose-mood');
   return;
 }
 if(e.target.id==='mood-filter'){filter=e.target.value;render();$('#mood-filter').focus({preventScroll:true});}
 if(e.target.id==='shop-kitten'){shopId=e.target.value;render();$('#shop-kitten').focus({preventScroll:true});}
 if(e.target.id==='restore-file'){const file=e.target.files?.[0];e.target.value='';if(!file)return;
   try{if(file.size>10_000_000)throw Error();restoreData=Club.readClassrooms(await file.text());openModal('restore');}
   catch{notify('Choose a valid Class Pets backup file.');const error=document.createElement('p');error.className='error';error.textContent='This file is not a valid Class Pets backup.';dlg.querySelector('.error')?.remove();dlg.append(error);}
 }
});
document.addEventListener('submit',e=>{
 const form=e.target;if(!['students-form','class-form','edit-form','turn-form'].includes(form.id))return;e.preventDefault();const fields=new FormData(form),c=getClass();
 if(form.id==='students-form'||form.id==='class-form'){
   const names=namesFrom(form),newClass=form.id==='class-form',capacity=35-(newClass?0:c.students.length);
   if(names.length>capacity)return formError(form,'Room for '+capacity+' more students. Enter fewer names.');
   if(names.some(n=>n.length>40))return formError(form,'Use 40 characters or fewer for each name.');
   if(newClass){
     const title=fields.get('classname').trim();if(!title)return formError(form,'Enter a class name.');
     const k=Club.classroom(title,names);data.classes.push(k);data.active=k.id;stopTurns();filter='all';roomPage=0;shopId='';closeModal();save();go('board');notify('Welcome, '+title+'!');return;
   }
   if(!names.length)return formError(form,'Enter at least one name.');
   const start=c.students.length;names.forEach((n,i)=>c.students.push(Club.student(n,start+i)));
   save();render();openModal('roster');notify(names.length===1?'One student joined the class.':names.length+' students joined the class.');return;
 }
 if(form.id==='edit-form'){
   const s=findStudent(modalId),name=fields.get('name').trim();if(!name)return formError(form,'Enter a student name.');
   if(fields.has('coat')){
     const look=paletteLook(Club.availableLooks(c,s.id,'kitten'),Club.lookOf(s),Number(fields.get('coat')));
     if(!Club.choosePet(c,s,'kitten',look))return formError(form,'Choose an available kitten coat.');
   }
   s.name=name;save();render();openModal('roster');notify('Student updated.');return;
 }
 stopTurns();turns={minutes:Number(fields.get('minutes')),id:'',end:0,done:[]};turnTimer=setInterval(updateTurnClock,500);shopKind='kitten';closeModal();go('shop');
});
narrow.addEventListener('change',()=>{if(view==='room')render();});
window.addEventListener('hashchange',()=>{const v=location.hash.slice(1);if(['room','shop','board','noise'].includes(v))go(v);});
window.addEventListener('storage',e=>{
 if(e.key!==KEY || !e.newValue || e.newValue===lastSaved)return;
 try{
   const current=localStorage.getItem(KEY);if(!current || current===lastSaved)return;
   const fresh=Club.readClassrooms(current);
   const open=dlg.open;closeModal();stopTurns();if(fresh.active!==data.active)NoiseMeter.stop();data=fresh;lastSaved=current;storageBlocked=false;
   roomPage=0;filter='all';render();storageMessage('');
   if(open)notify('This classroom was updated in another tab.');
 }catch{}
});
if(readProblem)storageMessage(readProblem);
render();
