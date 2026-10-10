import {initNavigation} from './navigation.js';
document.documentElement.classList.add('js');
const params=new URLSearchParams(location.search);
if(params.get('motion')==='reduce')document.documentElement.classList.add('reduce-motion');
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('reduce-motion');
const portal=document.querySelector('#inicio');const content=document.querySelector('#site-content');
let opening=false;
function finishOpening(){portal.hidden=true;content.inert=false;document.body.classList.remove('at-door');opening=false;document.querySelector('#conceito .display').focus({preventScroll:true});}
function openDoors(skip=false){
  if(opening||portal.hidden)return;opening=true;document.querySelector('#open-doors').disabled=true;
  if(skip||reduced())finishOpening();
  else{portal.classList.add('is-opening');setTimeout(finishOpening,2100);}
}
initNavigation();
if(location.hash&&location.hash!=='#inicio'){
  portal.hidden=true;content.inert=false;
}else{document.body.classList.add('at-door');content.inert=true;window.scrollTo(0,0);}
document.querySelector('#open-doors').addEventListener('click',()=>openDoors());
document.querySelector('#skip-intro').addEventListener('click',()=>openDoors(true));
document.addEventListener('arcor:skip-intro',()=>openDoors(true));
document.querySelector('#replay-intro').addEventListener('click',()=>{
  window.scrollTo({top:0,behavior:'instant'});history.replaceState(null,'','#inicio');portal.hidden=false;portal.classList.remove('is-opening');document.body.classList.add('at-door');content.inert=true;document.querySelector('#open-doors').disabled=false;document.querySelector('#open-doors').focus();
});
const revealObserver=new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('active');observer.unobserve(entry.target);}});},{threshold:.08,rootMargin:'0px 0px -20px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

// Native lightbox, deduplicated across project sections and the gallery.
const dialog=document.querySelector('#lightbox');const photo=document.querySelector('#lightbox-image');const caption=document.querySelector('#lightbox-caption');
const pictures=[...new Map([...document.querySelectorAll('[data-lightbox]')].map(b=>[b.dataset.lightbox,{src:b.dataset.lightbox,caption:b.dataset.caption,alt:b.querySelector('img').alt}])).values()];
let pictureIndex=0,previousFocus;
function updatePhoto(index){pictureIndex=(index+pictures.length)%pictures.length;const item=pictures[pictureIndex];photo.src=item.src;photo.alt=item.alt;caption.textContent=item.caption;document.querySelector('#lightbox-count').textContent=`${pictureIndex+1} / ${pictures.length}`;}
document.querySelectorAll('[data-lightbox]').forEach(b=>b.addEventListener('click',()=>{previousFocus=b;updatePhoto(pictures.findIndex(p=>p.src===b.dataset.lightbox));dialog.showModal();document.body.classList.add('modal-open');}));
document.querySelector('#lightbox-close').addEventListener('click',()=>dialog.close());
document.querySelector('#lightbox-prev').addEventListener('click',()=>updatePhoto(pictureIndex-1));
document.querySelector('#lightbox-next').addEventListener('click',()=>updatePhoto(pictureIndex+1));
dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();}});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();updatePhoto(pictureIndex+1);}if(e.key==='ArrowLeft'){e.preventDefault();updatePhoto(pictureIndex-1);}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');previousFocus?.focus({preventScroll:true});});

// A conceptual interaction: nothing here claims to trigger real sensors or aroma.
const senses={luz:'O neon desenha o espaço e transforma o gelo em um cenário vibrante.',movimento:'Na proposta, a presença e os movimentos dos visitantes podem ativar respostas do ambiente.',aroma:'A ideia de aroma acrescenta uma camada sensorial à cenografia e à identidade do chiclete.',projecao:'Projeções foram imaginadas para ampliar o universo congelado e a explosão do recheio.',interacao:'Luzes, aromas e projeções podem se conectar para colocar o visitante no centro da experiência.'};
document.querySelectorAll('[data-sense]').forEach(button=>{if(button.tagName!=='BUTTON')return;button.addEventListener('click',()=>{document.querySelectorAll('button[data-sense]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('#sense-description').textContent=senses[button.dataset.sense];document.querySelector('.poosh-visual').dataset.sense=button.dataset.sense;});});

// ============================================================
// SIMULADORES INTERATIVOS DO DOCE MULTIVERSO
// ============================================================

// 1. Simulador Paçoca do Amor: Portal & Pista de Corrida
const btnPassoPortal = document.querySelector('#btn-passo-portal');
const btnPassoCorrida = document.querySelector('#btn-passo-corrida');
const btnPassoVitoria = document.querySelector('#btn-passo-vitoria');
const simHeartGlow = document.querySelector('#sim-heart-glow');
const simRunner = document.querySelector('#sim-runner');
const feedbackPacoca = document.querySelector('#feedback-pacoca');

if(btnPassoPortal && btnPassoCorrida && btnPassoVitoria){
  btnPassoPortal.addEventListener('click', () => {
    btnPassoPortal.classList.add('active');
    btnPassoCorrida.classList.remove('active');
    btnPassoVitoria.classList.remove('active');
    simHeartGlow.classList.add('is-active');
    simRunner.style.transform = 'translateX(0)';
    feedbackPacoca.textContent = 'ESP32 detectou presença: fitas de LED endereçáveis acendem em arco dourado no formato de coração!';
  });
  btnPassoCorrida.addEventListener('click', () => {
    btnPassoCorrida.classList.add('active');
    btnPassoVitoria.classList.remove('active');
    simHeartGlow.classList.add('is-active');
    simRunner.style.transform = 'translateX(130px)';
    feedbackPacoca.textContent = 'Sensores de pressão ativados: rastro digital de paçoca projetado ao longo da pista acompanhando os passos!';
  });
  btnPassoVitoria.addEventListener('click', () => {
    btnPassoVitoria.classList.add('active');
    simHeartGlow.classList.add('is-active');
    simRunner.style.transform = 'translateX(240px)';
    feedbackPacoca.textContent = 'Linha de chegada alcançada! O coração de 1 metro vibra com iluminação comemorativa celebrando a vitória!';
  });
}

// 2. Simulador 7Belo: Magic Mirror Dance
const danceBtns = document.querySelectorAll('.dance-step-btn');
const avatarFig = document.querySelector('#sete-avatar-figure');
const candyRain = document.querySelector('#candy-rain-overlay');
const comboVal = document.querySelector('#sete-combo-val');
const scoreVal = document.querySelector('#sete-score-val');
const feedback7Belo = document.querySelector('#feedback-7belo');

if(danceBtns.length && avatarFig){
  let currentStep = 1;
  let danceScore = 0;
  let combo = 1;
  const stepFeedback = {
    1: 'Pose Estrela executada com precisão! Tracking MediaPipe confirma sincronia corporal.',
    2: 'Passo Framboesa impecável! Multiplicador de Combo ativado!',
    3: 'Giro Multiverso 360° detectado! Iluminação neon ciano e magenta em rotação máxima!',
    4: 'Salto Natalino perfeito! CHUVA DE BALAS VIRTUAIS LIBERADA na tela holográfica!'
  };
  danceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.dataset.step, 10);
      avatarFig.className = `avatar-figure step-${step}`;
      btn.classList.add('completed');
      combo = Math.min(10, combo + (step === currentStep ? 2 : 1));
      danceScore += 250 * combo;
      comboVal.textContent = `x${combo}`;
      scoreVal.textContent = String(danceScore);
      feedback7Belo.textContent = stepFeedback[step] || 'Passo registrado!';
      if(step === 4){
        candyRain.hidden = false;
        setTimeout(() => { candyRain.hidden = true; }, 3500);
      }
      currentStep = (step % 4) + 1;
    });
  });
}

// 3. Simulador Poosh! Frozen World: Parede dos 6 Flocos de Neve
const flakeBtns = document.querySelectorAll('.flake-btn');
const btnStartPoosh = document.querySelector('#btn-start-poosh');
const timerEl = document.querySelector('#poosh-timer');
const scoreEl = document.querySelector('#poosh-score');
const feedbackPoosh = document.querySelector('#feedback-poosh');
const diffBtns = document.querySelectorAll('.diff-btn');

if(flakeBtns.length && btnStartPoosh){
  let activeDiff = 'easy';
  let timerInterval = null;
  let timeLeft = 30;
  let pooshScore = 0;
  let currentTargetIndex = -1;
  let targetTimeout = null;

  const diffDelays = { easy: 1800, medium: 1200, hard: 750 };

  diffBtns.forEach(b => {
    b.addEventListener('click', () => {
      diffBtns.forEach(btn => btn.classList.remove('active'));
      b.classList.add('active');
      activeDiff = b.dataset.diff;
      feedbackPoosh.textContent = `Dificuldade ajustada para: ${b.textContent}.`;
    });
  });

  function clearTarget(){
    if(currentTargetIndex >= 0 && flakeBtns[currentTargetIndex]){
      flakeBtns[currentTargetIndex].classList.remove('active-target');
      flakeBtns[currentTargetIndex].removeAttribute('data-level');
    }
    currentTargetIndex = -1;
  }

  function spawnTarget(){
    clearTarget();
    if(timeLeft <= 0) return;
    const next = Math.floor(Math.random() * flakeBtns.length);
    currentTargetIndex = next;
    flakeBtns[next].classList.add('active-target');
    flakeBtns[next].dataset.level = activeDiff;
    targetTimeout = setTimeout(() => {
      if(currentTargetIndex === next){
        clearTarget();
        if(timeLeft > 0) spawnTarget();
      }
    }, diffDelays[activeDiff]);
  }

  function endGame(){
    clearInterval(timerInterval);
    clearTimeout(targetTimeout);
    clearTarget();
    btnStartPoosh.disabled = false;
    feedbackPoosh.textContent = `Fim da rodada! Pontuação final: ${pooshScore} pontos no nível ${activeDiff.toUpperCase()}. Excelente reflexo!`;
  }

  btnStartPoosh.addEventListener('click', () => {
    btnStartPoosh.disabled = true;
    timeLeft = 30;
    pooshScore = 0;
    timerEl.textContent = '30s';
    scoreEl.textContent = '0';
    feedbackPoosh.textContent = 'Atenção aos flocos que acenderem! Clique rápido!';
    spawnTarget();
    timerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `${timeLeft}s`;
      if(timeLeft <= 0) endGame();
    }, 1000);
  });

  flakeBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      if(idx === currentTargetIndex && timeLeft > 0){
        clearTimeout(targetTimeout);
        clearTarget();
        const pts = activeDiff === 'hard' ? 200 : (activeDiff === 'medium' ? 150 : 100);
        pooshScore += pts;
        scoreEl.textContent = String(pooshScore);
        feedbackPoosh.textContent = `Acerto no Floco #${idx + 1}! +${pts} pontos!`;
        spawnTarget();
      }
    });
  });
}
