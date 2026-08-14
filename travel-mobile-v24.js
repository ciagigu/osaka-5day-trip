(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  let tries=0;

  function detachFromOldWrappers(nodes){
    nodes.forEach(n=>{ if(n && n.parentElement && n.parentElement.classList.contains('travel-page')) n.remove(); });
    $$('.travel-page,[data-primary-wrapper="true"]').forEach(w=>{
      if(w.id==='daysContainer') return;
      Array.from(w.children).forEach(c=>{
        if(!nodes.includes(c)) w.parentNode?.insertBefore(c,w);
      });
      w.remove();
    });
    $('#travelDashboardNav')?.remove();
    $('#primaryTabs')?.remove();
    $('#travelMobileNav')?.remove();
    $$('.tm-page').forEach(p=>p.remove());
  }

  function setup(){
    const shell=$('.shell');
    const hero=$('.hero');
    const trip=$('.trip-strip');
    const days=$('#daysContainer');
    const guide=$('#travelGuide');
    const tools=$('#tripControlCenter');
    const atlas=$('.atlas');
    if(!shell||!hero||!trip||!days||!guide||!tools||!atlas){
      if(tries++<60) setTimeout(setup,100);
      return;
    }

    [guide,tools,atlas].forEach(n=>{ if(days.contains(n)) n.remove(); });
    detachFromOldWrappers([trip,days,guide,tools,atlas]);

    if(hero.parentElement!==shell) shell.prepend(hero);

    const nav=document.createElement('nav');
    nav.id='travelMobileNav';
    nav.setAttribute('aria-label','旅遊網站主選單');
    nav.innerHTML=`
      <button class="tm-nav-btn active" data-page="itinerary" type="button">行程</button>
      <button class="tm-nav-btn" data-page="guide" type="button">攻略</button>
      <button class="tm-nav-btn" data-page="tools" type="button">即時工具</button>
      <button class="tm-nav-btn" data-page="pokemon" type="button">Pokémon Card</button>`;
    hero.insertAdjacentElement('afterend',nav);

    const mk=(name)=>{ const s=document.createElement('section'); s.className='tm-page'; s.dataset.tmPage=name; return s; };
    const itinerary=mk('itinerary'), guidePage=mk('guide'), toolsPage=mk('tools'), pokePage=mk('pokemon');
    nav.insertAdjacentElement('afterend',itinerary);
    itinerary.insertAdjacentElement('afterend',guidePage);
    guidePage.insertAdjacentElement('afterend',toolsPage);
    toolsPage.insertAdjacentElement('afterend',pokePage);
    itinerary.append(trip,days); guidePage.append(guide); toolsPage.append(tools); pokePage.append(atlas);

    const gh=$('.guide-hero h2',guide); if(gh) gh.textContent='大阪・京都・奈良攻略';
    const oh=$('.ops-hero h2',tools); if(oh) oh.textContent='旅行即時工具';

    const guideNames={overview:'概況',attractions:'景點',food:'美食',transport:'交通',stay:'住宿',shopping:'購物',budget:'預算'};
    $$('.guide-tab',guide).forEach(b=>{const k=b.dataset.guide; const t=$('span',b)||b; if(guideNames[k]) t.textContent=guideNames[k];});
    const opsNames={transport:'交通',reserve:'訂位',meals:'三餐',save:'省錢',apps:'APP',packing:'行李',backup:'備案',photo:'拍照',assistant:'AI 助手'};
    $$('.ops-tab',tools).forEach(b=>{const k=b.dataset.ops; const t=$('span',b)||b; if(opsNames[k]) t.textContent=opsNames[k];});

    if(!$('.atlas-filters',atlas)){
      const head=$('.atlas-head',atlas), grid=$('#atlasGrid',atlas)||$('.atlas-grid',atlas);
      if(head&&grid){
        const bar=document.createElement('div'); bar.className='atlas-filters';
        const filters=[['all','全部'],['umeda','梅田'],['shinsaibashi','心齋橋'],['namba','難波'],['nipponbashi','日本橋'],['kyoto','京都']];
        bar.innerHTML=filters.map(([k,l],i)=>`<button type="button" class="atlas-filter${i?'':' active'}" data-filter="${k}">${l}</button>`).join('');
        head.insertAdjacentElement('afterend',bar);
        const items=$$('.atlas-item',grid);
        items.forEach(item=>{
          const t=(item.textContent||'').toLowerCase();
          item.dataset.area=t.includes('umeda')?'umeda':t.includes('shinsaibashi')?'shinsaibashi':(t.includes('nipponbashi')||t.includes('日本橋'))?'nipponbashi':(t.includes('namba')||t.includes('難波'))?'namba':(t.includes('kyoto')||t.includes('京都'))?'kyoto':'all';
        });
        $$('.atlas-filter',bar).forEach(b=>b.addEventListener('click',()=>{
          $$('.atlas-filter',bar).forEach(x=>x.classList.toggle('active',x===b));
          const f=b.dataset.filter;
          items.forEach(i=>i.hidden=!(f==='all'||i.dataset.area===f));
        }));
      }
    }

    $$('.guide-tab',guide).forEach(b=>b.addEventListener('click',()=>{
      const key=b.dataset.guide;
      $$('.guide-tab',guide).forEach(x=>x.classList.toggle('active',x===b));
      $$('.guide-panel',guide).forEach(p=>p.classList.toggle('active',p.dataset.guidePanel===key));
    }));
    $$('.ops-tab',tools).forEach(b=>b.addEventListener('click',()=>{
      const key=b.dataset.ops;
      $$('.ops-tab',tools).forEach(x=>x.classList.toggle('active',x===b));
      $$('.ops-panel',tools).forEach(p=>p.classList.toggle('active',p.dataset.opsPanel===key));
    }));

    const pages={itinerary,guide:guidePage,tools:toolsPage,pokemon:pokePage};
    function show(name,scroll=false){
      Object.entries(pages).forEach(([k,p])=>p.hidden=k!==name);
      $$('.tm-nav-btn',nav).forEach(b=>b.classList.toggle('active',b.dataset.page===name));
      try{sessionStorage.setItem('travel-v24-page',name)}catch(e){}
      if(scroll) window.scrollTo({top:Math.max(0,nav.offsetTop),behavior:'smooth'});
    }
    $$('.tm-nav-btn',nav).forEach(b=>b.addEventListener('click',()=>show(b.dataset.page,true)));
    let initial='itinerary';
    try{initial=sessionStorage.getItem('travel-v24-page')||'itinerary'}catch(e){}
    if(!pages[initial]) initial='itinerary';
    show(initial,false);

    document.documentElement.classList.add('travel-v24-ready');
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();
