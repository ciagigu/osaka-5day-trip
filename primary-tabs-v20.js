(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  let attempts=0;

  function init(){
    const hero=$('.hero');
    const tripStrip=$('.trip-strip');
    const days=$('#daysContainer');
    const guide=$('#travelGuide');
    const tools=$('#tripControlCenter');
    const atlas=$('.atlas');
    if(!hero || !tripStrip || !days || !guide || !tools || !atlas){
      if(attempts++<30) setTimeout(init,100);
      return;
    }

    $('#primaryTabs')?.remove();
    $$('[data-primary-wrapper="true"]').forEach(el=>{
      while(el.firstChild) el.parentNode.insertBefore(el.firstChild,el);
      el.remove();
    });

    const topbar=$('.topbar');
    const actions=$('.topbar .actions');
    if(topbar) topbar.style.display='none';
    if(actions){
      actions.classList.add('hero-tools-v20');
      const target=$('.hero-frame',hero)||hero;
      target.appendChild(actions);
    }
    const note=$('.editor-note');
    if(note) note.style.display='none';

    const nav=document.createElement('nav');
    nav.id='primaryTabs';
    nav.className='primary-tabs-v20';
    nav.setAttribute('aria-label','主要內容分頁');
    nav.innerHTML=`
      <button type="button" class="primary-tab-v20 active" data-page="itinerary">行程</button>
      <button type="button" class="primary-tab-v20" data-page="guide">攻略</button>
      <button type="button" class="primary-tab-v20" data-page="tools">即時工具</button>
      <button type="button" class="primary-tab-v20" data-page="pokemon">Pokémon Card</button>`;
    hero.insertAdjacentElement('afterend',nav);

    const guideWrap=document.createElement('section');
    guideWrap.dataset.primaryWrapper='true';
    guideWrap.dataset.primaryPage='guide';
    guideWrap.className='primary-page-v20';
    const toolsWrap=document.createElement('section');
    toolsWrap.dataset.primaryWrapper='true';
    toolsWrap.dataset.primaryPage='tools';
    toolsWrap.className='primary-page-v20';
    const pokemonWrap=document.createElement('section');
    pokemonWrap.dataset.primaryWrapper='true';
    pokemonWrap.dataset.primaryPage='pokemon';
    pokemonWrap.className='primary-page-v20';

    days.insertAdjacentElement('afterend',guideWrap);
    guideWrap.insertAdjacentElement('afterend',toolsWrap);
    toolsWrap.insertAdjacentElement('afterend',pokemonWrap);
    guideWrap.appendChild(guide);
    toolsWrap.appendChild(tools);
    pokemonWrap.appendChild(atlas);

    tripStrip.dataset.primaryPage='itinerary';
    days.dataset.primaryPage='itinerary';
    tripStrip.classList.add('primary-page-v20');
    days.classList.add('primary-page-v20');

    function setPage(name,scroll=false){
      $$('.primary-tab-v20').forEach(btn=>btn.classList.toggle('active',btn.dataset.page===name));
      $$('.primary-page-v20').forEach(el=>{
        el.style.display=el.dataset.primaryPage===name?'block':'none';
      });
      try{sessionStorage.setItem('kansai-primary-v20',name)}catch(e){}
      if(scroll){
        const y=nav.getBoundingClientRect().top+window.scrollY-4;
        window.scrollTo({top:Math.max(0,y),behavior:'smooth'});
      }
    }

    $$('.primary-tab-v20').forEach(btn=>btn.addEventListener('click',()=>setPage(btn.dataset.page,true)));
    let initial='itinerary';
    try{initial=sessionStorage.getItem('kansai-primary-v20')||'itinerary'}catch(e){}
    if(!['itinerary','guide','tools','pokemon'].includes(initial)) initial='itinerary';
    setPage(initial,false);
  }

  const style=document.createElement('style');
  style.id='primary-tabs-v20-style';
  style.textContent=`
    .hero-frame{position:relative}
    .hero-tools-v20{position:absolute;right:18px;top:14px;z-index:5;display:flex!important;gap:6px!important;align-items:center}
    .hero-tools-v20 .topbtn{margin:0!important;background:rgba(255,255,255,.82)!important;color:#292622!important;border:1px solid rgba(42,37,31,.14)!important;padding:7px 10px!important;font-size:9px!important;box-shadow:none!important}
    .hero-tools-v20 #downloadBtn,.hero-tools-v20 #resetBtn{display:none!important}
    .primary-tabs-v20{width:min(1320px,calc(100% - 32px));margin:10px auto 0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));position:sticky;top:0;z-index:100;background:rgba(247,244,239,.97);backdrop-filter:blur(14px);border:1px solid #d8d0c7;border-radius:18px;overflow:hidden;box-shadow:0 8px 24px rgba(28,23,18,.06)}
    .primary-tab-v20{appearance:none;margin:0!important;padding:14px 8px!important;border:0!important;border-right:1px solid #d8d0c7!important;border-radius:0!important;background:transparent!important;color:#171714!important;font:700 13px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC",sans-serif!important;cursor:pointer;position:relative;white-space:nowrap}
    .primary-tab-v20:last-child{border-right:0!important}
    .primary-tab-v20.active{background:#fff!important;color:#7b252d!important}
    .primary-tab-v20.active:after{content:"";position:absolute;left:15%;right:15%;bottom:0;height:2px;background:#7b252d}
    .primary-page-v20{display:none}
    .trip-strip.primary-page-v20{width:min(1320px,calc(100% - 32px));margin:16px auto 0}
    #daysContainer.primary-page-v20{padding-top:14px}
    section.primary-page-v20{width:min(1320px,calc(100% - 32px));margin:16px auto 50px}
    section.primary-page-v20>.travel-guide,section.primary-page-v20>.ops-center,section.primary-page-v20>.atlas{margin-top:0!important}
    @media(max-width:720px){
      .hero{padding-top:8px!important}.hero-frame{border-radius:18px!important}.hero-copy{padding:22px 17px 16px!important}.hero-copy h1{font-size:37px!important;line-height:1!important;margin:0!important}.hero-desc{font-size:10px!important;margin-top:7px!important}.hero-flight{padding:11px 16px 13px!important}.flight-row{padding:7px 0!important}
      .hero-tools-v20{position:static!important;justify-content:flex-end!important;padding:0 14px 10px!important}.hero-tools-v20 .topbtn{padding:6px 9px!important;font-size:8px!important}
      .primary-tabs-v20{width:100%;margin:8px 0 0;border-left:0;border-right:0;border-radius:0;grid-template-columns:repeat(4,minmax(0,1fr));box-shadow:0 5px 16px rgba(28,23,18,.05)}
      .primary-tab-v20{padding:13px 3px!important;font-size:11px!important}.primary-tab-v20[data-page="pokemon"]{font-size:10px!important}.primary-tab-v20.active:after{left:18%;right:18%}
      .trip-strip.primary-page-v20{width:calc(100% - 20px);margin:12px auto 0;border-radius:20px}
      .day-tabs{display:flex!important;overflow-x:auto!important;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}.day-tabs::-webkit-scrollbar{display:none}.day-tab{min-width:58vw!important;scroll-snap-align:start}
      #daysContainer.primary-page-v20{padding:12px 10px 36px!important}section.primary-page-v20{width:calc(100% - 20px);margin:12px auto 36px}
    }
  `;
  document.head.appendChild(style);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  init();
})();
