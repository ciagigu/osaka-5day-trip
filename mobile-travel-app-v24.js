(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const mobile=()=>window.matchMedia('(max-width: 820px)').matches;
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();

  function waitForData(){
    return new Promise(resolve=>{
      let n=0;
      const tick=()=>{
        const ok=$('.hero')&&$('.trip-strip')&&$('#daysContainer')&&$('#travelGuide')&&$('#tripControlCenter')&&$('.atlas');
        if(ok||n++>60) resolve(); else setTimeout(tick,100);
      };
      tick();
    });
  }

  function getMapLinks(root){
    return $$('a.mapbtn,a.guide-link.map,a[href*="google.com/maps"]',root).slice(0,5).map(a=>({label:clean(a.textContent).replace(/·?\s*Google Maps\s*↗?/i,'').replace(/↗/g,'').trim()||'Maps',href:a.href}));
  }
  function linkHTML(links){
    return links.map(x=>`<a class="m-link" href="${esc(x.href)}" target="_blank" rel="noopener noreferrer">${esc(x.label)} ↗</a>`).join('');
  }

  function buildHeader(){
    return `<header class="m-head">
      <div class="m-kicker">KANSAI · 2026</div>
      <h1>大阪 5 日旅</h1>
      <div class="m-sub">GRAN RESPIRE OSAKA · 8/27–8/31</div>
      <div class="m-flight">
        <div class="m-flight-route"><span>台北 TPE</span><b>→</b><span>大阪 KIX</span></div>
        <div class="m-flight-meta"><span><small>Flight</small>CI156</span><span><small>Date</small>8/27</span><span><small>Time</small>08:15 → 12:00</span><span><small>Duration</small>2h45m</span></div>
      </div>
    </header>`;
  }

  function itineraryData(){
    const tabs=$$('#dayTabs .day-tab');
    const panels=$$('#daysContainer .day-panel');
    return panels.map((panel,i)=>{
      const tab=tabs[i];
      const date=clean($('.tab-date',tab)?.textContent)||['8/27','8/28','8/29','8/30','8/31'][i];
      const shortTitle=clean($('.tab-title',tab)?.textContent)||`Day ${i+1}`;
      const note=clean($('.tab-note',tab)?.textContent);
      const mainTitle=clean($('.panel-header h2',panel)?.textContent)||shortTitle;
      const intro=clean($('.panel-header p',panel)?.textContent);
      const chips=$$('.route-chip',panel).map(x=>clean(x.textContent)).filter(Boolean);
      const stops=$$('.stop',panel).map(stop=>({
        time:clean($('.time',stop)?.textContent),
        title:clean($('h3',stop)?.textContent),
        desc:clean($('p',stop)?.textContent),
        transport:clean($('.transport',stop)?.textContent),
        maps:getMapLinks(stop)
      })).filter(x=>x.title);
      const side=$('.panel-side',panel);
      const sideTitle=clean($('.poke-head h3',side)?.textContent)||'Pokémon Card 巡店';
      const sideText=clean($('.poke-head p',side)?.textContent)||clean($('.poke-route-line',side)?.textContent);
      const sideMaps=getMapLinks(side);
      return {date,shortTitle,note,mainTitle,intro,chips,stops,sideTitle,sideText,sideMaps};
    });
  }

  function itineraryHTML(days){
    return `<section class="m-page active" data-mpage="itinerary">
      <div class="m-days">${days.map((d,i)=>`<button class="m-day${i===0?' active':''}" data-day="${i}"><b>${esc(d.date)}</b><span>${esc(d.shortTitle)}</span></button>`).join('')}</div>
      <div id="mDayView"></div>
    </section>`;
  }
  function renderDay(day,index){
    const view=$('#mDayView'); if(!view)return;
    const stops=day.stops.map(s=>`<article class="m-stop">
      <div class="m-time">${esc(s.time||'—')}</div>
      <div class="m-stop-body"><h3>${esc(s.title)}</h3>${s.transport?`<div class="m-transport">${esc(s.transport)}</div>`:''}${linkHTML(s.maps)}${s.desc?`<details class="m-detail"><summary>備註</summary><p>${esc(s.desc)}</p></details>`:''}</div>
    </article>`).join('');
    view.innerHTML=`<div class="m-day-head"><div class="m-ey">DAY ${index+1} · ${esc(day.date)}</div><h2>${esc(day.mainTitle)}</h2>${day.note?`<p>${esc(day.note)}</p>`:''}${day.chips.length?`<div class="m-chips">${day.chips.map(c=>`<span>${esc(c)}</span>`).join('')}</div>`:''}</div>
      <div class="m-timeline">${stops}</div>
      ${day.sideText||day.sideMaps.length?`<details class="m-extra"><summary>${esc(day.sideTitle)}</summary><div class="m-extra-inner">${day.sideText?`<p>${esc(day.sideText)}</p>`:''}${linkHTML(day.sideMaps)}</div></details>`:''}`;
  }

  function cloneGuidePanel(key){
    const src=$(`#travelGuide [data-guide-panel="${CSS.escape(key)}"]`); if(!src)return '<div class="m-empty">尚無內容</div>';
    const c=src.cloneNode(true);
    $$('.guide-actions,.edit-only',c).forEach(x=>x.remove());
    const intro=$('.guide-panel-head p',c); if(intro) intro.remove();
    return c.outerHTML;
  }
  function guideHTML(){
    const tabs=$$('#guideTabs .guide-tab');
    const names={overview:'概況',attractions:'景點',food:'美食',transport:'交通',stay:'住宿',shopping:'購物',budget:'預算'};
    const cats=tabs.map((b,i)=>({key:b.dataset.guide||String(i),name:names[b.dataset.guide]||clean(b.textContent)}));
    return `<section class="m-page" data-mpage="guide"><div class="m-section-title"><div class="m-ey">TRAVEL GUIDE</div><h2>旅遊攻略</h2><p>景點、美食、交通、住宿與購物，選一類再看。</p></div>
      <div class="m-cat-grid" id="mGuideCats">${cats.map((c,i)=>`<button class="m-cat${i===0?' active':''}" data-guide-key="${esc(c.key)}">${esc(c.name)}</button>`).join('')}</div>
      <div id="mGuideView" class="m-content"></div></section>`;
  }
  function renderGuide(key){ const v=$('#mGuideView'); if(v)v.innerHTML=cloneGuidePanel(key); }

  function cloneOpsPanel(key){
    const src=$(`#tripControlCenter [data-ops-panel="${CSS.escape(key)}"]`); if(!src)return '<div class="m-empty">尚無內容</div>';
    const c=src.cloneNode(true);
    $$('.ops-actions,.edit-only',c).forEach(x=>x.remove());
    const intro=$('.ops-head p',c); if(intro) intro.remove();
    return c.outerHTML;
  }
  function toolsHTML(){
    const tabs=$$('#opsTabs .ops-tab');
    const names={transport:'交通',reserve:'訂位',meals:'三餐',save:'省錢',apps:'APP',packing:'行李',backup:'備案',photo:'拍照',assistant:'AI 助手'};
    const cats=tabs.map((b,i)=>({key:b.dataset.ops||String(i),name:names[b.dataset.ops]||clean(b.textContent)}));
    return `<section class="m-page" data-mpage="tools"><div class="m-section-title"><div class="m-ey">TRAVEL TOOLS</div><h2>即時工具</h2><p>旅行中真正會查的功能集中在這裡。</p></div>
      <div class="m-cat-grid m-cat-3" id="mToolCats">${cats.map((c,i)=>`<button class="m-cat${i===0?' active':''}" data-ops-key="${esc(c.key)}">${esc(c.name)}</button>`).join('')}</div>
      <div id="mToolView" class="m-content"></div></section>`;
  }
  function renderTools(key){ const v=$('#mToolView'); if(v)v.innerHTML=cloneOpsPanel(key); }

  function pokemonHTML(){
    const items=$$('.atlas .atlas-item');
    const filters=['全部','梅田','心齋橋','難波','日本橋','京都'];
    const cards=items.map((it,i)=>{
      const city=clean($('.city',it)?.textContent);
      const title=clean($('h3',it)?.textContent)||`Card Shop ${i+1}`;
      const p=clean($('p',it)?.textContent);
      const maps=getMapLinks(it);
      const text=(city+' '+title+' '+p).toLowerCase();
      let area='其他';
      if(/umeda|梅田/.test(text))area='梅田'; else if(/shinsaibashi|心齋橋/.test(text))area='心齋橋'; else if(/nipponbashi|日本橋/.test(text))area='日本橋'; else if(/namba|難波/.test(text))area='難波'; else if(/kyoto|京都/.test(text))area='京都';
      return `<article class="m-shop" data-area="${esc(area)}"><div class="m-shop-city">${esc(city||area)}</div><h3>${esc(title)}</h3>${p?`<p>${esc(p)}</p>`:''}${linkHTML(maps)}</article>`;
    }).join('');
    return `<section class="m-page" data-mpage="pokemon"><div class="m-section-title"><div class="m-ey">CARD SHOP ATLAS</div><h2>Pokémon Card</h2><p>依區域找店，直接開 Maps。</p></div>
      <div class="m-filter-row">${filters.map((f,i)=>`<button class="m-filter${i===0?' active':''}" data-area-filter="${esc(f)}">${esc(f)}</button>`).join('')}</div>
      <div class="m-shop-list">${cards}</div></section>`;
  }

  function style(){
    const s=document.createElement('style'); s.id='mobile-travel-app-v24-style';
    s.textContent=`
      @media(max-width:820px){
        html,body{overflow-x:hidden!important;background:#f3efe8!important}
        body.mobile-app-v24>.topbar,body.mobile-app-v24>.shell,body.mobile-app-v24>.editor-note{display:none!important}
        #mobileTravelApp{display:block;width:100%;min-height:100vh;background:#f3efe8;color:#191816;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC",sans-serif;padding-bottom:46px}
        #mobileTravelApp *{box-sizing:border-box;min-width:0;max-width:100%}
        .m-wrap{width:100%;margin:0 auto}
        .m-head{padding:24px 18px 14px}.m-kicker,.m-ey{font-size:10px;letter-spacing:.18em;font-weight:900;color:#8a8177}.m-head h1{font-family:Georgia,"Noto Serif TC",serif;font-size:38px;line-height:1;margin:8px 0 7px;font-weight:400;letter-spacing:-.04em}.m-sub{font-size:12px;color:#7e766e;font-weight:700}
        .m-flight{margin-top:16px;background:#fff;border:1px solid #ded5cb;border-radius:16px;padding:14px}.m-flight-route{display:flex;align-items:center;gap:10px;font-family:Georgia,"Noto Serif TC",serif;font-size:18px}.m-flight-route b{font-size:14px;color:#8a8177}.m-flight-meta{display:grid;grid-template-columns:repeat(2,1fr);gap:10px 16px;margin-top:12px;padding-top:12px;border-top:1px solid #ece5dc}.m-flight-meta span{font-size:12px;font-weight:800}.m-flight-meta small{display:block;font-size:8px;text-transform:uppercase;letter-spacing:.12em;color:#999086;margin-bottom:3px}
        .m-main-nav{position:sticky;top:0;z-index:50;display:grid;grid-template-columns:repeat(4,1fr);background:rgba(248,245,240,.97);backdrop-filter:blur(15px);border-top:1px solid #ddd5cc;border-bottom:1px solid #ddd5cc}.m-main-nav button{margin:0!important;border:0!important;border-right:1px solid #e1d9d0!important;border-radius:0!important;background:transparent!important;color:#1d1b18!important;padding:14px 2px!important;font-size:12px!important;font-weight:850!important;white-space:nowrap;position:relative}.m-main-nav button:last-child{border-right:0!important}.m-main-nav button.active{color:#7b252d!important;background:#fff!important}.m-main-nav button.active:after{content:"";position:absolute;left:20%;right:20%;bottom:0;height:2px;background:#7b252d}
        .m-page{display:none;padding:14px 14px 0}.m-page.active{display:block}.m-section-title{padding:8px 4px 14px}.m-section-title h2,.m-day-head h2{font-family:Georgia,"Noto Serif TC",serif;font-weight:400;letter-spacing:-.03em;margin:6px 0 5px;font-size:29px;line-height:1.12}.m-section-title p,.m-day-head p{margin:0;color:#817970;font-size:12px;line-height:1.6}
        .m-days{display:flex;gap:8px;overflow-x:auto;padding:0 0 12px;scrollbar-width:none}.m-days::-webkit-scrollbar{display:none}.m-day{flex:0 0 112px;margin:0!important;background:#fff!important;color:#1d1b18!important;border:1px solid #ded5cb!important;border-radius:14px!important;padding:12px!important;text-align:left!important}.m-day b{display:block;font-family:Georgia,serif;font-size:21px;font-weight:400}.m-day span{display:block;font-size:10px;color:#817970;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m-day.active{border-color:#7b252d!important;box-shadow:inset 0 0 0 1px #7b252d}.m-day.active b{color:#7b252d}
        .m-day-head{background:#fff;border:1px solid #ded5cb;border-radius:18px;padding:17px;margin-bottom:10px}.m-chips{display:flex;gap:6px;overflow-x:auto;margin-top:12px;padding-bottom:2px}.m-chips span{flex:0 0 auto;border:1px solid #e4dbd2;border-radius:999px;padding:6px 9px;font-size:9px;color:#746c64;background:#fbfaf7}
        .m-timeline{display:grid;gap:9px}.m-stop{display:grid;grid-template-columns:52px 1fr;gap:10px;background:#fff;border:1px solid #ded5cb;border-radius:16px;padding:14px}.m-time{font-size:12px;font-weight:900;color:#7b252d;padding-top:2px}.m-stop h3{font-size:16px;line-height:1.35;margin:0 0 6px}.m-transport{font-size:10px;line-height:1.55;color:#817970}.m-link{display:inline-flex;margin:8px 5px 0 0;padding:7px 9px;border:1px solid #d8cec3;border-radius:999px;background:#fff;color:#24211d;text-decoration:none;font-size:10px;font-weight:850}.m-detail{margin-top:8px;border-top:1px solid #eee7df;padding-top:7px}.m-detail summary,.m-extra summary{font-size:10px;font-weight:850;color:#7b252d;cursor:pointer;list-style:none}.m-detail summary::-webkit-details-marker,.m-extra summary::-webkit-details-marker{display:none}.m-detail p,.m-extra p{font-size:11px;line-height:1.65;color:#817970;margin:8px 0 0}.m-extra{margin-top:10px;background:#fff;border:1px solid #ded5cb;border-radius:16px;padding:13px 14px}.m-extra summary{font-size:12px}.m-extra-inner{padding-top:4px}
        .m-cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:12px}.m-cat-grid.m-cat-3{grid-template-columns:repeat(3,1fr)}.m-cat{margin:0!important;border:1px solid #ded5cb!important;border-radius:12px!important;background:#fff!important;color:#26221f!important;padding:11px 4px!important;font-size:11px!important;font-weight:850!important}.m-cat.active{background:#7b252d!important;color:#fff!important;border-color:#7b252d!important}
        .m-content{background:#fff;border:1px solid #ded5cb;border-radius:18px;overflow:hidden}.m-content .guide-panel,.m-content .ops-panel{display:block!important;padding:16px!important;width:100%!important}.m-content .guide-panel-head,.m-content .ops-head{display:block!important;margin:0 0 12px!important;padding:0 0 10px!important;border-bottom:1px solid #ded5cb!important}.m-content .guide-panel-head h3,.m-content .ops-head h3{font-family:Georgia,"Noto Serif TC",serif!important;font-size:24px!important;line-height:1.15!important;margin:0!important;color:#191816!important}.m-content .guide-stat-grid,.m-content .guide-grid,.m-content .guide-grid.two,.m-content .ops-grid,.m-content .ops-grid.two,.m-content .assistant-grid,.m-content .photo-grid,.m-content .emergency-banner{display:grid!important;grid-template-columns:1fr!important;gap:9px!important}.m-content .guide-card,.m-content .guide-stat,.m-content .ops-card,.m-content .tool-item,.m-content .pack-item,.m-content .backup-item,.m-content .photo-item,.m-content .assistant-card{width:100%!important;min-width:0!important;max-width:100%!important;border-radius:14px!important;padding:14px!important;overflow:hidden!important}.m-content .tool-item{display:grid!important;grid-template-columns:1fr!important;gap:7px!important}.m-content .tool-name{font-size:12px!important;line-height:1.35!important;overflow-wrap:anywhere!important}.m-content h4{font-size:17px!important;line-height:1.35!important;overflow-wrap:anywhere!important}.m-content p{font-size:11px!important;line-height:1.65!important;overflow-wrap:anywhere!important}.m-content .guide-card.dark,.m-content .ops-card.dark,.m-content .assistant-card.dark{background:#24211f!important;color:#fff!important}.m-content .guide-card.dark p,.m-content .ops-card.dark p,.m-content .assistant-card.dark p{color:#c6beb5!important}.m-content .ops-row,.m-content .guide-meta-row{grid-template-columns:72px 1fr!important}.m-content .reco-banner{display:block!important;padding:14px!important;border-radius:14px!important}.m-content .reco-price{text-align:left!important;margin-top:10px}.m-content .cost-inputs{grid-template-columns:repeat(2,1fr)!important}.m-content .pass-table,.m-content .route-table,.m-content .meal-table{display:block!important;width:100%!important;overflow-x:auto!important;font-size:10px!important}.m-content table{max-width:none!important}.m-content .ops-tabs,.m-content .guide-tabs,.m-content .guide-hero,.m-content .ops-hero{display:none!important}.m-content .ops-tools,.m-content .guide-links{display:flex!important;flex-wrap:wrap!important;gap:6px!important}.m-content .ops-link,.m-content .guide-link{font-size:9px!important;padding:7px 9px!important}
        .m-filter-row{display:flex;gap:7px;overflow-x:auto;padding-bottom:10px;scrollbar-width:none}.m-filter{flex:0 0 auto;margin:0!important;border:1px solid #ded5cb!important;border-radius:999px!important;background:#fff!important;color:#39342f!important;padding:8px 11px!important;font-size:10px!important;font-weight:850!important}.m-filter.active{background:#7b252d!important;border-color:#7b252d!important;color:#fff!important}.m-shop-list{display:grid;gap:9px}.m-shop{background:#fff;border:1px solid #ded5cb;border-radius:16px;padding:15px}.m-shop-city{font-size:9px;letter-spacing:.12em;color:#7b252d;font-weight:900;text-transform:uppercase}.m-shop h3{font-family:Georgia,"Noto Serif TC",serif;font-size:19px;font-weight:400;margin:6px 0}.m-shop p{font-size:11px;line-height:1.6;color:#817970;margin:0}
        .m-empty{padding:20px;color:#817970;font-size:12px}
      }
      @media(min-width:821px){#mobileTravelApp{display:none!important}}
    `;
    document.head.appendChild(s);
  }

  async function init(){
    if(!mobile()||$('#mobileTravelApp'))return;
    await waitForData();
    if(window.__guideToolsRestorePromise){try{await window.__guideToolsRestorePromise}catch(e){}}
    await new Promise(r=>setTimeout(r,150));
    const days=itineraryData();
    const app=document.createElement('div'); app.id='mobileTravelApp';
    app.innerHTML=`<div class="m-wrap">${buildHeader()}<nav class="m-main-nav"><button class="active" data-main="itinerary">行程</button><button data-main="guide">攻略</button><button data-main="tools">即時工具</button><button data-main="pokemon">Pokémon Card</button></nav>${itineraryHTML(days)}${guideHTML()}${toolsHTML()}${pokemonHTML()}</div>`;
    document.body.appendChild(app); document.body.classList.add('mobile-app-v24'); style();
    renderDay(days[0],0);
    const g0=$('#mGuideCats .m-cat')?.dataset.guideKey; if(g0)renderGuide(g0);
    const o0=$('#mToolCats .m-cat')?.dataset.opsKey; if(o0)renderTools(o0);

    $$('.m-main-nav button',app).forEach(b=>b.addEventListener('click',()=>{
      $$('.m-main-nav button',app).forEach(x=>x.classList.toggle('active',x===b));
      $$('.m-page',app).forEach(p=>p.classList.toggle('active',p.dataset.mpage===b.dataset.main));
      window.scrollTo({top:$('.m-main-nav',app).offsetTop,behavior:'smooth'});
    }));
    $$('.m-day',app).forEach(b=>b.addEventListener('click',()=>{
      $$('.m-day',app).forEach(x=>x.classList.toggle('active',x===b));
      const i=+b.dataset.day; renderDay(days[i],i);
    }));
    $$('#mGuideCats .m-cat',app).forEach(b=>b.addEventListener('click',()=>{
      $$('#mGuideCats .m-cat',app).forEach(x=>x.classList.toggle('active',x===b)); renderGuide(b.dataset.guideKey);
    }));
    $$('#mToolCats .m-cat',app).forEach(b=>b.addEventListener('click',()=>{
      $$('#mToolCats .m-cat',app).forEach(x=>x.classList.toggle('active',x===b)); renderTools(b.dataset.opsKey);
    }));
    $$('.m-filter',app).forEach(b=>b.addEventListener('click',()=>{
      $$('.m-filter',app).forEach(x=>x.classList.toggle('active',x===b));
      const f=b.dataset.areaFilter; $$('.m-shop',app).forEach(x=>x.style.display=(f==='全部'||x.dataset.area===f)?'block':'none');
    }));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
