'use strict';
const NoiseMeter = (() => {
  let mode='off', note='', level=0, loud=false, overSince=0, underSince=0, latestPaint=0;
  let context, stream, graph, frame, promptTimer, hiddenTimer, attempt=0;
  let offerBrowserLink=false;
  const shhUrl='assets/classroom-shh.wav';
  const reminderInterval=15000;
  let shhBuffer=null, playingShh=null, previewAudio=null, shhUnavailable=false;
  let nextReminder=0, listenAgain=0;
  const calmDescription='A girl and a boy smile with a relaxed ginger kitten sitting between them.';
  const sadDescription='The girl, kitten, and boy look sad. The kitten in the middle covers both ears with its paws.';
  const liveUrl='https://kitten-club-classroom.fatima1964.chatgpt.site/#noise';
  const preferences=c=>c.noise || {stage:'silent',targets:{}};
  const currentStage=c=>Club.stages.find(stage=>stage.id===preferences(c).stage)||Club.stages[0];
  const target=c=>preferences(c).targets[currentStage(c).id]??currentStage(c).target;

  function selectedTarget(){
    const slider=document.querySelector('#noise-target');
    return slider?Number(slider.value):target(getClass());
  }

  async function prepareShh(ctx,token){
    if(shhBuffer)return;
    try{
      const response=await fetch(shhUrl);
      if(!response.ok)throw Error();
      const buffer=await ctx.decodeAudioData(await response.arrayBuffer());
      if(token===attempt)shhBuffer=buffer;
    }catch{
      if(token===attempt){shhUnavailable=true;paint();}
    }
  }
  function stopShh(){
    if(playingShh){
      playingShh.onended=null;playingShh.stop();playingShh.disconnect();playingShh=null;
    }
  }
  function playShh(now){
    if(!shhBuffer||playingShh||context.state!=='running')return;
    const sound=context.createBufferSource();
    sound.buffer=shhBuffer;sound.connect(context.destination);
    sound.onended=()=>{sound.disconnect();if(playingShh===sound)playingShh=null;};
    sound.start();playingShh=sound;
    nextReminder=now+reminderInterval;
    // Let the sound and its room echo fade before measuring the class again.
    listenAgain=now+shhBuffer.duration*1000+450;
    overSince=0;
  }
  function previewShh(){
    if(mode!=='off')return;
    if(!previewAudio)previewAudio=new Audio(shhUrl);
    previewAudio.currentTime=0;
    previewAudio.play().catch(error=>{
      if(error.name!=='AbortError')notify('The sound preview could not play. Try again.');
    });
  }
  function stop(message='', showLink=false){
    attempt++;
    if(previewAudio){previewAudio.pause();previewAudio=null;}
    stopShh();nextReminder=0;listenAgain=0;shhUnavailable=false;
    clearTimeout(promptTimer);clearTimeout(hiddenTimer);
    cancelAnimationFrame(frame);
    if(context)context.onstatechange=null;
    if(stream)stream.getTracks().forEach(track=>track.stop());
    if(graph){
      graph.source.disconnect();graph.analyser.disconnect();graph.mute.disconnect();
    }
    if(context&&context.state!=='closed')context.close().catch(()=>{});
    context=null;stream=null;graph=null;mode='off';level=0;loud=false;overSince=0;underSince=0;latestPaint=0;
    note=message;offerBrowserLink=showLink;
  }
  function paint(){
    const bar=document.querySelector('#sound-meter');
    if(!bar)return;
    const t=selectedTarget(), measured=mode==='live';
    const value=measured?Math.round(level):0;
    bar.style.setProperty('--level',value+'%');
    bar.style.setProperty('--target',t+'%');
    const state=measured?(loud?'above':'within'):'idle';
    const scene=document.querySelector('#listening-scene');
    if(scene.dataset.soundState!==state){
      scene.dataset.soundState=state;
      scene.querySelector('.listening-characters').setAttribute('aria-label',state==='above'?sadDescription:calmDescription);
    }
    if(measured){bar.setAttribute('aria-valuenow',String(value));bar.removeAttribute('aria-hidden');}
    else {bar.removeAttribute('aria-valuenow');bar.setAttribute('aria-hidden','true');}
    const states={off:'Microphone off',asking:'Waiting for permission',resume:'Audio paused',muted:'Microphone muted',live:'Microphone on'};
    const prompts={off:note?'Check microphone access':'Ready to listen',asking:'Allow microphone access',resume:'Enable live audio',muted:'Waiting for sound input'};
    document.querySelector('#sound-value').textContent=measured?String(value):'–';
    document.querySelector('#sound-source').textContent=states[mode];
    const prompt=measured?(loud?'Lower your voices':'Within target'):prompts[mode];
    const feedback=document.querySelector('#sound-feedback');
    if(feedback.textContent!==prompt)feedback.textContent=prompt;
    const statusNote=document.querySelector('#sound-note');
    const status=measured&&shhUnavailable?'Live meter on. Restart the microphone to reload the “Shh!” sound.':note;
    if(statusNote.textContent!==status)statusNote.textContent=status;
  }
  function policyBlocksMic(){
    const policy=document.permissionsPolicy||document.featurePolicy;
    try{return policy?.allowsFeature('microphone')===false;}catch{return false;}
  }
  function fail(message,showLink=false){stop(message,showLink);render();}
  function permissionFailure(error){
    const embedded=window.top!==window.self;
    if(policyBlocksMic()){
      return fail(embedded?'This preview blocks microphone access. Open the published monitor in your browser, then tap Start microphone.':'This page’s hosting settings block microphone access.',embedded);
    }
    if(error.name==='NotAllowedError'||error.name==='PermissionDeniedError'||error.name==='SecurityError'){
      if(embedded)return fail('This preview did not receive microphone permission. Open the published monitor in Safari or Chrome and tap Start microphone.',true);
      const iphone=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
      return fail(iphone?'Open this monitor in Safari. In the page menu, open website settings and set Microphone to Ask or Allow. Then tap Start microphone again.':'Open the site permissions beside your browser’s address bar, allow the microphone for this site, then tap Start microphone again.',true);
    }
    if(error.name==='NotFoundError'||error.name==='DevicesNotFoundError')return fail('No microphone was found. Connect or enable a microphone, then try again.');
    if(error.name==='NotReadableError'||error.name==='TrackStartError'||error.name==='AbortError')return fail('The microphone could not supply audio. Close other apps using it, check your input device, then try again.');
    fail('The audio input could not start. Check your selected microphone, then try again.');
  }
  function sample(now){
    if(mode!=='live'||!graph)return;
    if(now<listenAgain){frame=requestAnimationFrame(sample);return;}
    const {analyser,samples}=graph;
    analyser.getFloatTimeDomainData(samples);
    let sum=0;
    for(const amplitude of samples)sum+=amplitude*amplitude;
    const rms=Math.sqrt(sum/samples.length);
    const signal=Math.max(0,Math.min(100,(20*Math.log10(Math.max(rms,.00001))+65)*2));
    level=level*.8+signal*.2;
    const ceiling=selectedTarget();
    if(level>ceiling){
      underSince=0;
      if(!overSince)overSince=now;
      if(now-overSince>=950){
        loud=true;
        if(now>=nextReminder)playShh(now);
      }
    }else{
      overSince=0;
      if(!underSince)underSince=now;
      if(now-underSince>=600)loud=false;
    }
    if(now-latestPaint>120){paint();latestPaint=now;}
    frame=requestAnimationFrame(sample);
  }
  function syncInput(){
    if(!graph||!stream||document.hidden)return;
    const track=stream.getAudioTracks()[0];
    if(!track||track.readyState==='ended')return fail('Microphone disconnected. Reconnect it and tap Start microphone.');
    const next=context.state!=='running'?'resume':track.muted?'muted':'live';
    if(next===mode)return;
    cancelAnimationFrame(frame);
    if(next!=='live'){stopShh();listenAgain=0;}
    mode=next;level=0;loud=false;overSince=0;underSince=0;latestPaint=0;
    note=next==='resume'?'Microphone permission is granted. Tap Resume live audio to activate the sound meter.':next==='muted'?'Your browser has paused microphone input. Check your device’s microphone or restart it.':'Sound is measured on this device. Audio is never recorded or sent.';
    render();
    if(next==='live')frame=requestAnimationFrame(sample);
  }
  function resume(){
    if(!context||!graph)return;
    const token=attempt;
    context.resume().then(()=>{if(token===attempt)syncInput();}).catch(()=>{
      if(token===attempt)fail('Live audio could not resume. Tap Start microphone to reconnect.');
    });
  }
  async function start(){
    stop();const token=attempt;
    if(policyBlocksMic())return permissionFailure({name:'SecurityError'});
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!window.isSecureContext||!Audio||!navigator.mediaDevices?.getUserMedia){
      return fail('This view does not offer microphone access. Open the published monitor in Safari or Chrome and tap Start microphone.',true);
    }
    mode='asking';note='When the browser asks to use your microphone, choose Allow.';render();
    try{
      const ctx=new Audio();context=ctx;
      // Request both operations during the Start tap. An unresolved resume
      // request must never hide a granted microphone behind the permission screen.
      ctx.resume().catch(()=>{});
      void prepareShh(ctx,token);
      promptTimer=setTimeout(()=>{
        if(token!==attempt||mode!=='asking')return;
        note='Still waiting for your browser. Check for a microphone prompt or open the published monitor directly.';
        offerBrowserLink=true;render();
      },8000);
      const mic=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});
      if(token!==attempt){mic.getTracks().forEach(track=>track.stop());return;}
      clearTimeout(promptTimer);offerBrowserLink=false;stream=mic;
      const track=mic.getAudioTracks()[0];
      if(!track)return fail('No microphone input was returned. Check the selected input device and try again.');
      const source=ctx.createMediaStreamSource(mic);
      const analyser=ctx.createAnalyser();analyser.fftSize=2048;
      const mute=ctx.createGain();mute.gain.value=0;
      // Keep the graph connected to a silent output so audio is processed without feedback.
      source.connect(analyser);analyser.connect(mute);mute.connect(ctx.destination);
      graph={source,analyser,mute,samples:new Float32Array(analyser.fftSize)};
      const changed=()=>{if(token===attempt)syncInput();};
      track.addEventListener('mute',changed);track.addEventListener('unmute',changed);
      track.addEventListener('ended',changed);ctx.onstatechange=changed;
      if(document.hidden){
        track.enabled=false;
        hiddenTimer=setTimeout(()=>{if(token===attempt&&document.hidden)fail('Microphone paused while the page was hidden.');},3500);
      }else syncInput();
      if(ctx.state!=='running')resume();
    }catch(error){if(token===attempt)permissionFailure(error);}
  }
  function controls(){
    const openLink=(offerBrowserLink||window.top!==window.self)?'<a class="btn light" target="_blank" rel="noopener noreferrer" href="'+liveUrl+'">Open published monitor</a>':'';
    if(mode==='off')return btn('mic-start','Start microphone','mic','btn primary')+btn('shh-preview','Preview “Shh!”','','btn light')+openLink;
    if(mode==='resume')return btn('mic-resume','Resume live audio','mic','btn primary')+btn('mic-stop','Stop microphone','x','btn light');
    return btn('mic-stop',mode==='asking'?'Cancel':'Stop microphone','x','btn light')+openLink;
  }
  function refresh(){
    overSince=0;underSince=0;
    if(mode!=='live'||level<=selectedTarget())loud=false;
    paint();
  }
  function page(c){
    const chosen=currentStage(c), value=target(c);
    const stageButtons=Club.stages.map(stage=>btn('noise-stage',stage.name,'','stage-option',
      'data-stage="'+stage.id+'" aria-pressed="'+(stage.id===chosen.id)+'"')).join('');
    const stageOptions=Club.stages.map(stage=>'<option value="'+stage.id+'" '+(stage.id===chosen.id?'selected':'')+'>'+stage.name+'</option>').join('');
    const keepSettingsOpen=document.querySelector('#voice-adjustment')?.open;
    return `<section class="noise-page">
      <div class="page-head"><div><div class="context">${ic('school',17)}${escapeHtml(c.name)}</div><h1>Noise monitor</h1></div>
        ${btn('fullscreen',projectLabel(),'full','btn light')}</div>
      <div class="monitor-setup">
        <div class="stage-field"><span id="lesson-stage-label">Lesson stage</span>
          <div class="stage-options" role="group" aria-labelledby="lesson-stage-label">${stageButtons}</div>
          <label class="compact-stage"><select id="mobile-stage" aria-labelledby="lesson-stage-label">${stageOptions}</select>${ic('down',16)}</label>
        </div>
        <div class="noise-buttons">${controls()}</div>
        <p id="sound-note" role="status"></p>
      </div>
      <div id="listening-scene" class="listening-scene" data-sound-state="idle">
        <div class="listening-characters" role="img" aria-label="${calmDescription}">
          <span class="pet-floor" aria-hidden="true"></span>
          <img class="listening-pose girl-pose calm-pose" src="assets/monitor-girl-calm.webp?v=2" alt="" draggable="false">
          <img class="listening-pose girl-pose sad-pose" src="assets/monitor-girl-sad.webp?v=2" alt="" draggable="false">
          <img class="listening-pose kitten-pose calm-pose" src="assets/monitor-kitten-calm.webp" alt="" draggable="false">
          <img class="listening-pose kitten-pose sad-pose" src="assets/monitor-kitten-ears.webp?v=2" alt="" draggable="false">
          <img class="listening-pose boy-pose calm-pose" src="assets/monitor-child-calm.webp?v=2" alt="" draggable="false">
          <img class="listening-pose boy-pose sad-pose" src="assets/monitor-child-sad.webp?v=2" alt="" draggable="false">
        </div>
        <div class="listening-copy">
          <div class="sound-source">${ic('mic',17)}<span id="sound-source"></span></div>
          <h2 id="sound-feedback" role="status"></h2>
          <p class="current-cue"><b>${chosen.name}</b><span>${chosen.cue}</span></p>
        </div>
        <div class="monitor-readout">
          <div class="noise-numbers">
            <div><span>Live level</span><strong id="sound-value"></strong></div>
            <div><span>Voice target</span><strong id="target-reading">${value}</strong></div>
          </div>
          <div id="sound-meter" role="meter" aria-label="Relative classroom sound level" aria-valuemin="0" aria-valuemax="100"><i></i><b></b></div>
          <div class="meter-key"><span>0 · Quiet</span><span>100 · Loud</span></div>
          <p class="shh-hint">A soft “Shh!” plays when voices stay above the target.</p>
        </div>
      </div>
      <details id="voice-adjustment"${keepSettingsOpen?' open':''}>
        <summary>${ic('settings',18)}Adjust voice target${ic('down',16)}</summary>
        <div class="target-settings">
          <label for="noise-target">Target for ${chosen.name.toLowerCase()} <output id="adjusted-target" for="noise-target">${value}</output></label>
          <input id="noise-target" type="range" min="5" max="95" value="${value}" aria-describedby="target-help">
          <div class="target-meta"><p id="target-help">The suggested level is ${chosen.target} out of 100. Adjust for your room and microphone.</p>
          ${btn('restore-target','Use suggested level','','btn light',value===chosen.target?'disabled':'')}</div>
        </div>
      </details>
    </section>`;
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      // A phone's permission sheet can briefly hide the document during startup.
      if(mode==='live'||mode==='resume'||mode==='muted')fail('Microphone paused while the page was hidden.');
    }else if(graph&&stream){
      clearTimeout(hiddenTimer);
      stream.getAudioTracks().forEach(track=>{track.enabled=true;});
      syncInput();
    }
  });
  window.addEventListener('pagehide',()=>stop());
  return {page,paint,refresh,start,resume,stop,previewShh};
})();
