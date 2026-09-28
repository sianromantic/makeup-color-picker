(() => {
  'use strict';
  const items = window.COLORWAYS || [];
  const byId = new Map(items.map(item => [item.id, item]));
  const key = 'for-you-color-favorites-v1';
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const heart = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
  let saved = new Set();
  let mode = 'all';
  let detailId = null;
  let toastTimer;
  try { const stored = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(stored)) saved = new Set(stored.filter(id => byId.has(id))); } catch { /* Storage is optional. */ }

  function selectedItems() { return items.filter(item => saved.has(item.id)); }
  function persist() { try { localStorage.setItem(key, JSON.stringify([...saved])); } catch { /* Selection remains available in this tab. */ } }
  function toast(message) { $('toast').textContent = message; $('toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 2800); }
  function colorName(material) { return material.name.replace(/^(PETG|PLA) (Matte|Basic|Translucent|Wood) /, ''); }
  function compactDescription(item) { return [...new Set([colorName(item.cap),colorName(item.back),colorName(item.cup)])].join(' · '); }

  $('gallery').innerHTML = items.map((item,index) => {
    const swatches = [...new Set([item.cap.hex,item.back.hex,item.cup.hex])].map(color => '<span class="swatch" style="background:'+escape(color)+'"></span>').join('');
    return '<article class="card" data-card="'+item.id+'"><div class="card-visual"><button type="button" class="open-color" data-open="'+item.id+'" aria-label="查看 '+item.id+' '+escape(item.name)+' 大圖"><img src="'+item.thumb+'" alt="'+escape(item.name)+'，左側關門、右側開門" width="720" height="480" loading="'+(index<3?'eager':'lazy')+'" decoding="async"'+(index===0?' fetchpriority="high"':'')+'></button><button type="button" class="save-button" data-save="'+item.id+'" aria-pressed="false" aria-label="收藏 '+item.id+' '+escape(item.name)+'">'+heart+'</button></div><div class="card-body"><div class="card-title-row"><span class="card-number">NO. '+item.id+'</span><h2><button type="button" class="card-heading-button" data-open="'+item.id+'">'+escape(item.name)+'</button></h2></div><div class="card-meta"><span class="swatches" aria-hidden="true">'+swatches+'</span><span class="card-description">'+escape(compactDescription(item))+'</span></div></div></article>';
  }).join('');

  function render() {
    const count = saved.size;
    document.querySelectorAll('[data-card]').forEach(card => {
      const isSaved = saved.has(card.dataset.card);
      card.hidden = mode === 'saved' && !isSaved;
      card.classList.toggle('is-saved',isSaved);
      const button=card.querySelector('[data-save]');
      button.setAttribute('aria-pressed',String(isSaved));
      button.setAttribute('aria-label',(isSaved?'取消收藏 ':'收藏 ')+card.dataset.card+' '+byId.get(card.dataset.card).name);
      button.querySelector('svg').setAttribute('fill',isSaved?'currentColor':'none');
    });
    $('saved-count').textContent = count;
    $('all-tab').classList.toggle('active',mode==='all');
    $('saved-tab').classList.toggle('active',mode==='saved');
    $('all-tab').setAttribute('aria-pressed',String(mode==='all'));
    $('saved-tab').setAttribute('aria-pressed',String(mode==='saved'));
    $('empty').hidden = mode !== 'saved' || count > 0;
    $('selection-bar').hidden = count === 0;
    $('selection-title').textContent = '已收藏 '+count+' 款';
    $('selection-names').textContent = selectedItems().map(item=>item.id+' '+item.name).join('、');
    if (detailId) updateDetailSave();
  }
  function switchMode(next) { mode=next; render(); }
  function toggle(id) {
    if (!byId.has(id)) return;
    const removed=saved.has(id);
    if (removed) saved.delete(id); else saved.add(id);
    persist(); render();
    toast(removed?'已從收藏移除':'已收藏 '+id+' '+byId.get(id).name);
    if (mode==='saved' && removed && !detailId) $('saved-tab').focus({preventScroll:true});
  }
  $('gallery').addEventListener('click',event => {
    const save=event.target.closest('[data-save]');
    if (save) { toggle(save.dataset.save); return; }
    const open=event.target.closest('[data-open]');
    if (open) openDetail(open.dataset.open);
  });
  $('all-tab').addEventListener('click',()=>switchMode('all'));
  $('saved-tab').addEventListener('click',()=>switchMode('saved'));
  $('browse-all').addEventListener('click',()=>{switchMode('all');$('all-tab').focus()});

  function updateDetailSave() {
    const isSaved=saved.has(detailId);
    $('detail-save').textContent=isSaved?'♥ 已收藏 · 點此移除':'♡ 收藏這個顏色';
    $('detail-save').classList.toggle('saved',isSaved);
    $('detail-save').setAttribute('aria-pressed',String(isSaved));
  }
  function showDetail(id) {
    const item=byId.get(id);
    if (!item) return;
    detailId=id;
    const index=items.indexOf(item);
    $('detail-counter').textContent='NO. '+id+' / 30';
    $('detail-title').textContent=item.name;
    $('detail-image').src=item.image;
    $('detail-image').alt=id+' '+item.name+'，左側關門、右側開門';
    $('full-image').href=item.image;
    $('detail-position').textContent=(index+1)+' / '+items.length;
    $('previous-color').disabled=index===0;
    $('next-color').disabled=index===items.length-1;
    $('detail-materials').innerHTML=[['上下蓋',item.cap],['固定背板',item.back],['內部分隔',item.cup],['滑門',item.door]].map(([label,material])=>'<div class="material-row"><span class="material-dot" style="background:'+escape(material.hex)+'"></span><span><small>'+label+'</small>'+escape(material.name)+'</span></div>').join('');
    updateDetailSave();
  }
  function openDetail(id) { showDetail(id); if(detailId && !$('detail-dialog').open) $('detail-dialog').showModal(); }
  function stepDetail(step) { const index=items.findIndex(item=>item.id===detailId); const next=items[index+step]; if(next) showDetail(next.id); }
  $('detail-save').addEventListener('click',()=>toggle(detailId));
  $('previous-color').addEventListener('click',()=>stepDetail(-1));
  $('next-color').addEventListener('click',()=>stepDetail(1));
  $('detail-dialog').addEventListener('close',()=>{detailId=null});
  $('detail-dialog').addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();stepDetail(-1)}if(event.key==='ArrowRight'){event.preventDefault();stepDetail(1)}});
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()});
  });

  function selectionUrl() {
    if (!/^https?:$/.test(location.protocol)) return '';
    const url=new URL(location.href);url.hash='picks='+selectedItems().map(item=>item.id).join(',');return url.toString();
  }
  function selectionText() { const url=selectionUrl();return '我喜歡這幾款收納盒配色 ♡\n\n'+selectedItems().map(item=>item.id+' '+item.name).join('\n')+(url?'\n\n一起看看：\n'+url:''); }
  function openShare() {
    if(!saved.size) return;
    $('share-chips').innerHTML=selectedItems().map(item=>'<span class="share-chip">'+item.id+' '+escape(item.name)+'</span>').join('');
    $('share-text').value=selectionText();
    $('copy-link').hidden=!selectionUrl();
    $('native-share').hidden=typeof navigator.share!=='function';
    $('share-dialog').showModal();
  }
  async function copy(text) {
    try { if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(text);toast('已複製，貼到聊天裡就可以了'); }
    catch { $('share-text').value=text;$('share-text').focus();$('share-text').select();toast('請長按或按 Ctrl/Cmd+C 複製選取的文字'); }
  }
  $('send-selection').addEventListener('click',openShare);
  $('copy-list').addEventListener('click',()=>copy(selectionText()));
  $('copy-link').addEventListener('click',()=>copy(selectionUrl()));
  $('native-share').addEventListener('click',async()=>{try{await navigator.share({title:'我的收納盒配色',text:selectionText()})}catch(error){if(error.name!=='AbortError')toast('請改用複製清單，再貼到聊天裡')}});
  function readSharedSelection() {
    const params=new URLSearchParams(location.hash.slice(1));
    if(!params.has('picks'))return;
    const incoming=[...new Set((params.get('picks')||'').slice(0,500).split(',').filter(id=>byId.has(id)))];
    if(!incoming.length)return;
    saved=new Set(incoming);persist();mode='saved';$('incoming-note').hidden=false;
  }
  readSharedSelection();
  window.addEventListener('hashchange',()=>{readSharedSelection();render()});
  window.addEventListener('storage',event=>{if(event.key!==key)return;try{const value=JSON.parse(event.newValue||'[]');if(Array.isArray(value)){saved=new Set(value.filter(id=>byId.has(id)));render()}}catch{}});
  render();

  const context=document.modelContext;
  if(context?.registerTool){
    const lifecycle=new AbortController();
    const register=tool=>{try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{})}catch{}};
    register({name:'read_color_choices',description:'Read the 30 available organizer color combinations and current local favorites.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>({colors:items.map(({id,name})=>({id,name})),favorites:[...saved]})});
    register({name:'set_color_favorites',description:'Replace the locally saved favorites with the selected color IDs and update the visible gallery. This does not send a message.',inputSchema:{type:'object',properties:{ids:{type:'array',items:{type:'string',enum:items.map(item=>item.id)},uniqueItems:true,maxItems:30}},required:['ids'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!input||!Array.isArray(input.ids)||input.ids.length>30||Object.keys(input).some(k=>k!=='ids')||input.ids.some(id=>!byId.has(id)))throw new Error('Provide valid color IDs from 01 to 30.');saved=new Set(input.ids);persist();render();return {favorites:[...saved]}}});
    window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
})();
