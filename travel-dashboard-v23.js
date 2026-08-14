(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

  const shortGuide={overview:'概況',attractions:'景點',food:'美食',transport:'交通',stay:'住宿',shopping:'購物',budget:'預算'};
  const shortOps={transport:'交通',reserve:'訂位',meals:'三餐',save:'省錢',apps:'APP',packing:'行李',backup:'備案',photo:'拍照',assistant:'AI 助手'};

  function unwrapOld(){
    $('#primaryTabs')?.remove();
    $('#travelDashboardNav')?.remove();
    $$('[data-primary-wrapper="true"]').forEach(w=>{
      while(w.firstChild) w.parentNode.insertBefore(w.firstChild,w);
      w.remove();
    });
    ['.trip-strip','#daysContainer','#travelGuide','#tripControlCenter','.atlas'].forEach(sel=>{
      const el=$(sel); if(!el)return;
      el.style.removeProperty('display');
      el.removeAttribute('data-primary-page');
      el.classList.remove('primary-page-v20','primary-page','active');
    });
  }

  function makePage(name,nodes,after){
    const page=document.createElement('section');
    page.className='travel-page';
    page.dataset.travelPage=name;
    after.insertAdjacentElement('afterend',page);
    nodes.forEach(n=>page.appendChild(n));
    return page;
  }

  function buildPrimaryNav(hero,pages){
    const nav=document.createElement('nav');
    nav.id='travelDashboardNav';
    nav.className='travel-nav';
    nav.innerHTML=`
      <button class="travel-nav-btn active" data-travel-tab="itinerary">行程</button>
      <button class="travel-nav-btn" data-travel-tab="guide">攻略</button>
      <button class="travel-nav-btn" data-travel-tab="tools">即時工具</button>
      <button class="travel-nav-btn" data-travel-tab="pokemon">Pokémon Card</button>`;
    hero.insertAdjacentElement('afterend',nav);
    const set=(name,scroll=false)=>{
      $$('.travel-nav-btn',nav).forEach(b=>b.classList.toggle('active',b.dataset.travelTab===name));
      Object.entries(pages).forEach(([k,p])=>p.classList.toggle('active',k===name));
      try{sessionStorage.setItem('travel-dashboard-page',name)}catch(e){}
      if(scroll){window.scrollTo({top:nav.offsetTop,behavior:'smooth'})}
    };
    $$('.travel-nav-btn',nav).forEach(b=>b.addEventListener('click',()=>set(b.dataset.travelTab,true)));
    let initial='itinerary';
    const hash=(location.hash||'').replace('#','');
    if(['itinerary','guide','tools','pokemon'].includes(hash)) initial=hash;
    else try{initial=sessionStorage.getItem('travel-dashboard-page')||'itinerary'}catch(e){}
    if(!pages[initial]) initial='itinerary';
    set(initial,false);
    return {nav,set};
  }

  function compactTop(hero){
    const topbar=$('.topbar'); if(topbar) topbar.style.display='none';
    const note=$('.editor-note'); if(note) note.style.display='none';
    const actions=$('.topbar .actions') || $('.actions');
    if(actions){
      actions.classList.add('dash-edit-tools');
      const frame=$('.hero-frame',hero)||hero;
      frame.appendChild(actions);
      $('#downloadBtn',actions)?.remove();
      $('#resetBtn',actions)?.remove();
    }
    const desc=$('.hero-desc',hero);
    if(desc && desc.textContent.length>45) desc.textContent='GRAN RESPIRE OSAKA｜8/27–8/31';
  }

  function itineraryUI(page){
    const trip=$('.trip-strip',page), days=$('#daysContainer',page);
    if(!trip||!days)return;
    $('.strip-head',trip)?.classList.add('dash-progress');
    $$('.day-tab',trip).forEach((tab,i)=>{
      const t=$('.tab-title',tab); if(t){
        const map=['Arrival','USJ','大阪','京都','回台'];
        t.textContent=map[i]||t.textContent;
      }
    });
    $$('.day-panel',days).forEach(panel=>{
      $('.panel-header p',panel)?.classList.add('dash-secondary-copy');
      $('.day-route',panel)?.classList.add('dash-route-chips');
      $$('.stop',panel).forEach(stop=>{
        stop.classList.add('dash-stop');
        const p=$('p',stop);
        if(p && p.textContent.trim()){
          p.classList.add('dash-stop-detail');
          if(!$('.dash-more',stop)){
            const b=document.createElement('button');
            b.type='button'; b.className='dash-more'; b.textContent='詳情';
            b.addEventListener('click',()=>{
              const on=stop.classList.toggle('expanded');
              b.textContent=on?'收起':'詳情';
            });
            const links=$('.maplinks',stop) || $('.transport',stop);
            if(links) links.insertAdjacentElement('afterend',b);
          }
        }
      });
      const side=$('.panel-side',panel);
      if(side && !$('.daily-extra',panel)){
        const det=document.createElement('details');
        det.className='daily-extra';
        const sum=document.createElement('summary');
        sum.textContent='Pokémon Card 巡店 / 補卡';
        det.appendChild(sum);
        det.appendChild(side);
        $('.panel-main',panel)?.insertAdjacentElement('afterend',det);
      }
    });
  }

  function guideUI(page){
    const guide=$('#travelGuide',page); if(!guide)return;
    const hero=$('.guide-hero',guide);
    if(hero){
      const h=$('h2',hero); if(h)h.innerHTML='旅遊攻略';
      $('p',hero)?.classList.add('dash-hidden-copy');
      $('.guide-stamp',hero)?.classList.add('dash-hidden-copy');
    }
    const tabs=$('#guideTabs',guide);
    if(tabs){
      tabs.classList.add('dash-category-grid');
      $$('.guide-tab',tabs).forEach(btn=>{
        const key=btn.dataset.guide;
        const span=$('span',btn)||btn;
        if(shortGuide[key]) span.textContent=shortGuide[key];
        btn.addEventListener('click',()=>{
          $$('.guide-tab',tabs).forEach(x=>x.classList.toggle('active',x===btn));
          $$('.guide-panel',guide).forEach(p=>p.classList.toggle('active',p.dataset.guidePanel===key));
        });
      });
    }
    $$('.guide-panel-head p',guide).forEach(p=>p.classList.add('dash-secondary-copy'));
  }

  function toolUI(page){
    const tools=$('#tripControlCenter',page); if(!tools)return;
    const hero=$('.ops-hero',tools);
    if(hero){
      const h=$('h2',hero); if(h)h.innerHTML='即時工具';
      $('p',hero)?.classList.add('dash-hidden-copy');
      $('.ops-summary',hero)?.classList.add('dash-hidden-copy');
    }
    const tabs=$('#opsTabs',tools);
    if(tabs){
      tabs.classList.add('dash-ops-tabs');
      $$('.ops-tab',tabs).forEach(btn=>{
        const key=btn.dataset.ops;
        const span=$('span',btn)||btn;
        if(shortOps[key]) span.textContent=shortOps[key];
        btn.addEventListener('click',()=>{
          $$('.ops-tab',tabs).forEach(x=>x.classList.toggle('active',x===btn));
          $$('.ops-panel',tools).forEach(p=>p.classList.toggle('active',p.dataset.opsPanel===key));
        });
      });
    }
    $$('.ops-head p',tools).forEach(p=>p.classList.add('dash-secondary-copy'));
    $$('.tool-item',tools).forEach(x=>x.classList.add('dash-tool-item'));
    $$('.ops-card,.tool-item,.backup-item,.photo-item',tools).forEach(card=>{
      if(card.classList.contains('dash-collapsible')) return;
      const p=$('p',card);
      if(!p || p.textContent.trim().length<55) return;
      card.classList.add('dash-collapsible');
      const b=document.createElement('button');
      b.type='button'; b.className='dash-card-more'; b.textContent='查看';
      b.addEventListener('click',()=>{
        const on=card.classList.toggle('expanded');
        b.textContent=on?'收起':'查看';
      });
      const target=$('.ops-tools',card) || card.lastElementChild;
      if(target) target.insertAdjacentElement('afterend',b); else card.appendChild(b);
    });
  }

  function pokemonUI(page){
    const atlas=$('.atlas',page); if(!atlas)return;
    const head=$('.atlas-head',atlas);
    if(head){
      const h=$('h2',head); if(h)h.textContent='Pokémon Card';
      $('p',head)?.classList.add('dash-hidden-copy');
    }
    const grid=$('#atlasGrid',atlas); if(!grid)return;
    const items=$$('.atlas-item',grid);
    const filters=[['all','全部'],['umeda','梅田'],['shinsaibashi','心齋橋'],['namba','難波'],['nipponbashi','日本橋'],['kyoto','京都']];
    const bar=document.createElement('div');
    bar.className='atlas-filters';
    bar.innerHTML=filters.map(([k,l],i)=>`<button class="atlas-filter${i===0?' active':''}" data-filter="${k}">${l}</button>`).join('');
    head?.insertAdjacentElement('afterend',bar);
    const bucket=(item)=>{
      const t=(item.textContent||'').toLowerCase();
      if(t.includes('umeda'))return 'umeda';
      if(t.includes('shinsaibashi'))return 'shinsaibashi';
      if(t.includes('nipponbashi')||t.includes('日本橋'))return 'nipponbashi';
      if(t.includes('namba')||t.includes('難波'))return 'namba';
      if(t.includes('kyoto')||t.includes('京都'))return 'kyoto';
      return 'all';
    };
    items.forEach(i=>{i.dataset.area=bucket(i); i.classList.add('dash-atlas-item')});
    $$('.atlas-filter',bar).forEach(btn=>btn.addEventListener('click',()=>{
      $$('.atlas-filter',bar).forEach(x=>x.classList.toggle('active',x===btn));
      const f=btn.dataset.filter;
      items.forEach(i=>i.style.display=(f==='all'||i.dataset.area===f)?'block':'none');
    }));
  }

  function addStyle(){
    if($('#travel-dashboard-v23-style'))return;
    const s=document.createElement('style'); s.id='travel-dashboard-v23-style';
    s.textContent=`
      :root{--dash-bg:#f3efe8;--dash-paper:#fbfaf7;--dash-ink:#191816;--dash-muted:#817a72;--dash-line:#ddd5cc;--dash-wine:#7b252d;--dash-soft:#efe8df}
      body{background:var(--dash-bg)!important;color:var(--dash-ink)!important}
      .hero{padding:10px 0 0!important}.hero-frame{border-radius:22px!important;overflow:hidden!important;box-shadow:0 10px 28px rgba(28,23,18,.06)!important;position:relative}
      .hero-copy{padding:24px 28px 18px!important}.hero-copy h1{margin:0!important}.hero-desc{margin-top:8px!important;color:var(--dash-muted)!important}
      .hero-flight{padding:12px 28px 15px!important;background:rgba(255,255,255,.55)!important}
      .dash-edit-tools{position:absolute!important;right:14px!important;top:12px!important;display:flex!important;gap:5px!important}.dash-edit-tools .topbtn{margin:0!important;padding:6px 9px!important;font-size:9px!important;background:rgba(255,255,255,.85)!important;color:#2a2723!important;border:1px solid var(--dash-line)!important}
      .travel-nav{width:min(1320px,calc(100% - 32px));margin:10px auto 0;display:grid;grid-template-columns:repeat(4,1fr);position:sticky;top:0;z-index:100;background:rgba(248,245,240,.96);backdrop-filter:blur(16px);border:1px solid var(--dash-line);border-radius:16px;overflow:hidden;box-shadow:0 8px 22px rgba(28,23,18,.06)}
      .travel-nav-btn{margin:0!important;border:0!important;border-right:1px solid var(--dash-line)!important;border-radius:0!important;background:transparent!important;color:var(--dash-ink)!important;padding:14px 8px!important;font-weight:800!important;font-size:13px!important;position:relative}.travel-nav-btn:last-child{border-right:0!important}.travel-nav-btn.active{background:#fff!important;color:var(--dash-wine)!important}.travel-nav-btn.active:after{content:'';position:absolute;height:2px;background:var(--dash-wine);left:18%;right:18%;bottom:0}
      .travel-page{display:none;width:min(1320px,calc(100% - 32px));margin:14px auto 46px}.travel-page.active{display:block}
      .travel-page>.trip-strip{margin:0 0 14px!important}.travel-page>#daysContainer{padding:0!important}
      .dash-hidden-copy{display:none!important}.dash-secondary-copy{color:var(--dash-muted)!important}
      .trip-strip{border-radius:20px!important;box-shadow:none!important;background:var(--dash-paper)!important}.dash-progress{padding:11px 15px!important}.day-tabs{background:var(--dash-paper)!important}
      .panel-grid{grid-template-columns:1fr!important;gap:10px!important}.panel-main{border-radius:20px!important;box-shadow:none!important}.panel-side{box-shadow:none!important}.panel-header{padding:20px 20px 16px!important}.panel-header h2{font-size:27px!important}.panel-header p{font-size:11px!important;line-height:1.55!important}.timeline{padding:8px 12px 14px!important}
      .dash-stop{display:grid!important;grid-template-columns:60px minmax(0,1fr)!important;gap:12px!important;border:1px solid var(--dash-line)!important;border-radius:16px!important;background:#fff!important;margin:8px 0!important;padding:14px!important;box-shadow:none!important}.dash-stop .time{font-size:12px!important;color:var(--dash-wine)!important;font-weight:900!important}.dash-stop h3{font-size:16px!important;margin:0 0 5px!important}.dash-stop .transport{font-size:10px!important;color:var(--dash-muted)!important;margin-top:5px!important}.dash-stop-detail{display:none!important;font-size:11px!important;line-height:1.65!important;color:var(--dash-muted)!important}.dash-stop.expanded .dash-stop-detail{display:block!important}.dash-more,.dash-card-more{border:0!important;background:transparent!important;color:var(--dash-wine)!important;padding:5px 0!important;margin:4px 0 0!important;font-size:10px!important;font-weight:800!important}.maplinks{gap:6px!important;margin-top:8px!important}.mapbtn{padding:7px 9px!important;font-size:9px!important;border-radius:999px!important}.stop-tools{display:none!important}
      .daily-extra{border:1px solid var(--dash-line);border-radius:16px;background:var(--dash-paper);overflow:hidden;margin-top:10px}.daily-extra summary{cursor:pointer;padding:13px 15px;font-weight:850;font-size:12px;color:var(--dash-wine);list-style:none}.daily-extra summary::-webkit-details-marker{display:none}.daily-extra summary:after{content:'＋';float:right}.daily-extra[open] summary:after{content:'－'}.daily-extra .panel-side{border:0!important;border-radius:0!important}
      .guide-hero,.ops-hero{padding:22px!important;border-radius:20px!important;min-height:0!important}.guide-hero h2,.ops-hero h2{font-size:31px!important;margin:0!important}.guide-kicker,.ops-kicker{font-size:8px!important}.dash-category-grid{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:8px!important;background:transparent!important;border:0!important;padding:10px 0 14px!important}.dash-category-grid .guide-tab{border:1px solid var(--dash-line)!important;border-radius:14px!important;background:#fff!important;min-height:58px!important;padding:10px 8px!important;font-size:12px!important}.dash-category-grid .guide-tab.active{background:var(--dash-wine)!important;color:#fff!important}.guide-panel{border-radius:20px!important}.guide-panel-head{padding:18px!important}.guide-panel-head h3{font-size:24px!important}.guide-panel-head p{font-size:11px!important;line-height:1.6!important}
      .dash-ops-tabs{display:flex!important;overflow-x:auto!important;gap:7px!important;padding:11px 0 14px!important;border:0!important;background:transparent!important;scrollbar-width:none}.dash-ops-tabs::-webkit-scrollbar{display:none}.dash-ops-tabs .ops-tab{flex:0 0 auto!important;border:1px solid var(--dash-line)!important;border-radius:999px!important;background:#fff!important;padding:9px 13px!important;font-size:11px!important}.dash-ops-tabs .ops-tab.active{background:var(--dash-wine)!important;color:#fff!important}.ops-panel{border-radius:20px!important}.ops-head{padding:18px!important}.ops-head h3{font-size:24px!important}.ops-head p{font-size:11px!important;line-height:1.6!important}.ops-grid,.assistant-grid,.photo-grid,.emergency-banner{gap:9px!important}.ops-card,.tool-item,.backup-item,.photo-item,.assistant-card{border-radius:16px!important;box-shadow:none!important}.dash-collapsible p{display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.dash-collapsible.expanded p{display:block!important;overflow:visible!important}.dash-tool-item{grid-template-columns:1fr!important}.dash-tool-item .tool-name{font-size:12px!important;margin-bottom:2px!important}
      .atlas-head{padding:18px 4px 10px!important}.atlas-head h2{font-size:31px!important}.atlas-filters{display:flex;gap:7px;overflow-x:auto;padding:0 0 12px;scrollbar-width:none}.atlas-filters::-webkit-scrollbar{display:none}.atlas-filter{flex:0 0 auto;border:1px solid var(--dash-line)!important;border-radius:999px!important;background:#fff!important;color:var(--dash-ink)!important;padding:8px 12px!important;margin:0!important;font-size:10px!important;font-weight:800!important}.atlas-filter.active{background:var(--dash-wine)!important;color:#fff!important;border-color:var(--dash-wine)!important}.atlas-grid{gap:9px!important}.dash-atlas-item{border-radius:16px!important;padding:16px!important}.dash-atlas-item h3{font-size:17px!important}.dash-atlas-item p{font-size:11px!important;line-height:1.55!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      @media(max-width:720px){
        .shell{width:calc(100% - 18px)!important}.hero{padding-top:7px!important}.hero-frame{border-radius:18px!important}.hero-copy{padding:20px 16px 13px!important}.hero-copy h1{font-size:36px!important;line-height:1!important}.hero-desc{font-size:10px!important}.hero-flight{padding:10px 16px 12px!important}.flight-label{font-size:7px!important}.flight-row{gap:7px!important;padding:5px 0!important}.flight-route{font-size:14px!important}.flight-data .fkey{font-size:6px!important}.flight-data .fval{font-size:9px!important}.dash-edit-tools{position:static!important;justify-content:flex-end!important;padding:0 12px 8px!important}.dash-edit-tools .topbtn{font-size:8px!important;padding:5px 8px!important}
        .travel-nav{width:100%;margin:8px 0 0;border-left:0;border-right:0;border-radius:0;grid-template-columns:repeat(4,minmax(0,1fr));box-shadow:0 5px 14px rgba(28,23,18,.05)}.travel-nav-btn{padding:13px 3px!important;font-size:11px!important;white-space:nowrap}.travel-nav-btn:last-child{font-size:10px!important}
        .travel-page{width:calc(100% - 18px);margin:10px auto 30px}.dash-progress{display:none!important}.day-tabs{display:flex!important;overflow-x:auto!important;scroll-snap-type:x mandatory;scrollbar-width:none}.day-tabs::-webkit-scrollbar{display:none}.day-tab{min-width:42vw!important;min-height:82px!important;padding:13px 12px!important;scroll-snap-align:start}.tab-date{font-size:23px!important}.tab-title{font-size:10px!important}.tab-note{font-size:8px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.panel-header{padding:16px 15px 13px!important}.panel-header .datebig{font-size:31px!important}.panel-header h2{font-size:23px!important}.panel-header p{display:none!important}.dash-route-chips{padding:8px 14px!important}.timeline{padding:6px 8px 12px!important}.dash-stop{grid-template-columns:48px minmax(0,1fr)!important;padding:12px!important;border-radius:14px!important;margin:7px 0!important}.dash-stop h3{font-size:15px!important}.maplinks{display:flex!important;overflow-x:auto!important;flex-wrap:nowrap!important}.mapbtn{white-space:nowrap!important}.daily-extra{margin:8px!important}
        .guide-hero,.ops-hero{padding:17px!important;border-radius:17px!important}.guide-hero h2,.ops-hero h2{font-size:27px!important}.dash-category-grid{grid-template-columns:repeat(2,1fr)!important;gap:7px!important}.dash-category-grid .guide-tab{min-height:52px!important}.guide-panel-head,.ops-head{padding:15px!important}.guide-panel-head h3,.ops-head h3{font-size:21px!important}.guide-panel-head p,.ops-head p{display:none!important}.guide-grid,.ops-grid,.ops-grid.two,.assistant-grid,.photo-grid,.emergency-banner{grid-template-columns:1fr!important}.tool-item{grid-template-columns:1fr!important}.cost-inputs{grid-template-columns:repeat(2,1fr)!important}.reco-banner{grid-template-columns:1fr!important;padding:16px!important}.reco-price{text-align:left!important}.pass-table,.meal-table{font-size:10px!important}.atlas-grid{grid-template-columns:1fr!important}.dash-atlas-item{padding:14px!important}
      }
    `;
    document.head.appendChild(s);
  }

  async function init(){
    try{if(window.__guideToolsRestorePromise) await window.__guideToolsRestorePromise}catch(e){}
    const hero=$('.hero'), trip=$('.trip-strip'), days=$('#daysContainer'), guide=$('#travelGuide'), tools=$('#tripControlCenter'), atlas=$('.atlas');
    if(!hero||!trip||!days||!guide||!tools||!atlas){setTimeout(init,150);return;}
    if(document.body.dataset.dashboard23==='1')return;
    document.body.dataset.dashboard23='1';
    addStyle(); unwrapOld(); compactTop(hero);
    const itinerary=makePage('itinerary',[trip,days],hero);
    const guidePage=makePage('guide',[guide],itinerary);
    const toolsPage=makePage('tools',[tools],guidePage);
    const pokemonPage=makePage('pokemon',[atlas],toolsPage);
    const pages={itinerary,guide:guidePage,tools:toolsPage,pokemon:pokemonPage};
    buildPrimaryNav(hero,pages);
    itineraryUI(itinerary); guideUI(guidePage); toolUI(toolsPage); pokemonUI(pokemonPage);
    if(typeof bindTabs==='function')bindTabs();
    if(typeof bindGuideTabs==='function')bindGuideTabs();
    if(typeof bindOpsTabs==='function')bindOpsTabs();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
