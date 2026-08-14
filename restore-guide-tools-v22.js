(()=>{
  const files=['g01.txt','g02a1.txt','g02fix937.txt','g02a2_2.txt','g02b.txt','g03.txt','g04.txt','g05.txt','g06.txt','g07a1_1.txt','g07a1_2.txt','g07a2.txt','g07b.txt','g08.txt','g09.txt','g10.txt'];
  const completeGuide=()=>{const x=document.querySelector('#travelGuide');return !!(x&&x.querySelector('#guideTabs')&&x.textContent.includes('大阪・京都・奈良'))};
  const completeTools=()=>{const x=document.querySelector('#tripControlCenter');return !!(x&&x.querySelector('#opsTabs')&&x.textContent.includes('五日關西旅'))};
  async function originalDocument(){
    const parts=await Promise.all(files.map(async f=>{const r=await fetch(f,{cache:'no-store'});if(!r.ok)throw new Error('Missing '+f);return (await r.text()).trim()}));
    parts[2]=parts[2].slice(0,656)+'l'+parts[2].slice(656)+'9';
    const b64=parts.join('');
    const bin=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
    const stream=new Blob([bin]).stream().pipeThrough(new DecompressionStream('gzip'));
    const html=await new Response(stream).text();
    return new DOMParser().parseFromString(html,'text/html');
  }
  function put(id,fresh,after){
    if(!fresh)return;
    const old=document.getElementById(id);
    const node=document.importNode(fresh,true);
    if(old)old.replaceWith(node);
    else{
      const anchor=document.querySelector(after);
      if(anchor)anchor.insertAdjacentElement('afterend',node);
      else document.querySelector('.shell')?.appendChild(node);
    }
  }
  window.__guideToolsRestorePromise=(async()=>{
    if(completeGuide()&&completeTools()){
      document.dispatchEvent(new CustomEvent('guide-tools-restored'));
      return;
    }
    try{
      const doc=await originalDocument();
      if(!completeGuide())put('travelGuide',doc.querySelector('#travelGuide'),'.atlas');
      if(!completeTools())put('tripControlCenter',doc.querySelector('#tripControlCenter'),'#travelGuide');
      if(typeof bindGuideTabs==='function')bindGuideTabs();
      if(typeof bindOpsTabs==='function')bindOpsTabs();
      if(typeof bindMealTabs==='function')bindMealTabs();
      if(typeof bindOpsActions==='function')bindOpsActions();
      if(typeof bindBudget==='function')bindBudget();
      if(typeof bind==='function')bind();
      document.dispatchEvent(new CustomEvent('guide-tools-restored'));
    }catch(e){console.error('restore guide/tools failed',e)}
  })();
})();