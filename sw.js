const V='dfx-v10';
const CORE=['./','index.html','menu.js','service.js','bar.js','manifest.webmanifest','dragonfly.png','icon-192.png','icon-512.png','icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
function timeout(p,ms){return new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('t')),ms);p.then(x=>{clearTimeout(t);res(x);},e=>{clearTimeout(t);rej(e);});});}
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  const cardsFile=u.pathname.indexOf('/cards/')>=0;
  if(!cardsFile&&(r.mode==='navigate'||/\.(html|js)$/.test(u.pathname)||u.pathname.endsWith('/'))){
    e.respondWith(caches.match(r,{ignoreSearch:true}).then(cached=>{
      const net=fetch(r).then(x=>{if(x&&x.ok){const cp=x.clone();caches.open(V).then(c=>c.put(r,cp));}return x;});
      if(!cached)return net.catch(()=>caches.match('index.html'));
      return timeout(net,2500).catch(()=>cached);
    }));
  }else{
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x&&x.ok){const cp=x.clone();caches.open(V).then(c=>c.put(r,cp));}return x;})));
  }
});
