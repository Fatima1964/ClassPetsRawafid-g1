'use strict';
const mammalCoats=(()=>{
  // Landmarks follow the illustrated portraits, measured on a 220 × 211 guide.
  // All paths passed to the renderer use the original 384 × 368 canvas.
  function mapPath(path,project){
    return path.replace(/(-?[\d.]+),(-?[\d.]+)/g,(_,x,y)=>{
      const [px,py]=project(Number(x),Number(y));
      return (px*384/220).toFixed(1)+','+(py*368/211).toFixed(1);
    });
  }
  const portrait=path=>mapPath(path,(x,y)=>[x,y]);
  function oval(x,y,rx,ry){
    const p=(u,v)=>(x+rx*u)+','+(y+ry*v);
    return 'M'+p(1,0)+' C'+p(1,.55)+' '+p(.55,1)+' '+p(0,1)+' C'+p(-.55,1)+' '+p(-1,.55)+' '+p(-1,0)+' C'+p(-1,-.55)+' '+p(-.55,-1)+' '+p(0,-1)+' C'+p(.55,-1)+' '+p(1,-.55)+' '+p(1,0)+'Z ';
  }
  const ovals=points=>points.map(p=>oval(...p)).join(' ');

  function features(eyes){
    const [left,top,right,bottom]=eyes;
    const mx=(left+right)/2,my=(top+bottom)/2;
    const dx=(right-left)/2,dy=(bottom-top)/2;
    const face=path=>mapPath(path,(x,y)=>[mx+dx*x-dy*y,my+dy*x+dx*y]);
    const blaze=face('M-.55,-2.95 Q-.85,-2.13 -.45,-1.48 Q-.12,-.94 -.22,-.38 Q-.31,.14 -.55,.66 Q-.16,.89 .42,.68 Q.16,.27 .2,-.19 Q.38,-.9 .63,-1.29 Q1.03,-2.07 .38,-2.94Z');
    const cheekSpots=face(ovals([[-1.69,.37,.31,.22],[-1.38,.67,.18,.17],[1.60,.44,.3,.24],[1.29,.73,.18,.14],[-.52,-1.21,.22,.22],[.13,-1.67,.3,.26],[.69,-1.18,.22,.18]]));
    const brow=face('M-2.38,-.68 Q-1.66,-1.2 -.86,-.85 Q-.61,-.7 -.71,-.51 Q-1.59,-.77 -2.12,-.38Z M2.24,-.81 Q1.39,-1.19 .81,-.84 L.72,-.49 Q1.45,-.81 2.1,-.47Z');
    const cap=face('M-2.87,-2.9 L2.63,-2.95 Q2.45,-1.97 1.95,-1.30 Q1.57,-.84 1.01,-.63 Q.65,-.49 .43,-.11 Q.20,-.10 .13,-.58 Q-.03,-1.08 -.29,-1.32 Q-.65,-.72 -1.10,-.62 Q-1.99,-.73 -2.64,-.25Z');
    return {blaze,cheekSpots,brow,cap,eyeMask:face(ovals([[-1,0,.35,.38],[1,0,.35,.38]]))};
  }
  function kitten(pose){
    const {blaze,cheekSpots,brow,cap,eyeMask}=features(pose.eyes);
    const chest=portrait(pose.chest),feet=portrait(pose.feet),patch=portrait(pose.patch);
    return {
      protect:eyeMask+portrait(pose.mouth),
      marks:[null,
        {light:blaze+feet},
        {dark:cheekSpots+portrait(ovals(pose.spots)),light:chest},
        {light:feet+chest,dark:cap},
        {dark:patch+blaze,light:brow},
        {dark:portrait(pose.ears)+feet,light:cap}
      ]
    };
  }
  const kittenPoses=[
    {eyes:[106,79,143,66],mouth:oval(131,88,10,8)+oval(133,98,13,9),
     ears:'M44,34 Q76,27 91,50 L77,66 Q55,68 44,34Z M126,29 Q128,-2 149,0 L167,37 Q151,29 141,32Z',chest:'M83,116 Q100,125 122,112 Q143,100 155,100 Q150,120 138,130 Q130,141 122,155 Q113,144 109,146 Q87,136 83,116Z',
     feet:'M66,166 Q76,171 78,181 Q91,175 105,180 L111,205 L57,205Z M111,165 Q125,170 137,166 L151,204 L111,204Z M150,102 Q164,106 178,101 L201,119 L171,140 L156,130Z',patch:'M25,133 Q71,111 90,119 Q104,127 94,143 Q87,153 94,160 Q87,170 72,176 Q51,169 28,180Z',spots:[[78,139,9,8],[94,152,7,6],[70,164,8,7],[109,138,6,5]]},
    {eyes:[108,74,149,66],mouth:oval(132,84,10,6)+oval(132,91,11,5),
     ears:'M53,10 Q75,5 94,34 L81,49 Q65,47 53,10Z M131,24 Q147,-5 166,0 L170,34 Q150,23 139,32Z',chest:'M91,110 Q110,119 130,108 Q144,100 157,100 Q155,119 148,129 Q132,140 124,157 Q107,145 100,137Z',
     feet:'M77,168 Q89,176 106,168 L114,204 L72,204Z M113,168 Q126,174 139,168 L145,207 L108,207Z M146,168 Q160,171 176,167 L177,205 L143,205Z',patch:'M36,136 Q56,107 91,115 Q108,120 104,133 Q98,143 106,149 Q103,170 84,177 L38,174Z',spots:[[84,133,9,6],[94,157,8,7],[73,158,7,7],[107,145,5,5]]},
    {eyes:[92,75,122,59],mouth:oval(119,75,8,6)+oval(120,82,11,6),
     ears:'M15,41 Q37,35 62,55 Q52,63 47,77 Q30,74 15,41Z M83,25 Q82,2 98,-1 L122,35 Q103,28 95,38Z',chest:'M85,117 Q108,115 126,96 L139,95 Q134,119 119,131 Q111,147 99,160 Q98,137 89,135Z',
     feet:'M49,168 Q63,175 80,167 L88,201 L49,207Z M83,167 Q101,173 115,166 L120,205 L81,205Z M121,174 Q131,168 147,171 L151,199 L114,204Z',patch:'M129,102 Q155,89 177,122 Q160,126 163,138 Q164,155 146,157 Q156,164 143,176 Q120,171 115,158 Q106,146 119,127Z',spots:[[148,126,9,9],[159,144,6,7],[139,151,9,8],[124,134,6,6]]},
    {eyes:[105,76,140,59],mouth:oval(129,81,10,7)+oval(131,91,12,9),
     ears:'M40,39 Q63,29 89,45 Q74,58 66,67 Q51,68 40,39Z M115,21 Q123,0 142,0 L160,31 Q142,25 132,35Z',chest:'M74,115 Q100,127 121,111 Q138,97 155,102 Q152,125 140,131 Q131,137 124,158 Q113,145 103,144 Q85,140 74,115Z',
     feet:'M77,167 Q89,170 103,166 L109,204 L71,205Z M113,170 Q127,176 139,171 L144,209 L107,209Z M144,166 Q159,171 175,163 L177,202 L142,203Z',patch:'M43,135 Q62,106 86,117 Q102,124 96,136 Q89,151 102,161 Q90,181 66,176 Q50,165 37,175Z',spots:[[77,135,9,7],[68,155,8,7],[91,155,6,7],[99,140,5,5]]},
    {eyes:[118,68,155,56],mouth:oval(145,76,9,6)+oval(147,84,10,5),
     ears:'M45,26 Q73,18 94,41 Q82,52 73,65 Q58,60 45,26Z M135,23 Q139,-3 156,-1 L175,30 Q158,23 148,33Z',chest:'M85,111 Q109,120 132,105 Q146,97 158,98 Q153,118 143,128 Q135,137 125,151 Q116,139 105,137 Q92,129 85,111Z',
     feet:'M66,169 Q82,173 100,168 L107,204 L61,204Z M110,166 Q123,170 136,165 L142,204 L107,204Z M157,108 Q172,113 187,106 L206,121 L182,141 L162,131Z',patch:'M34,150 Q50,116 85,116 Q100,117 100,132 Q89,144 96,154 Q85,169 66,180 Q54,171 36,177Z',spots:[[79,139,9,9],[69,160,8,7],[91,159,7,7],[103,142,5,5]]},
    {eyes:[72,58,108,73],mouth:oval(85,79,8,6)+oval(85,87,11,7),
     ears:'M47,24 Q48,0 66,-1 L89,27 Q74,24 60,38Z M126,43 Q156,17 169,36 Q166,58 146,71 L132,57Z',chest:'M51,99 Q65,99 80,109 Q102,118 129,109 Q126,127 106,141 Q95,147 87,159 Q82,145 68,134 Q56,126 51,99Z',
     feet:'M45,170 Q58,169 73,172 L83,207 L39,202Z M76,165 Q87,174 103,170 L107,209 L72,207Z M109,173 Q126,167 139,171 L149,202 L103,206Z',patch:'M118,113 Q150,108 169,139 Q157,145 164,158 Q144,180 122,174 Q113,161 115,151 Q101,136 118,113Z',spots:[[132,134,9,8],[146,150,8,7],[125,157,8,8],[113,140,5,5]]}
  ];

  const puppy=features([101,55,142,49]),rabbit=features([90,88,132,85]),foal=features([55,68,103,70]);
  const puppyEars=portrait('M51,45 Q58,18 87,14 Q96,21 86,42 Q80,53 86,69 Q92,88 77,108 Q60,122 44,103 Q35,84 51,45Z M151,18 Q176,18 194,42 Q216,75 196,102 Q180,114 170,94 Q163,71 161,53 Q157,33 151,18Z');
  const puppyFeet=portrait('M47,155 Q61,160 76,157 Q84,166 83,192 L49,207 L40,199Z M77,162 Q91,167 107,161 L117,205 L69,208Z M128,160 Q144,165 159,158 L170,206 L123,208Z M157,158 Q168,162 182,155 L191,200 L161,205Z');
  const puppySaddle=portrait('M47,105 Q74,96 97,103 Q100,114 90,124 Q83,131 91,138 Q92,153 71,165 Q56,169 41,162Z M143,101 Q164,99 179,119 L184,149 Q169,151 162,140 Q159,132 149,132 Q136,122 143,101Z');
  const puppyBib=portrait('M84,94 Q103,106 126,101 Q143,97 158,88 Q159,109 150,120 Q136,125 127,150 Q121,156 116,161 Q109,146 99,138 Q84,120 84,94Z');
  const puppySpots=portrait(ovals([[66,65,10,8],[72,84,6,7],[74,111,9,8],[87,133,10,8],[66,145,8,10],[60,163,6,5],[148,129,7,8],[158,147,6,5]]));
  const rabbitEars=portrait('M54,7 Q60,-5 73,1 Q94,10 101,47 Q104,58 101,68 L79,74 Q71,60 57,37 Q49,19 54,7Z M128,63 Q126,42 141,17 Q157,-4 171,-1 Q179,8 171,30 Q164,51 146,67 L135,74Z');
  const rabbitFeet=portrait('M61,167 Q73,173 86,166 L93,203 L59,204Z M84,166 Q95,173 110,166 L113,204 L81,203Z M113,165 Q124,172 138,165 L143,203 L109,203Z M137,168 Q149,173 161,165 L167,201 L134,203Z');
  const rabbitBib=portrait('M83,119 Q112,134 138,119 Q136,139 128,146 Q121,153 113,173 Q104,160 96,154 Q85,143 83,119Z');
  const rabbitSaddle=portrait('M55,131 Q73,115 91,120 Q100,130 92,141 Q84,149 89,159 Q82,172 63,180 L51,173Z M136,120 Q155,121 167,148 Q162,159 144,161 Q129,154 136,143 Q143,135 136,120Z');
  const rabbitSpots=portrait(ovals([[73,136,8,7],[81,150,6,5],[67,160,6,7],[144,138,8,7],[150,154,6,6],[78,39,6,9],[150,38,7,8]]));
  const foalMane=portrait('M40,61 Q34,47 31,48 Q33,36 42,25 Q49,11 65,11 Q83,3 99,18 Q105,22 108,28 Q93,22 78,33 Q65,37 55,51 Q47,58 40,61Z M108,26 Q125,27 127,56 Q127,70 121,80 Q120,96 129,112 Q126,122 134,131 Q114,124 110,111 Q107,99 111,88 Q117,55 108,26Z M170,133 Q199,136 200,158 Q208,180 196,190 Q184,199 164,191 Q184,177 178,166 Q174,153 170,154Z');
  const foalFeet=portrait('M26,138 Q38,143 53,146 Q57,159 50,170 L14,177Z M66,143 Q84,150 96,144 L91,173 L55,175Z M128,142 Q145,149 159,143 L160,166 L118,176Z');
  const foalFlank=portrait('M105,105 Q119,111 131,108 Q139,116 132,127 Q127,139 114,144 Q99,145 93,136 Q88,126 97,115Z M153,112 Q176,107 188,136 L187,153 Q177,162 166,157 Q158,154 149,156 Q135,149 143,139 Q151,128 146,120Z');
  const foalDapples=portrait(ovals([[118,123,9,8],[135,132,10,8],[151,121,8,7],[161,137,9,8],[147,149,8,6],[112,144,7,6],[127,154,6,5],[55,109,7,7]]));
  const foalStar=portrait('M83,45 Q80,41 73,41 Q80,37 83,28 Q85,35 93,38 Q89,42 85,49Z');
  const foalBib=portrait('M52,104 Q67,108 84,101 Q92,97 98,91 Q99,110 93,120 Q81,125 72,142 Q63,133 58,127 Q48,116 52,104Z');
  const palette=(base,accent)=>({base,accent});

  return {
    kitten:{
      paletteNames:['Ginger tabby','Silver tabby','Tuxedo','Cream','Calico','Siamese'],
      markingNames:['Classic','Blaze','Spotted','Mittens','Saddle patch','Tipped ears'],
      palettes:Array(6).fill(null),anatomy:kittenPoses.map(kitten)
    },
    puppy:{
      paletteNames:['Golden','Cream','Chocolate','Blue-gray','Copper','Black and tan'],
      markingNames:['Classic','Blaze','Dappled','White socks','Saddle patch','Capped'],
      palettes:[null,
        palette(['#654f43','#d9c9ae','#fff9e9'],['#604b40','#baaa94','#f0e4cf']),
        palette(['#140e0e','#62372d','#b77c5e'],['#0f0b0c','#422a25','#925d45']),
        palette(['#15171e','#58677c','#c5cbd2'],['#11141c','#404b62','#929fb1']),
        palette(['#39201b','#ba532c','#f2b074'],['#2c1817','#9b462d','#e19a65']),
        palette(['#090b0d','#242328','#605b55'],['#4d2e20','#ad7044','#e5ab76'])
      ],
      anatomy:{accent:puppyEars,protect:puppy.eyeMask+portrait(oval(127,66,9,6)+'M112,80 Q122,86 139,75 Q143,77 141,84 Q137,94 131,96 Q120,97 114,90Z'),marks:[
        null,{light:puppy.blaze},
        {dark:puppy.cheekSpots+puppySpots,light:puppyBib},
        {light:puppyFeet+puppyBib,dark:puppy.brow},
        {dark:puppySaddle,light:puppy.blaze},
        {dark:puppy.cap+puppyEars,light:puppyFeet}
      ]}
    },
    rabbit:{
      paletteNames:['Pebble','Snow','Cinnamon','Blue-gray','Cocoa','Honey'],
      markingNames:['Classic','Blaze','Speckled','Dutch bib','Butterfly patch','Tipped ears'],
      palettes:[null,
        palette(['#796768','#e8ddd2','#fffdf3'],['#62494a','#bfa6a3','#fbdfd4']),
        palette(['#4c2821','#b96943','#f0b783'],['#392323','#a36257','#e8ae98']),
        palette(['#18202c','#5a727f','#c9d3d3'],['#23202b','#796d7b','#c7afbb']),
        palette(['#160f12','#5a3635','#aa7865'],['#211117','#75474a','#c99187']),
        palette(['#623e26','#c39952','#f6d99d'],['#483222','#b6896f','#f0c9b4'])
      ],
      anatomy:{accent:rabbitEars,protect:rabbit.eyeMask+portrait(oval(114,101,5,3.7)+oval(114,108,4.2,5)),marks:[
        null,{light:rabbit.blaze+rabbitBib},
        {dark:rabbit.cheekSpots+rabbitSpots,light:rabbitFeet},
        {light:rabbitBib+rabbitFeet,dark:rabbit.cap},
        {dark:rabbitSaddle+rabbit.blaze,light:rabbit.brow},
        {dark:rabbitEars,light:rabbit.cap+rabbitFeet}
      ]}
    },
    foal:{
      paletteNames:['Chestnut','Palomino','Black','Steel gray','Bay','Ivory'],
      markingNames:['Classic','Blaze','Dappled','High socks','Pinto','Forehead star'],
      palettes:[null,
        palette(['#644027','#bd894a','#efc77f'],['#774d33','#e5c69b','#fff0c9']),
        palette(['#06090c','#23282c','#696b67'],['#050508','#1a1c20','#514d4a']),
        palette(['#272a33','#84909a','#d6d7d2'],['#14161e','#444650','#939095']),
        palette(['#432023','#8f4430','#d18b60'],['#08080c','#252026','#5f4d4b']),
        palette(['#6c5652','#d8ccbc','#fff8e7'],['#534842','#998c7b','#d8c9ad'])
      ],
      anatomy:{accent:foalMane,protect:foal.eyeMask+portrait(oval(65,89,3.8,4.5)+oval(90,89,3.8,4.5)),marks:[
        null,{light:foal.blaze+foalFeet},
        {light:foalDapples,dark:foal.cheekSpots},
        {light:foalFeet+foalBib,dark:foal.cap},
        {light:foalFlank,dark:foalBib+foal.blaze},
        {light:foalStar,dark:foalMane+foalFeet}
      ]}
    }
  };
})();
