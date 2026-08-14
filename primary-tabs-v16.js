(()=>{
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];

  function initPrimaryTabs(){
    if(q('#primaryTabs')) return;
    const hero=q('.hero');
    const tripStrip=q('.trip-strip');
    const main=q('#daysContainer');
    const guide=q('#travelGuide');
    const tools=q('#tripControlCenter');
    const atlas=q('.atlas');
    if(!hero || !tripStrip || !main || !guide || !tools || !atlas) return;

    const actions=q('.topbar .actions');
    const topbar=q('.topbar');
    if(actions){
      actions.classList.add('hero-tools');
      const frame=q('.hero-frame',hero) || hero;
      frame.appendChild(actions);
    }
    if(topbar) topbar.classList.add('primary-topbar-hidden');
    const editorNote=q('.editor-note');
    if(editorNote) editorNote.style.display='none';

    const nav=document.createElement('nav');
    nav.id='primaryTabs';
    nav.className='primary-tabs';
    nav.setAttribute('aria-label','主要內容分頁');
    nav.innerHTML=`
      <button class="primary-tab active" type="button" data-primary="itinerary" aria-selected="true">行程</button>
      <button class="primary-tab" type="button" data-primary="guide" aria-selected="false">攻略</button>
      <button class="primary-tab" type="button" data-primary="tools" aria-selected="false">即時工具</button>
      <button class="primary-tab" type="button" data-primary="pokemon" aria-selected="false">Pokémon Card</button>`;
    hero.insertAdjacentElement('afterend',nav);

    const guidePage=document.createElement('section');
    guidePage.className='primary-page'; guidePage.dataset.primaryPage='guide';
    const toolsPage=document.createElement('section');
    toolsPage.className='primary-page'; toolsPage.dataset.primaryPage='tools';
    const pokemonPage=document.createElement('section');
    pokemonPage.className='primary-page'; pokemonPage.dataset.primaryPage='pokemon';

    main.insertAdjacentElement('afterend',guidePage);
    guidePage.insertAdjacentElement('afterend',toolsPage);
    toolsPage.insertAdjacentElement('afterend',pokemonPage);
    guidePage.appendChild(guide);
    toolsPage.appendChild(tools);
    pokemonPage.appendChild(atlas);

    tripStrip.dataset.primaryPage='itinerary';
    main.dataset.primaryPage='itinerary';
    tripStrip.classList.add('primary-page','active');
    main.classList.add('primary-page','active');

    qa('#daysContainer > .travel-guide, #daysContainer > .ops-center, #daysContainer > .atlas').forEach(el=>el.remove());

    const pages=()=>qa('[data-primary-page]');
    const tabs=()=>qa('#primaryTabs .primary-tab');
    const setPage=(name,scroll=true)=>{
      tabs().forEach(btn=>{
        const on=btn.dataset.primary===name;
        btn.classList.toggle('active',on);
        btn.setAttribute('aria-selected',on?'true':'false');
      });
      pages().forEach(page=>page.classList.toggle('active',page.dataset.primaryPage===name));
      try{sessionStorage.setItem('kansai-primary-tab',name)}catch(e){}
      if(scroll){
        const top=nav.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({top:Math.max(0,top-4),behavior:'smooth'});
      }
    };

    tabs().forEach(btn=>btn.addEventListener('click',()=>setPage(btn.dataset.primary,true)));
    let initial='itinerary';
    try{initial=sessionStorage.getItem('kansai-primary-tab')||'itinerary'}catch(e){}
    if(!['itinerary','guide','tools','pokemon'].includes(initial)) initial='itinerary';
    setPage(initial,false);

    const hashMap={'#itinerary':'itinerary','#guide':'guide','#tools':'tools','#pokemon':'pokemon'};
    if(hashMap[location.hash]) setPage(hashMap[location.hash],false);
  }

  const css=`
  <style id="primary-tabs-v16-style">
    .primary-topbar-hidden{display:none!important}
    .hero-frame{position:relative}
    .hero-tools{position:absolute;right:18px;top:14px;z-index:5;display:flex!important;gap:6px!important;align-items:center}
    .hero-tools .topbtn{background:rgba(255,255,255,.8)!important;color:#292622!important;border:1px solid rgba(42,37,31,.13)!important;padding:7px 10px!important;font-size:9px!important;box-shadow:none!important}
    .hero-tools #downloadBtn,.hero-tools #resetBtn{display:none!important}

    .primary-tabs{width:min(1320px,calc(100% - 32px));margin:10px auto 0;display:grid;grid-template-columns:repeat(4,1fr);position:sticky;top:0;z-index:95;background:rgba(244,240,234,.96);backdrop-filter:blur(14px);border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:0 8px 22px rgba(28,23,18,.05)}
    .primary-tab{appearance:none;border:0;border-right:1px solid var(--line);border-radius:0!important;background:transparent!important;color:var(--ink)!important;margin:0!important;padding:14px 12px!important;font:700 13px/1 var(--sans)!important;letter-spacing:.01em;cursor:pointer;position:relative}
    .primary-tab:last-child{border-right:0}
    .primary-tab:hover{background:rgba(255,255,255,.55)!important}
    .primary-tab.active{background:#fff!important;color:var(--wine)!important}
    .primary-tab.active:after{content:"";position:absolute;left:15%;right:15%;bottom:0;height:2px;background:var(--wine)}

    [data-primary-page]{display:none!important}
    [data-primary-page].active{display:block!important}
    .trip-strip[data-primary-page]{width:min(1320px,calc(100% - 32px));margin:16px auto 0}
    #daysContainer[data-primary-page]{padding-top:14px}
    section.primary-page{width:min(1320px,calc(100% - 32px));margin:16px auto 50px}
    section.primary-page>.travel-guide,section.primary-page>.ops-center,section.primary-page>.atlas{margin-top:0!important}

    .hero{padding-top:12px!important}
    .hero-frame{border-radius:20px!important}
    .hero-copy{padding-top:24px!important;padding-bottom:22px!important}

    @media(max-width:720px){
      .shell{width:min(100% - 20px,1320px)!important}
      .hero{padding:8px 0 0!important}
      .hero-frame{border-radius:18px!important}
      .hero-copy{padding:22px 17px 16px!important}
      .hero-copy h1{font-size:37px!important;line-height:1!important;margin:0!important}
      .hero-desc{font-size:10px!important;margin-top:7px!important}
      .hero-flight{padding:11px 16px 13px!important}
      .flight-label{font-size:8px!important}
      .flight-row{padding:7px 0!important;gap:6px 10px!important}
      .flight-route{font-size:15px!important}
      .flight-data .fkey{font-size:7px!important}.flight-data .fval{font-size:10px!important}
      .hero-tools{position:static!important;justify-content:flex-end!important;padding:0 14px 10px!important;background:transparent!important}
      .hero-tools .topbtn{padding:6px 9px!important;font-size:8px!important}

      .primary-tabs{width:100%;margin:8px 0 0;border-left:0;border-right:0;border-radius:0;grid-template-columns:repeat(4,minmax(0,1fr));box-shadow:0 5px 16px rgba(28,23,18,.05)}
      .primary-tab{padding:13px 4px!important;font-size:11px!important;white-space:nowrap}
      .primary-tab[data-primary="pokemon"]{font-size:10px!important}
      .primary-tab.active:after{left:18%;right:18%}

      .trip-strip[data-primary-page]{width:calc(100% - 20px);margin:12px auto 0;border-radius:20px}
      .strip-head{padding:12px 13px!important}.side-label{font-size:8px!important}.progress-wrap{min-width:0!important;gap:7px!important}.progress-label{display:none!important}.progress-num{font-size:13px!important;min-width:29px!important}
      .day-tabs{display:flex!important;overflow-x:auto!important;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}.day-tabs::-webkit-scrollbar{display:none}
      .day-tab{min-width:58vw!important;scroll-snap-align:start;padding:15px 14px 17px!important;min-height:96px!important}.tab-date{font-size:23px!important}.tab-title{font-size:10px!important;margin-top:6px!important}.tab-note{font-size:9px!important}
      #daysContainer[data-primary-page]{padding:12px 10px 36px!important}
      section.primary-page{width:calc(100% - 20px);margin:12px auto 36px}
      .guide-hero,.ops-hero{border-radius:20px!important}
      .guide-hero h2,.ops-hero h2{font-size:30px!important}
      .atlas-head{padding-top:8px!important}
      .atlas-head h2{font-size:28px!important}
    }
  </style>`;
  document.head.insertAdjacentHTML('beforeend',css);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(initPrimaryTabs,0));
  else setTimeout(initPrimaryTabs,0);
})();
