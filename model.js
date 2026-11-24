'use strict';
const Club = (() => {
  const moods = [
    {name:'Quiet corner', icon:'moon', msg:'Taking a quiet break.'},
    {name:'Needs support', icon:'heart', msg:'Ready for a little help.'},
    {name:'Refocusing', icon:'leaf', msg:'Finding focus again.'},
    {name:'Ready', icon:'check', msg:'Settled and ready to learn.'},
    {name:'Shining', icon:'sparkle', msg:'Showing kindness and effort.'}
  ];
  const species = {kitten:'Kitten', puppy:'Puppy', turtle:'Turtle', rabbit:'Rabbit', monkey:'Monkey', foal:'Baby horse', parrot:'Parrot'};
  const meals = [
    {id:'orchard', name:'Orchard fruit basket', servings:2, price:5},
    {id:'kibble', name:'Crunchy kibble', servings:1, price:2},
    {id:'garden', name:'Garden greens', servings:2, price:5},
    {id:'snack', name:'Snack bowls', servings:1, price:3},
    {id:'hay', name:'Meadow hay bundle', servings:2, price:4},
    {id:'seed', name:'Seed and grain mix', servings:2, price:5},
    {id:'berry', name:'Berry basket', servings:3, price:7},
    {id:'lunch', name:'Lunch bowls', servings:3, price:8},
    {id:'feast', name:'Class picnic tray', servings:5, price:12}
  ];
  const pantryFoods=[...meals,{id:'saved',name:'Saved shared meals'}];
  const stages = [
    {id:'silent', name:'Silent reading', target:20, cue:'Read quietly on your own.'},
    {id:'listen', name:'Teacher instruction', target:35, cue:'One voice speaks while the class listens.'},
    {id:'pairs', name:'Partner talk', target:50, cue:'Use a voice your partner can hear.'},
    {id:'groups', name:'Group work', target:68, cue:'Keep your voice within your group.'}
  ];
  function petOf(s){ return s.species === undefined ? 'kitten' : s.species; }
  const items = [
    {id:'compass',name:'Explorer compass',price:4,file:'accessory-compass',kind:'kitten'},
    {id:'sailor',name:'Sailor cap',price:4,file:'accessory-sailor',kind:'kitten'},
    {id:'berryclip',name:'Strawberry clip',price:2,file:'accessory-berryclip',kind:'kitten'},
    {id:'camera',name:'Mini camera',price:5,file:'accessory-camera',kind:'kitten'},
    {id:'butterfly',name:'Butterfly bow tie',price:3,file:'accessory-butterfly',kind:'kitten'},
    {id:'comet',name:'Shooting star brooch',price:3,file:'accessory-comet',kind:'kitten'},
    {id:'jersey',name:'Team jersey',price:5,file:'accessory-jersey',kind:'kitten',slot:'clothing'},
    {id:'vest',name:'Adventure vest',price:4,file:'accessory-vest',kind:'kitten',slot:'clothing'},
    {id:'sweater',name:'Star sweater',price:6,file:'accessory-sweater',kind:'kitten',slot:'clothing'},
    {id:'ballcap',name:'Baseball cap',price:4,file:'accessory-ballcap',kind:'kitten'},
    {id:'bandana',name:'Trail bandana',price:2,file:'accessory-bandana',kind:'kitten'},
    {id:'flower',name:'Daisy ear clip',price:4,file:'accessory-flower',kind:'kitten'},
    {id:'medal',name:'Soccer medal',price:5,file:'accessory-medal',kind:'kitten'},
    {id:'spacepatch',name:'Space mission patch',price:3,file:'accessory-spacepatch',kind:'kitten'},
    {id:'beret',name:'Artist’s beret',price:5,file:'accessory-beret',kind:'kitten'},
    {id:'bow',name:'Coral bow tie',price:3,file:'accessory-bow',kind:'kitten'},
    {id:'scarf',name:'Striped winter scarf',price:4,file:'accessory-scarf',kind:'kitten'},
    {id:'crown',name:'Golden crown',price:6,file:'accessory-crown',kind:'kitten'},
    {id:'soccer',name:'Soccer ball',price:3,file:'decor-soccer',kind:'room'},
    {id:'dino',name:'Dinosaur plush',price:5,file:'decor-dino',kind:'room'},
    {id:'yarn',name:'Mint yarn ball',price:4,file:'decor-yarn',kind:'room'},
    {id:'train',name:'Wooden train',price:8,file:'decor-train',kind:'room'},
    {id:'blocks',name:'Building blocks',price:4,file:'decor-blocks',kind:'room'},
    {id:'fish',name:'Fish cushion',price:6,file:'decor-fish',kind:'room'},
    {id:'rocket',name:'Toy space rocket',price:9,file:'decor-rocket',kind:'room'},
    {id:'keyboard',name:'Mini keyboard',price:7,file:'decor-keyboard',kind:'room'},
    {id:'tent',name:'Kitten hideaway',price:10,file:'decor-tent',kind:'room'}
  ];
  function id(){return crypto.randomUUID();}
  function day(){const d=new Date(); return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
  function student(name,coat){return {id:id(),name,coat:coat%6,species:null,mood:3,points:0,owned:[],worn:'',neededHelp:false,recovered:false};}
  function classroom(name,names,demo=false){
    return {id:id(),name,demo,students:names.map(student),points:0,owned:[],placed:[],lastDay:'',lastSummary:null};
  }
  function initial(){
    const c=classroom('Grade 2',['Maya','Omar','Lina','Adam','Noor','Zayd'],true);
    const levels=[4,3,3,2,4,3],points=[8,5,6,4,7,5];
    c.students.forEach((s,i)=>{s.mood=levels[i];s.points=points[i];s.species=['kitten','puppy','turtle','rabbit','foal','parrot'][i];});c.points=8;
    return {version:1,active:c.id,classes:[c],motion:true};
  }
  function mood(s,next){
    if(!Number.isInteger(next)||next<0||next>4||s.mood===next) return false;
    s.mood=next; if(next<=1)s.neededHelp=true;
    if(next>=3 && s.neededHelp)s.recovered=true;
    return true;
  }
  function roomMood(c){
    if(!c.students.length)return {name:'Welcome',icon:'home',tone:'calm'};
    const needs=c.students.filter(s=>s.mood<3).length/c.students.length;
    if(needs>=0.5)return {name:'Quiet time',icon:'moon',tone:'quiet'};
    if(c.students.filter(s=>s.mood===4).length/c.students.length>=0.5)return {name:'Sparkling',icon:'sparkle',tone:'bright'};
    return {name:'Cozy',icon:'sun',tone:'calm'};
  }
  const dailyEarn = s => ([1,1,1,2,3][s.mood]+(s.recovered?1:0));
  function classEarn(c){if(!c.students.length)return 0;const ready=c.students.filter(s=>s.mood>=3).length/c.students.length;return ready>=.75?3:ready>=.5?2:1;}
  function endDay(c,today=day()){
    if(c.lastDay===today || !c.students.length)return false;
    const room=classEarn(c);let total=0;
    for(const s of c.students){const n=dailyEarn(s);s.points+=n;total+=n;s.mood=3;s.neededHelp=false;s.recovered=false;}
    c.points+=room;c.lastDay=today;c.lastSummary={total,room};return c.lastSummary;
  }
  function useItem(c,s,item){
    if(!item)return false;
    if(item.kind==='room'){
      if(!c.owned.includes(item.id))c.owned.push(item.id);
      c.placed=c.placed.includes(item.id)?c.placed.filter(id=>id!==item.id):[...c.placed,item.id];
      return true;
    }
    if(!s||!petOf(s))return false;
    if(!s.owned.includes(item.id)){
      if(s.points<item.price)return false;
      s.points-=item.price;
      s.owned.push(item.id);
    }
    const slot=item.slot==='clothing'?'clothing':'worn';
    s[slot]=s[slot]===item.id?'':item.id;
    return true;
  }
  function foodStock(c){
    // Older classrooms saved the meal count without the individual varieties.
    return c.foodStock || (c.meals ? {saved:c.meals} : {});
  }
  function buyMeal(c,meal){
    if(!meal||c.points<meal.price)return false;
    const stock=foodStock(c), total=(c.meals||0)+meal.servings;
    if(!Number.isSafeInteger(total))return false;
    c.foodStock={...stock,[meal.id]:(stock[meal.id]||0)+meal.servings};
    c.meals=total;c.points-=meal.price;
    return true;
  }
  function feedClass(c,requestedFood){
    const pets=c.students.filter(petOf), stock=foodStock(c);
    const id=requestedFood??pantryFoods.find(food=>stock[food.id]>0)?.id;
    if(!c.meals||!pets.length||!Object.hasOwn(stock,id)||stock[id]<1)return false;
    c.foodStock={...stock,[id]:stock[id]-1};
    if(c.foodStock[id]===0)delete c.foodStock[id];
    c.meals--;
    const today=day();
    for(const pet of pets){
      pet.mealsEaten=(pet.mealsEaten||0)+1;
      pet.lastMeal=today;
    }
    return pets.length;
  }
  function valid(data){
    const obj=x=>x && typeof x==='object' && !Array.isArray(x);
    const label=x=>typeof x==='string' && x.trim().length>0 && x.length<=80;
    const uid=x=>typeof x==='string' && /^[a-zA-Z0-9-]{1,80}$/.test(x);
    const pts=x=>Number.isSafeInteger(x)&&x>=0;
    const owned=(xs,kind)=>Array.isArray(xs) && new Set(xs).size===xs.length && xs.every(x=>items.some(it=>it.id===x && it.kind===kind));
    const unique=xs=>new Set(xs.map(x=>x.id)).size===xs.length;
    if(!obj(data)||data.version!==1||!Array.isArray(data.classes)||!data.classes.length||typeof data.motion!=='boolean')return false;
    for(const c of data.classes){
      if(!obj(c)||!uid(c.id)||!label(c.name)||typeof c.demo!=='boolean'||!Array.isArray(c.students)||c.students.length>35||!pts(c.points)||!owned(c.owned,'room')||!owned(c.placed,'room')||!c.placed.every(x=>c.owned.includes(x))||typeof c.lastDay!=='string'||!(c.lastDay===''||/^\d{4}-\d{2}-\d{2}$/.test(c.lastDay)))return false;
      if(c.meals!==undefined&&!pts(c.meals))return false;
      if(c.foodStock!==undefined){
        if(!obj(c.foodStock)||!Object.entries(c.foodStock).every(([id,n])=>pantryFoods.some(food=>food.id===id)&&pts(n)))return false;
        if(Object.values(c.foodStock).reduce((sum,n)=>sum+n,0)!==(c.meals||0))return false;
      }
      if(c.noise!==undefined && (!obj(c.noise)||!stages.some(stage=>stage.id===c.noise.stage)||
        !obj(c.noise.targets)||!Object.entries(c.noise.targets).every(([key,target])=>stages.some(stage=>stage.id===key)&&Number.isInteger(target)&&target>=5&&target<=95)))return false;
      if(c.lastSummary!==null && (!obj(c.lastSummary)||!pts(c.lastSummary.total)||!pts(c.lastSummary.room)))return false;
      for(const s of c.students){
        if(!obj(s))return false;
        if(s.species!==undefined && s.species!==null && !Object.hasOwn(species,s.species))return false;
        if(s.mealsEaten!==undefined&&!pts(s.mealsEaten))return false;
        if(s.lastMeal!==undefined && !(typeof s.lastMeal==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s.lastMeal)))return false;
        if(s.clothing && !(Array.isArray(s.owned)&&s.owned.includes(s.clothing)&&items.some(i=>i.id===s.clothing&&i.slot==='clothing')))return false;
        if(!uid(s.id)||!label(s.name)||!Number.isInteger(s.coat)||s.coat<0||s.coat>5||!Number.isInteger(s.mood)||s.mood<0||s.mood>4||!pts(s.points)||!owned(s.owned,'kitten')||!(s.worn===''||s.owned.includes(s.worn))||typeof s.neededHelp!=='boolean'||typeof s.recovered!=='boolean')return false;
      }
      if(!unique(c.students))return false;
    }
    return unique(data.classes)&&data.classes.some(c=>c.id===data.active);
  }
  return {moods,items,species,meals,foodStock,pantryFoods,stages,petOf,buyMeal,feedClass,student,classroom,initial,day,mood,roomMood,dailyEarn,classEarn,endDay,useItem,valid};
})();
if(typeof module!=='undefined')module.exports=Club;
