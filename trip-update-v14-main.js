(()=>{
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=(el,v)=>{if(el)el.textContent=v};
  const map=(label,query)=>`<a class="mapbtn" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}" target="_blank" rel="noopener noreferrer">${label} · Google Maps ↗</a>`;
  const stop=(time,title,desc,transport,links=[])=>`<div class="stop repeat stop-item"><div class="time" data-edit>${time}</div><div><h3 data-edit>${title}</h3><p data-edit>${desc}</p><div class="transport" data-edit>${transport}</div><div class="maplinks">${links.map(x=>map(x[0],x[1])).join('')}</div></div><div class="stop-tools"><button class="stop-check" data-action="toggle-stop">Done</button><button class="iconbtn edit-only" data-action="clone">Copy</button><button class="iconbtn danger edit-only" data-action="delete">×</button></div></div>`;
  const setChips=(sec,items)=>{const r=q('.day-route',sec);if(r)r.innerHTML=items.map(x=>`<span class="route-chip" data-edit>${x}</span>`).join('')};

  const tabs=qa('#dayTabs .day-tab');
  if(tabs[2]){text(q('.tab-title',tabs[2]),'City Walk / Temple Run');text(q('.tab-note',tabs[2]),'勝尾寺・大鳥大社・難波巡店')}
  if(tabs[4]){text(q('.tab-title',tabs[4]),'City Walk / Flight Home');text(q('.tab-note',tabs[4]),'梅田散步＋移動日回台灣')}

  const d3=q('[data-day-panel="2"]');
  if(d3){
    text(q('h2',d3),'大阪 City Walk＋Pokémon Card 巡店日');
    text(q('.panel-header p',d3),'把勝尾寺與大鳥大社集中在這天：早上先跑有入山時間限制的勝尾寺，中午南下大鳥大社，傍晚回難波／日本橋做 City Walk 與 Pokémon Card 巡店。這天移動量最大，咖啡與午餐改成機動穿插。');
    setChips(d3,['Katsuoji','Otori Taisha','Namba','Nipponbashi']);
    const tl=q('.timeline',d3); if(tl)tl.innerHTML=[
      stop('07:45','飯店出發 → 箕面萱野','從大阪站／梅田往箕面萱野，目標銜接早上的勝尾寺直行巴士。早餐以飯店或車站快速解決。','梅田 → Osaka Metro 御堂筋線／北大阪急行 → 箕面萱野',[['箕面萱野駅','Minoh-Kayano Station']]),
      stop('09:00','勝尾寺｜Katsuoji','先把最受時間限制的景點完成。8/29 是週六，保留約 90 分鐘參拜、達摩與拍照；離開前確認回箕面萱野的巴士班次。','箕面萱野 → 勝尾寺直行巴士；回程再返回箕面萱野',[['勝尾寺','Katsuoji Temple Osaka']]),
      stop('12:30','南下大鳥大社｜Otori Taisha','從箕面萱野一路南下到鳳站，大鳥大社從 JR 鳳站步行約 5 分鐘。控制在約 45–60 分鐘，保留傍晚大阪市區時間。','箕面萱野 → 御堂筋／北大阪急行 → 天王寺 → JR 阪和線 → 鳳',[['大鳥大社','Otori Taisha Osaka']]),
      stop('15:00','難波八阪神社＋Late Lunch','回到大阪市區後正式開始 City Walk。先難波八阪神社，再把 ニューベイブ、AUN COFFEE、Bibi’s 視現場排隊狀況擇一或二穿插，不硬塞全部。','鳳 → 天王寺 → 難波；之後以步行為主',[['難波八阪神社','Namba Yasaka Jinja Osaka'],['ニューベイブ','ニューベイブ 大阪 難波'],['AUN COFFEE','AUN COFFEE ROASTERS Osaka'],['Bibi’s','Bibi’s Cafe Bar Osaka']]),
      stop('17:00','Pokémon Center Osaka DX → 難波／日本橋 Card Hunt','先看心齋橋官方店，再往南回到難波、日本橋集中巡 Hareruya2、TCG Capital、Dragon Star、Card Labo。晚間卡店比神社寺院更有彈性。','心齋橋 → 難波 → 日本橋，步行＋短程 Metro',[['Pokémon Center Osaka DX','Pokémon Center Osaka DX Daimaru Shinsaibashi'],['Hareruya2 Namba','Hareruya 2 Namba Osaka'],['Dragon Star 日本橋','Dragon Star Nipponbashi Osaka']]),
      stop('20:00','難波晚餐＋藥妝','巡店結束後在難波／心齋橋吃牛肉、燒肉或拉麵，再補日本藥妝。今天行程很滿，晚餐不安排跨區名店。','難波／心齋橋步行圈 → 梅田回飯店',[['心齋橋藥妝','drugstore Shinsaibashi Osaka']])
    ].join('');
    text(q('.poke-head h3',d3),'晚間集中巡店｜Shinsaibashi → Namba → Nipponbashi');
    text(q('.poke-head p',d3),'白天先完成勝尾寺與大鳥大社，Pokémon Card 全部集中傍晚後處理，避免為單一卡店打亂神社寺院時間。');
    text(q('.poke-route-line',d3),'勝尾寺 → 大鳥大社 → Pokémon Center Osaka DX → Hareruya2 Namba → TCG Capital → Dragon Star → Card Labo');
    text(q('.poke-foot p',d3),'若前兩個景點延誤，先保留 Pokémon Center Osaka DX＋日本橋 2–3 間核心卡店；AUN / Bibi’s / ニューベイブ 可直接刪減。');
  }

  const d5=q('[data-day-panel="4"]');
  if(d5){
    text(q('h2',d5),'大阪 City Walk＋移動日回台灣');
    text(q('.panel-header p',d5),'最後一天不再跨城跑奈良或大鳥。Check-out 後把行李留在飯店，上午到中午只走梅田／大阪站周邊，做最後購物、補卡與吃飯，再依回程班機時間前往 KIX。');
    setChips(d5,['Hotel','Umeda City Walk','Last Card Hunt','KIX','Taiwan']);
    const tl=q('.timeline',d5); if(tl)tl.innerHTML=[
      stop('09:00','Check-out・行李寄放飯店','退房後把大件行李留在 GRAN RESPIRE OSAKA。最後一天只留大阪站周邊活動，不再安排長距離往返。','Hotel → Grand Green Osaka / Osaka Station 徒步圈',[['Hotel','Hotel Hankyu GRAN RESPIRE OSAKA']]),
      stop('09:30','大阪 City Walk｜Grand Green → Grand Front → LUCUA','用最輕鬆的節奏逛大阪站北側與站內商場；可安排咖啡、伴手禮與最後藥妝採買。','全程步行，避免最後一天再拉遠距離',[['Grand Green Osaka','Grand Green Osaka'],['LUCUA Osaka','LUCUA Osaka']]),
      stop('11:00','最後 Pokémon Card Hunt','回 Pokémon Center Osaka／CARDBOX OSAKA，只補前四天缺貨清單，不開新戰線。買完直接整理進行李。','大阪站／西梅田步行圈',[['Pokémon Center Osaka','Pokémon Center Osaka LUCUA Osaka'],['CARDBOX OSAKA','CARDBOX OSAKA BREEZE BREEZE']]),
      stop('12:30','大阪站最後午餐・取行李','午餐放在 LUCUA、KITTE 大阪或阪神梅田，吃完回飯店取行李。若班機較早，這一段直接縮短。','Umeda lunch → Hotel luggage pickup',[['KITTE大阪','KITTE Osaka']]),
      stop('依班機','大阪 → KIX → 台灣','依實際回程班機倒推離開大阪站的時間。前往機場後完成報到、托運、安檢與最後免稅採買。','大阪站 → KIX；HARUKA / 關空快速依當日車次選擇',[['Kansai International Airport','Kansai International Airport']])
    ].join('');
    text(q('.poke-head h3',d5),'最後補貨｜Umeda Only');
    text(q('.poke-head p',d5),'最後一天只補前幾天沒買到的卡、盒與周邊，不再去難波或日本橋；買完回飯店拿行李前往 KIX。');
    text(q('.poke-route-line',d5),'Grand Green / LUCUA → Pokémon Center Osaka → CARDBOX OSAKA → Hotel → KIX');
    text(q('.poke-foot p',d5),'班機時間一旦確認，以「不影響前往 KIX」為最高優先；若時間不足，直接取消 CARDBOX，只留 LUCUA 內的 Pokémon Center Osaka。');
  }

  const reset=q('#resetBtn'); if(reset)reset.onclick=()=>{if(confirm('恢復目前新版的預設內容？')){Object.keys(localStorage).filter(k=>k.startsWith('kansai-luxe-pokemon-v14')).forEach(k=>localStorage.removeItem(k));location.reload()}};
  if(typeof bind==='function')bind(); if(typeof bindTabs==='function')bindTabs(); if(typeof syncTabs==='function')syncTabs();
})();
