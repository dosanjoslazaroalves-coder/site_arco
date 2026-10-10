export function initNavigation() {
  const header=document.querySelector('#site-header');
  const menu=document.querySelector('#menu-toggle');
  const nav=document.querySelector('#main-nav');
  const sections=[...document.querySelectorAll('[data-nav-theme]')];
  const links=[...nav.querySelectorAll('a')];
  function closeMenu(){header.classList.remove('is-menu-open');menu.setAttribute('aria-expanded','false');}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));header.classList.toggle('is-menu-open',open);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&header.classList.contains('is-menu-open')){closeMenu();menu.focus();}});
  document.addEventListener('click',e=>{if(!header.contains(e.target))closeMenu();});
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const id=a.getAttribute('href');const target=document.getElementById(id.slice(1));if(!target)return;
    e.preventDefault();closeMenu();
    if(document.body.classList.contains('at-door'))document.dispatchEvent(new CustomEvent('arcor:skip-intro'));
    history.replaceState(null,'',id);
    target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('reduce-motion')?'instant':'smooth',block:'start'});
    if(!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
  }));
  let scheduled=false;
  function update(){
    scheduled=false;let current=sections[0];
    for(const section of sections){if(section.getBoundingClientRect().top<=header.offsetHeight+12)current=section;}
    header.dataset.theme=current?.dataset.navTheme||'light';
    const max=document.documentElement.scrollHeight-innerHeight;
    header.style.setProperty('--progress',String(max>0?Math.min(1,scrollY/max):0));
    const sectionId=current?.id;let active='#conceito';
    if(sectionId==='implantacao')active='#implantacao';
    else if(['pacoca','sete-belo','poosh'].includes(sectionId))active='#projetos';
    else if(sectionId==='engenharia')active='#engenharia';
    else if(sectionId==='galeria')active='#galeria';
    else if(['equipe','final'].includes(sectionId))active='#equipe';
    links.forEach(a=>{if(a.hash===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  }
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
  addEventListener('resize',()=>{if(innerWidth>700)closeMenu();update();});update();
}
