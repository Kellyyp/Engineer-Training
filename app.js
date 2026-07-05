const views={
home:{title:"Professional Building Engineer Training",render:renderHome},
systems:{title:"Building Systems",render:renderSystems},
bas:{title:"BAS Simulator",render:()=>placeholder("BAS Simulator","Future release: realistic BAS pages, live-style points, trends, alarms, and troubleshooting scenarios.")},
scada:{title:"SCADA Training",render:()=>placeholder("SCADA Training","Future release: control-room style plant graphics, alarms, trends, and operating modes.")},
study:{title:"Study Center",render:()=>placeholder("Study Center","Future release: flashcards, reference guides, practice exams, and troubleshooting review.")},
equipment:{title:"Equipment Library",render:()=>placeholder("Equipment Library","Future release: AI-style equipment pages with components, operation, failures, BAS points, and maintenance.")},
settings:{title:"Settings",render:()=>placeholder("Settings","Future release: preferences, saved progress, theme controls, and app configuration.")}
};
const modules=[
{icon:"🏢",title:"Building Systems",description:"Explore complete commercial building systems instead of isolated equipment.",meta:"Main training path",view:"systems"},
{icon:"🖥",title:"BAS Simulator",description:"Practice operating BAS systems with points, setpoints, alarms, and trends.",meta:"Simulator",view:"bas"},
{icon:"📈",title:"SCADA Training",description:"Train on control-room style graphics for central plants and equipment.",meta:"Operations",view:"scada"},
{icon:"📚",title:"Study Center",description:"Review theory, flashcards, references, and exam-style practice questions.",meta:"Learning",view:"study"},
{icon:"📖",title:"Equipment Library",description:"Browse pumps, chillers, boilers, AHUs, towers, electrical equipment, and more.",meta:"Reference",view:"equipment"},
{icon:"⚙",title:"Settings",description:"Manage preferences and future training profile options.",meta:"App",view:"settings"}
];
const systems=[
{icon:"❄",title:"Chiller Plant",description:"Chillers, chilled water pumps, condenser water pumps, cooling towers, VFDs, expansion tanks, and heat exchangers.",meta:"Flagship system"},
{icon:"🔥",title:"Boiler Plant",description:"Steam boilers, hot water boilers, feedwater, condensate, PRVs, pumps, traps, and safeties.",meta:"Coming next"},
{icon:"🌬",title:"Airside Systems",description:"AHUs, VAVs, dampers, coils, fans, filters, economizers, and airflow troubleshooting.",meta:"Coming soon"},
{icon:"⚡",title:"Electrical Distribution",description:"Switchgear, MCCs, VFDs, ATS, generators, panels, breakers, and motor control.",meta:"Coming soon"},
{icon:"🚰",title:"Domestic Water",description:"Booster pumps, water heaters, PRVs, backflow preventers, tanks, and controls.",meta:"Coming soon"},
{icon:"🚒",title:"Fire Protection",description:"Fire pumps, sprinkler systems, standpipes, alarm valves, and inspection workflows.",meta:"Coming soon"}
];
function cardTemplate(item,type="module"){
const cls=type==="system"?"system-card":"module-card";
const click=item.view?`data-view="${item.view}"`:"";
return `<article class="${cls}" ${click}><div><div class="card-icon">${item.icon}</div><span class="card-meta">${item.meta}</span><h3>${item.title}</h3><p>${item.description}</p></div><button class="card-btn" ${click}>Open →</button></article>`;
}
function renderHome(){return `<div class="section-title"><div><p class="eyebrow">Main modules</p><h2>Choose where to train.</h2></div></div><div class="grid">${modules.map(i=>cardTemplate(i)).join("")}</div>`}
function renderSystems(){return `<div class="section-title"><div><p class="eyebrow">Building Systems</p><h2>Select a system to explore.</h2><p>Release 4.0.0 starts with the professional homepage. Chiller Plant becomes interactive in Sprint 2.</p></div></div><div class="grid">${systems.map(i=>cardTemplate(i,"system")).join("")}</div>`}
function placeholder(title,text){return `<section class="placeholder-view"><p class="eyebrow">Module placeholder</p><h2>${title}</h2><p>${text}</p><button class="primary-btn" data-view="home">Back Home</button></section>`}
function setView(name){const view=views[name]||views.home;document.getElementById("pageTitle").textContent=view.title;document.getElementById("viewRoot").innerHTML=view.render();document.querySelectorAll(".nav-item").forEach(btn=>btn.classList.toggle("active",btn.dataset.view===name));document.getElementById("sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}
document.addEventListener("click",e=>{const target=e.target.closest("[data-view]");if(target)setView(target.dataset.view)});
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
setView("home");
