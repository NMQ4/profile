const ROUTES = ['home','profile','research','projects','achievements','publications','contact'];
const routeLabels = {
  home:'HOME', profile:'PROFILE', research:'RESEARCH', projects:'PROJECTS', achievements:'ACHIEVEMENTS', publications:'PUBLICATIONS', contact:'CONTACT'
};

const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const pages = [...document.querySelectorAll('.page')];
const routeLinks = [...document.querySelectorAll('.route-link')];
const railDots = [...document.querySelectorAll('.rail-dot')];
const routeName = document.getElementById('routeName');
const routeProgress = document.getElementById('routeProgress');
let currentRoute = 'home';

function normalizeRoute(value){
  const r = String(value || '').replace(/^#/,'').trim().toLowerCase();
  return ROUTES.includes(r) ? r : 'home';
}

function showRoute(route, pushHash = true){
  route = normalizeRoute(route);
  currentRoute = route;
  pages.forEach(page => page.classList.toggle('active', page.dataset.page === route));
  routeLinks.forEach(link => link.classList.toggle('active', link.dataset.route === route));
  railDots.forEach(link => link.classList.toggle('active', link.dataset.route === route));
  const idx = ROUTES.indexOf(route);
  routeName.textContent = routeLabels[route];
  routeProgress.style.height = `${(idx / (ROUTES.length - 1)) * 100}%`;
  document.title = route === 'home' ? 'Nguyễn Minh Quang — Robotics & AI' : `${routeLabels[route]} — Nguyễn Minh Quang`;
  navbar.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded','false');
  window.scrollTo({top:0,behavior:'instant'});
  if(pushHash && location.hash !== `#${route}`) history.pushState(null,'',`#${route}`);
  if(route === 'projects') setTimeout(playVisibleProjectVideos, 120);
  else pauseAllProjectVideos();
}

routeLinks.forEach(link => link.addEventListener('click', () => showRoute(link.dataset.route)));
window.addEventListener('popstate', () => showRoute(location.hash, false));
window.addEventListener('hashchange', () => showRoute(location.hash, false));
menuToggle?.addEventListener('click', () => {
  const open = navbar.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

window.addEventListener('keydown', e => {
  if(document.querySelector('.project-modal.open')) return;
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) return;
  const idx = ROUTES.indexOf(currentRoute);
  if(e.key === 'ArrowRight' && idx < ROUTES.length - 1) showRoute(ROUTES[idx + 1]);
  if(e.key === 'ArrowLeft' && idx > 0) showRoute(ROUTES[idx - 1]);
});

const glow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', e => {
  if(!glow) return;
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

// Subtle magnetic movement for important buttons.
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    if(window.innerWidth < 900) return;
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.12}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

const rotatingWord = document.getElementById('rotatingWord');
const heroWords = ['ROBOTS.','MOTION.','SYSTEMS.','INTELLIGENCE.'];
let heroWordIndex = 0;
setInterval(() => {
  if(!rotatingWord || currentRoute !== 'home') return;
  rotatingWord.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-10px)'}],{duration:220,fill:'forwards'}).onfinish = () => {
    heroWordIndex = (heroWordIndex + 1) % heroWords.length;
    rotatingWord.textContent = heroWords[heroWordIndex];
    rotatingWord.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,fill:'forwards'});
  };
}, 2700);

// ============================================================
// PROJECT MEDIA
// Mỗi dự án có folder riêng trong assets/projects/<folder>/
// Thay demo.mp4 để thay video; cover.jpg là ảnh dự phòng.
// ============================================================
const projects = [
  {folder:'01-kinodynamic-rrt',filter:['MOBILE'],category:'MOBILE ROBOT · PATH PLANNING',year:'2026',title:'Kinodynamic RRT* Multi-resolution Planning',description:'Tối ưu quỹ đạo cho robot di động sử dụng Kinodynamic RRT* đa độ phân giải kết hợp phát hiện vật cản thời gian thực.',tags:['RRT*','KINODYNAMIC','REAL-TIME','MOBILE ROBOT']},
  {folder:'02-rotary-inverted-pendulum',filter:['CONTROL'],category:'NONLINEAR CONTROL',year:'2026',title:'Rotary Inverted Pendulum · Fuzzy + QPSO',description:'Điều khiển cân bằng mô hình con lắc ngược quay bằng bộ điều khiển Fuzzy cải tiến dựa trên tối ưu bầy đàn lượng tử.',tags:['FUZZY','QPSO','NONLINEAR','CONTROL']},
  {folder:'03-multi-robot-factory-task-allocation',filter:['MOBILE'],category:'MULTI-ROBOT · FACTORY AUTOMATION',year:'RESEARCH',title:'Multi-Robot Task Allocation in Factory',description:'Điều phối nhiều robot trong nhà xưởng, phân chia nhiệm vụ và tổ chức luồng di chuyển nhằm giảm xung đột và nâng cao hiệu quả vận hành.',tags:['MULTI-ROBOT','TASK ALLOCATION','FACTORY','COORDINATION']},
  {folder:'04-omni-trajectory-tracking',filter:['OMNI','CONTROL'],category:'OMNI ROBOT · MOTION CONTROL',year:'RESEARCH',title:'Omni Robot · Trajectory Tracking',description:'Robot omni di chuyển và bám quỹ đạo theo tham chiếu với thuật toán điều khiển chuyển động và đánh giá sai số bám.',tags:['OMNI','TRACKING','CONTROL','TRAJECTORY']},
  {folder:'06-diff-drive-obstacle-avoidance',filter:['MOBILE'],category:'DIFFERENTIAL-DRIVE · NAVIGATION',year:'RESEARCH',title:'Differential-Drive Robot · Obstacle Avoidance',description:'Robot hai bánh vi sai thực hiện điều hướng và tránh các vật cản tĩnh trong môi trường chuyển động.',tags:['DIFF-DRIVE','NAVIGATION','STATIC OBSTACLE','PLANNING']},
  {folder:'07-mecanum-dynamic-obstacle-sim',filter:['SIMULATION'],category:'MECANUM · SIMULATION',year:'SIMULATION',title:'Mecanum Robot Simulation · Obstacle Avoidance',description:'Mô phỏng robot bánh Mecanum thực hiện chuyển động đa hướng và tránh vật cản tĩnh trong môi trường mô phỏng.',tags:['MECANUM','SIMULATION','OMNIDIRECTIONAL','AVOIDANCE']},
  {folder:'08-omni-dynamic-obstacle-sim',filter:['OMNI','SIMULATION'],category:'OMNI ROBOT · SIMULATION',year:'SIMULATION',title:'Omni Robot Simulation · Dynamic Obstacle Avoidance',description:'Mô phỏng robot omni tránh vật cản động, replanning đường đi và điều chỉnh vận tốc theo trạng thái môi trường.',tags:['OMNI','SIMULATION','DYNAMIC OBSTACLE','REPLANNING']},
  {folder:'09-omni-dynamic-obstacle-real',filter:['OMNI'],category:'OMNI ROBOT · REAL PLATFORM',year:'EXPERIMENT',title:'Omni Robot · Real-world Dynamic Obstacle Avoidance',description:'Thử nghiệm thực tế robot omni di chuyển và tránh vật cản động, kiểm chứng thuật toán trên nền tảng robot thật.',tags:['OMNI','HARDWARE','EXPERIMENT','DYNAMIC OBSTACLE']},
  {folder:'10-robot-arm-vision-dynamic-obstacle',filter:['ARM'],category:'ROBOT ARM · VISION · MOTION PLANNING',year:'RESEARCH',title:'Robot Arm · Vision-guided Motion & Dynamic Obstacle Avoidance',description:'Robot cánh tay tích hợp thị giác để nhận biết môi trường, lập kế hoạch chuyển động, di chuyển tới mục tiêu và tránh vật cản động trong vùng làm việc.',tags:['ROBOT ARM','VISION','MOTION PLANNING','DYNAMIC OBSTACLE']},
  {folder:'11-quadruped-robot-motion-sim',filter:['SIMULATION'],category:'QUADRUPED ROBOT · SIMULATION',year:'SIMULATION',title:'Quadruped Robot · Motion Simulation',description:'Mô phỏng chuyển động robot bốn chân với chu kỳ bước chân phối hợp, chuyển động thân robot và khả năng di chuyển ổn định theo quỹ đạo tham chiếu.',tags:['QUADRUPED','LOCOMOTION','SIMULATION','MOTION']}
];

const projectsGrid = document.getElementById('projectsGrid');
const projectsEmpty = document.getElementById('projectsEmpty');
const projectCount = document.getElementById('visibleProjectCount');
let activeFilter = 'ALL';

function projectBase(project){ return `assets/projects/${project.folder}`; }

function renderProject(project){
  const base = projectBase(project);
  const card = document.createElement('article');
  card.className = 'project-card';
  card.dataset.filters = project.filter.join(' ');
  card.dataset.folder = project.folder;
  card.innerHTML = `
    <div class="project-media media-loading">
      <img class="project-cover" src="${base}/cover.jpg" alt="${project.title}">
      <video class="project-video" muted loop playsinline preload="metadata">
        <source src="${base}/demo.mp4" type="video/mp4">
        <source src="${base}/demo.webm" type="video/webm">
      </video>
      <span class="media-badge">MEDIA</span><span class="project-open">↗</span>
    </div>
    <div class="project-content">
      <div class="project-meta"><span>${project.category}</span><span>${project.year}</span></div>
      <h3 class="project-title">${project.title}</h3>
      <p class="project-text">${project.description}</p>
      <div class="project-tags">${project.tags.map(t=>`<span>${t}</span>`).join('')}</div>
    </div>`;

  const mediaBox = card.querySelector('.project-media');
  const cover = card.querySelector('.project-cover');
  const video = card.querySelector('.project-video');
  const badge = card.querySelector('.media-badge');
  let coverOK=false,videoOK=false,coverFailed=false,videoFailed=false;
  const decide=()=>{
    if(videoOK){mediaBox.classList.add('has-video');mediaBox.classList.remove('media-loading');badge.textContent='VIDEO';return;}
    if(coverOK){mediaBox.classList.add('has-cover');mediaBox.classList.remove('media-loading');badge.textContent='IMAGE';return;}
    if(coverFailed&&videoFailed){card.remove();applyProjectFilter();}
  };
  cover.addEventListener('load',()=>{coverOK=true;decide()}); cover.addEventListener('error',()=>{coverFailed=true;decide()});
  video.addEventListener('loadeddata',()=>{videoOK=true;decide();if(currentRoute==='projects') video.play().catch(()=>{})});
  video.addEventListener('error',()=>{videoFailed=true;decide()});
  setTimeout(()=>{if(!videoOK)videoFailed=true;if(!coverOK&&cover.complete)coverFailed=true;decide()},2600);
  card.addEventListener('click',()=>openProjectModal(project,videoOK));
  return card;
}

function buildProjects(){
  projects.forEach(p=>projectsGrid.appendChild(renderProject(p)));
  applyProjectFilter();
}

function applyProjectFilter(){
  const cards=[...projectsGrid.querySelectorAll('.project-card')];
  let visible=0;
  cards.forEach(card=>{
    const match=activeFilter==='ALL'||card.dataset.filters.split(' ').includes(activeFilter);
    card.classList.toggle('filtered-out',!match); if(match) visible++;
  });
  projectCount.textContent=String(visible).padStart(2,'0');
  projectsEmpty.style.display=visible?'none':'block';
  if(currentRoute==='projects') playVisibleProjectVideos();
}

document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
  activeFilter=btn.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===btn));applyProjectFilter();
}));

function playVisibleProjectVideos(){
  document.querySelectorAll('.project-card:not(.filtered-out) .project-video').forEach(v=>v.play().catch(()=>{}));
}
function pauseAllProjectVideos(){document.querySelectorAll('.project-video').forEach(v=>v.pause())}

const modal=document.getElementById('projectModal');
const modalMedia=document.getElementById('modalMedia');
const modalCategory=document.getElementById('modalCategory');
const modalYear=document.getElementById('modalYear');
const modalTitle=document.getElementById('modalTitle');
const modalDescription=document.getElementById('modalDescription');
const modalTags=document.getElementById('modalTags');
function openProjectModal(project,hasVideo){
  const base=projectBase(project);modalCategory.textContent=project.category;modalYear.textContent=project.year;modalTitle.textContent=project.title;modalDescription.textContent=project.description;modalTags.innerHTML=project.tags.map(t=>`<span>${t}</span>`).join('');
  modalMedia.innerHTML=hasVideo?`<video src="${base}/demo.mp4" controls autoplay loop muted playsinline></video>`:`<img src="${base}/cover.jpg" alt="${project.title}">`;
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');modalMedia.innerHTML='';document.body.style.overflow=''}
document.querySelectorAll('[data-close-modal]').forEach(x=>x.addEventListener('click',closeModal));
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeModal()});

buildProjects();
showRoute(location.hash,false);
