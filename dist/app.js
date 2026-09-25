(() => {
  'use strict';
  const content = window.MOON_LETTER;
  const $ = id => document.getElementById(id);
  const experience=$('experience'), letter=$('letter'), card=$('greeting-card'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let finishTimer=null, transitionTimer=null, busy=false, lastFocus=null, savedScroll=0, panelHeight=180;
  const say=text=>{$('announcement').textContent=text;};
  ['greeting-first','greeting-body','greeting-last'].forEach((id,i)=>{$(id).textContent=content.blessing[i]||'';});
  card.alt=content.cardAlt;
  [card,$('large-card')].forEach(image=>{image.width=content.cardWidth||1536;image.height=content.cardHeight||1024;});
  function measurePaper(){
    const heights=[...document.querySelectorAll('.paper-panel')].map(panel=>{
      const style=getComputedStyle(panel);let total=parseFloat(style.paddingTop)+parseFloat(style.paddingBottom)+2;
      [...panel.children].filter(el=>getComputedStyle(el).position!=='absolute').forEach(el=>{const s=getComputedStyle(el);total+=el.offsetHeight+parseFloat(s.marginTop||0)+parseFloat(s.marginBottom||0);});return total;
    });
    const next=Math.ceil(Math.max(180,...heights));if(next!==panelHeight){panelHeight=next;document.documentElement.style.setProperty('--panel-h',next+'px');}
  }
  function loadCard(){
    if(card.getAttribute('src'))return;
    card.loading='eager';card.src=content.cardImage;$('image-status').hidden=false;$('image-status').textContent='正在展开随信附笺…';
  }
  card.addEventListener('load',()=>{card.width=card.naturalWidth;card.height=card.naturalHeight;$('image-status').hidden=true;});
  card.addEventListener('error',()=>{
    const status=$('image-status');status.replaceChildren();status.hidden=false;status.append('贺卡暂时没有加载好。');
    const retry=document.createElement('button');retry.type='button';retry.className='quiet-button image-retry';retry.textContent='重新加载';
    retry.addEventListener('click',()=>{card.removeAttribute('src');loadCard();});status.append(retry);
  });
  function finishOpen(){
    if(experience.dataset.state!=='opening')return;
    clearTimeout(finishTimer);experience.dataset.state='open';letter.setAttribute('aria-hidden','false');$('letter-actions').hidden=false;say('书信已展开。'+content.blessing.join(' '));
  }
  function openLetter(){
    if(experience.dataset.state!=='closed'||busy)return;
    measurePaper();experience.dataset.state='opening';$('open-envelope').disabled=true;$('open-envelope').hidden=true;$('invitation').hidden=true;loadCard();say('正在打开书信。');
    if(reduced.matches||!window.CSS||!CSS.supports('transform-style','preserve-3d'))finishOpen();else finishTimer=setTimeout(finishOpen,2700);
  }
  // Fallback completes the flow if an embedded browser skips animationend.
  letter.addEventListener('animationend',event=>{if(event.target===letter&&event.animationName==='extract')finishOpen();});
  function replay(){
    clearTimeout(finishTimer);clearTimeout(transitionTimer);busy=false;$('card-view').hidden=true;$('letter-view').hidden=false;
    $('letter-view').classList.remove('view-leaving','view-entering');$('card-view').classList.remove('view-leaving','view-entering');
    experience.dataset.state='closed';letter.setAttribute('aria-hidden','true');$('letter-actions').hidden=true;$('invitation').hidden=false;$('open-envelope').hidden=false;$('open-envelope').disabled=false;
    measurePaper();window.scrollTo({top:0,behavior:reduced.matches?'auto':'smooth'});$('open-envelope').focus({preventScroll:true});say('信封已合上，可以再次开启。');
  }
  function changeView(from,to,focusId){
    if(busy)return;busy=true;from.classList.add('view-leaving');
    transitionTimer=setTimeout(()=>{from.hidden=true;from.classList.remove('view-leaving');to.hidden=false;to.classList.add('view-entering');window.scrollTo({top:0,behavior:'auto'});busy=false;if(focusId)$(focusId).focus({preventScroll:true});},reduced.matches?0:280);
  }
  function showCard(){loadCard();changeView($('letter-view'),$('card-view'),'greeting-card');say('随信附上的中秋贺卡。');}
  function openLightbox(){
    if(!card.complete||!card.naturalWidth)return;
    lastFocus=document.activeElement;savedScroll=window.scrollY;const large=$('large-card');large.src=content.cardImage;large.width=card.naturalWidth;large.height=card.naturalHeight;
    $('lightbox').hidden=false;$('lightbox').dataset.zoomed='true';$('fit-image').textContent='适应屏幕';
    document.body.style.position='fixed';document.body.style.top=-savedScroll+'px';document.body.style.width='100%';experience.setAttribute('aria-hidden','true');if('inert' in experience)experience.inert=true;$('close-lightbox').focus({preventScroll:true});
  }
  function closeLightbox(){
    if($('lightbox').hidden)return;
    $('lightbox').hidden=true;document.body.style.position='';document.body.style.top='';document.body.style.width='';experience.removeAttribute('aria-hidden');if('inert' in experience)experience.inert=false;window.scrollTo({top:savedScroll,behavior:'instant'});lastFocus?.focus({preventScroll:true});
  }
  $('open-envelope').addEventListener('click',openLetter);$('show-card').addEventListener('click',showCard);
  $('back-letter').addEventListener('click',()=>{changeView($('card-view'),$('letter-view'),'show-card');});
  $('replay').addEventListener('click',replay);$('replay-card').addEventListener('click',replay);
  card.addEventListener('click',openLightbox);card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openLightbox();}});
  $('close-lightbox').addEventListener('click',closeLightbox);
  $('fit-image').addEventListener('click',()=>{const zoomed=$('lightbox').dataset.zoomed!=='true';$('lightbox').dataset.zoomed=String(zoomed);$('fit-image').textContent=zoomed?'适应屏幕':'放大查看';});
  document.addEventListener('keydown',event=>{if(!$('lightbox').hidden){if(event.key==='Escape')closeLightbox();if(event.key==='Tab'){const first=$('fit-image'),last=$('close-lightbox');if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}}});
  $('lightbox').addEventListener('click',event=>{if(event.target===$('lightbox')||event.target.classList.contains('lightbox-scroll'))closeLightbox();});
  const mediaChange=event=>{if(event.matches&&experience.dataset.state==='opening')finishOpen();};
  if(reduced.addEventListener)reduced.addEventListener('change',mediaChange);else reduced.addListener(mediaChange);
  if('ResizeObserver' in window){const observer=new ResizeObserver(measurePaper);observer.observe(letter);document.querySelectorAll('.paper-panel p').forEach(el=>observer.observe(el));}else window.addEventListener('resize',measurePaper);
  measurePaper();
})();
