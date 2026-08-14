(()=>{
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=(el,v)=>{if(el)el.textContent=v};
  const map=(label,query)=>`<a class="mapbtn" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}" target="_blank" rel="noopener noreferrer">${label} · Google Maps ↗</a>`;
  const stop=(time,title,desc,transport,links=[])=>`<div class="stop repeat stop-item"><div class="time" data-edit>${time}</div><div><h3 data-edit>${title}</h3><p data-edit>${desc}</p><div class="transport" data-edit>${transport}</div><div class="maplinks">${links.map(x=>map(x[0],x[1])).join('')}</div></div><div class="stop-tools"><button class="stop-check" data-action="toggle-stop">Done</button><button class="iconbtn edit-only" data-action="clone">Copy</button><button class="iconbtn danger edit-only" data-action="delete">×</button></div></div>`;
  const setChips=(sec,items)=>{const r=q('.day-route',sec);if(r)r.innerHTML=items.map(x=>`<span class="route-chip" data-edit>${x}</span>`).join('')};

  const tabs=qa('#dayTabs .day-tab');
  if(tabs[0]){
    text(q('.tab-title',tabs[0]),'Arrival / Umeda Shopping');
    text(q('.tab-note',tabs[0]),'UNIQLO・HOKA・梅田購物圈');
  }

  const d1=q('[data-day-panel="0"]');
  if(!d1)return;

  text(q('h2',d1),'抵達大阪・梅田 Shopping Walk');
  text(q('.panel-header p',d1),'第一天不跨區：Check-in 後從飯店所在的 Grand Green Osaka 開始，串 Grand Front、LINKS UMEDA、LUCUA。UNIQLO 與 HOKA 都安排在 LINKS UMEDA，一棟逛完，再接 Pokémon Center Osaka。');
  setChips(d1,['KIX','Hotel','Grand Green','Grand Front','UNIQLO','HOKA','LUCUA']);

  const tl=q('.timeline',d1);
  if(tl)tl.innerHTML=[
    stop('12:00','KIX 抵達・入境','預留 60–90 分鐘入境、領行李與前往 JR 關西機場站。','KIX → JR HARUKA',[['KIX','Kansai International Airport']]),
    stop('13:30','HARUKA → JR 大阪站 → 飯店','抵達大阪站後步行到 Hotel Hankyu GRAN RESPIRE OSAKA，寄放行李／Check-in。','約 50 分鐘＋大阪站步行圈',[['Hotel','Hotel Hankyu GRAN RESPIRE OSAKA']]),
    stop('15:30','Grand Green Osaka｜先逛飯店樓下','飯店就在 Grand Green Osaka 南館，先用最省力的方式逛園區與商場、喝咖啡、熟悉回飯店路線。','Hotel → Grand Green Osaka 徒步',[['Grand Green Osaka','Grand Green Osaka South Building Osaka']]),
    stop('16:00','Grand Front Osaka｜飯店旁第一站','從 Grand Green 接 Grand Front 幾乎不需要繞路，適合先逛服飾、生活選物與雜貨，再往大阪站東側走。','Grand Green → Grand Front 徒步',[['Grand Front Osaka','Grand Front Osaka']]),
    stop('17:00','LINKS UMEDA｜UNIQLO＋HOKA 一棟完成','UNIQLO UMEDA 在 LINKS UMEDA 1–2F；接著上 4F Super Sports Xebio 看 HOKA。HOKA 型號與庫存以現場為準，不必特地再跑心齋橋。','Grand Front → LINKS UMEDA 徒步',[['UNIQLO UMEDA','UNIQLO UMEDA LINKS UMEDA Osaka'],['HOKA / Super Sports Xebio','Super Sports Xebio LINKS UMEDA Osaka'],['LINKS UMEDA','LINKS UMEDA Osaka']]),
    stop('18:15','LUCUA Osaka＋Pokémon Center Osaka','回到大阪站，逛 LUCUA／LUCUA 1100，最後進 Pokémon Center Osaka。這一段全部集中在大阪站建築群，不用再搭車。','LINKS UMEDA → LUCUA 徒步',[['LUCUA Osaka','LUCUA Osaka'],['Pokémon Center Osaka','Pokémon Center Osaka LUCUA Osaka']]),
    stop('19:30','梅田晚餐＋附近好逛備選','晚餐留在梅田。若還有體力，再從阪急百貨、Yodobashi Camera、KITTE 大阪三個裡挑一個；不要第一天全部硬塞。','大阪站／梅田全程步行',[['阪急うめだ本店','Hankyu Umeda Main Store Osaka'],['Yodobashi Camera','Yodobashi Camera Multimedia Umeda Osaka'],['KITTE大阪','KITTE Osaka'],['CARDBOX OSAKA','CARDBOX OSAKA BREEZE BREEZE']])
  ].join('');

  const head=q('.poke-head',d1);
  if(head){
    text(q('h3',head),'梅田補卡＋Shopping Loop');
    text(q('p',head),'第一天的購物全部綁在飯店周邊：Grand Green → Grand Front → LINKS UMEDA（UNIQLO / HOKA）→ LUCUA / Pokémon Center。');
  }
  text(q('.poke-route-line',d1),'Hotel → Grand Green → Grand Front → LINKS UMEDA（UNIQLO 1–2F / HOKA @ Xebio 4F）→ LUCUA → Pokémon Center Osaka');
  const foot=q('.poke-foot p',d1);
  if(foot)foot.textContent='第一天重點是順路，不追求逛完全部梅田。UNIQLO、HOKA、Pokémon Center 優先；阪急、Yodobashi、KITTE 視體力加減。';

  if(typeof bind==='function')bind();
  if(typeof bindTabs==='function')bindTabs();
  if(typeof syncTabs==='function')syncTabs();
})();
