'use strict';

// The twelve original portraits supply the pose, alpha, fur and feather texture.
// Only the pigment and hand-placed natural markings change; wardrobe layers stay separate.
const PetArt=(()=>{
  const catalog={...mammalCoats,...wildCoats};
  const width=384, height=368;
  const sources=new Map(), surfaces=new WeakMap(), finished=new Map(), pending=new Map();

  function original(kind,index){
    return 'assets/'+(kind==='kitten'?'kitten-'+(index%6):'pet-'+kind)+'.webp';
  }
  function paletteNames(kind){return catalog[kind].paletteNames;}
  function markingNames(kind){return catalog[kind].markingNames;}
  function name(kind,index){
    const palette=paletteNames(kind)[index%6], markings=markingNames(kind)[Math.floor(index/6)];
    return index<6?palette:palette+' · '+markings;
  }
  function image(kind,index=0){
    if(!Object.hasOwn(catalog,kind))return '';
    if(!Number.isInteger(index)||index<0||index>=36)index=0;
    const plain=index===0||(kind==='kitten'&&index<6);
    const key=kind+':'+index;
    const attr=plain?'':' data-look-key="'+key+'"';
    const src=finished.get(key)||original(kind,index);
    return '<img class="pet-img" draggable="false" alt="" src="'+src+'"'+attr+'>';
  }

  function surface(){
    const canvas=document.createElement('canvas');
    canvas.width=width;canvas.height=height;
    return canvas;
  }
  function readOriginal(src){
    if(!sources.has(src)){
      const pixels=new Promise((resolve,reject)=>{
        const img=new Image();
        img.onload=()=>{
          try{
            const ctx=surface().getContext('2d',{willReadFrequently:true});
            ctx.drawImage(img,0,0,width,height);
            resolve(ctx.getImageData(0,0,width,height));
          }catch(error){reject(error);}
        };
        img.onerror=()=>reject(new Error('Pet portrait unavailable'));
        img.src=src;
      }).catch(error=>{sources.delete(src);throw error;});
      sources.set(src,pixels);
    }
    return sources.get(src);
  }
  function masks(redPath,greenPath){
    const ctx=surface().getContext('2d',{willReadFrequently:true});
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,width,height);
    ctx.globalCompositeOperation='lighter';
    // Soft outlines let patches follow the surrounding fur or feathers.
    ctx.filter='blur(1.6px)';
    if(redPath){ctx.fillStyle='#f00';ctx.fill(new Path2D(redPath));}
    if(greenPath){ctx.fillStyle='#0f0';ctx.fill(new Path2D(greenPath));}
    return ctx.getImageData(0,0,width,height).data;
  }
  function ramp(triple){
    const stops=triple.map(hex=>[1,3,5].map(at=>parseInt(hex.slice(at,at+2),16)));
    const lut=new Uint8ClampedArray(256*3);
    for(let value=0;value<256;value++){
      const segment=value<128?0:1;
      const t=segment?(value-128)/127:value/128;
      for(let channel=0;channel<3;channel++){
        lut[value*3+channel]=stops[segment][channel]*(1-t)+stops[segment+1][channel]*t;
      }
    }
    return lut;
  }
  function recolor(source,palette,anatomy,mark){
    if(!surfaces.has(anatomy))surfaces.set(anatomy,masks(anatomy.accent,anatomy.protect));
    const regions=surfaces.get(anatomy), marks=mark?masks(mark.light,mark.dark):null;
    const base=palette&&ramp(palette.base), accent=palette?.accent&&ramp(palette.accent);
    const result=new ImageData(width,height);
    const from=source.data,to=result.data;
    for(let i=0;i<from.length;i+=4){
      if(!from[i+3])continue;
      to[i+3]=from[i+3];
      const luma=Math.round(.2126*from[i]+.7152*from[i+1]+.0722*from[i+2]);
      const weight=regions[i]/255, protect=regions[i+1]/255;
      const light=marks?marks[i]/255:0, dark=marks?marks[i+1]/255:0;
      // These curves keep original tonal variation inside the markings.
      const lightFur=146+.43*luma;
      for(let ch=0;ch<3;ch++){
        let color=from[i+ch];
        if(base){
          const offset=luma*3+ch;
          color=base[offset];
          if(accent)color+=(accent[offset]-color)*weight;
          // Keep the tiny warm and cool color changes of the original artwork.
          color+=(from[i+ch]-luma)*.055;
        }
        if(light)color+=(lightFur+(2-ch)*2-color)*light*.92;
        if(dark)color*=1-dark*(.55+.025*ch);
        to[i+ch]=color+(from[i+ch]-color)*protect;
      }
    }
    return result;
  }

  async function makePortrait(kind,index){
    const record=catalog[kind], color=index%6, marking=Math.floor(index/6);
    const anatomy=Array.isArray(record.anatomy)?record.anatomy[color]:record.anatomy;
    const source=await readOriginal(original(kind,index));
    const canvas=surface();
    const ctx=canvas.getContext('2d');
    ctx.putImageData(recolor(source,record.palettes[color],anatomy,anatomy.marks[marking]),0,0);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.91));
    if(!blob)throw new Error('Pet portrait unavailable');
    const url=URL.createObjectURL(blob);
    try{
      // Decode before swapping the visible original. Some embedded views restrict blob URLs.
      const preview=new Image();
      preview.src=url;
      await preview.decode();
      return url;
    }catch(error){
      URL.revokeObjectURL(url);
      // A data URL also works in embedded views that only allow inline image data.
      const inline=canvas.toDataURL('image/webp',.91);
      const preview=new Image();
      preview.src=inline;
      await preview.decode();
      return inline;
    }
  }
  // Limit simultaneous encoders when an entire class or picker opens on a phone.
  const queue=[];
  let running=0;
  function processQueue(){
    if(running>=2||!queue.length)return;
    const {kind,index,resolve,reject}=queue.shift();
    running++;
    makePortrait(kind,index).then(resolve,reject).finally(()=>{running--;processQueue();});
  }
  function remember(key){
    if(!pending.has(key)){
      const [kind,index]=key.split(':');
      const task=new Promise((resolve,reject)=>{
        queue.push({kind,index:Number(index),resolve,reject});processQueue();
      }).then(src=>{
        // The catalog bounds this cache at 252 compressed portraits per visit.
        finished.set(key,src);return src;
      }).finally(()=>pending.delete(key));
      pending.set(key,task);
    }
    return pending.get(key);
  }
  function apply(img,src){
    if(!img.isConnected)return;
    if(img.getAttribute('src')!==src)img.src=src;
    const pet=img.closest('.kitten-art[data-species="kitten"]');
    if(pet)pet.style.setProperty('--ear-art','url("'+src+'")');
  }
  function paint(root=document){
    root.querySelectorAll('img[data-look-key]').forEach(img=>{
      const key=img.dataset.lookKey;
      const cached=finished.get(key);
      if(cached){apply(img,cached);return;}
      // If the browser cannot draw a texture, the original portrait stays visible.
      remember(key).then(src=>apply(img,src)).catch(()=>{});
    });
  }
  return {image,paint,name,paletteNames,markingNames};
})();
