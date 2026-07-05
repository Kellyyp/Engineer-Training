let selectedEquipment = "chiller";
let plantRunning = false;

const equipment = {
  tower: { label:"Cooling Towers", type:"Heat rejection", points:"Fan speed, basin level, CW supply temp", description:"Rejects heat from condenser water to the outdoor air through evaporation and airflow." },
  cwp: { label:"Condenser Water Pumps", type:"Condenser water loop", points:"Pump status, VFD speed, differential pressure", description:"Moves condenser water between chillers and cooling towers." },
  chiller: { label:"Water-Cooled Chillers", type:"Cooling production", points:"CHWS, CHWR, tons, amps, approach", description:"Removes heat from chilled water and rejects it into the condenser water loop." },
  chwp: { label:"Chilled Water Pumps", type:"Chilled water loop", points:"Pump status, VFD speed, DP, flow", description:"Moves chilled water from the plant to the building air handlers and coils." },
  exp: { label:"Expansion Tank", type:"Pressure control", points:"System pressure, fill status", description:"Absorbs water expansion and stabilizes hydronic system pressure." },
  hx: { label:"Plate Heat Exchanger", type:"Heat transfer", points:"Entering/leaving temps, DP, isolation valve status", description:"Transfers heat between loops while keeping fluids separated." },
  building: { label:"Building Load", type:"Cooling demand", points:"Supply air temp, space temp, valve position", description:"Represents the connected building load served by the chilled water plant." }
};

const views = {
  home: { title:"Professional Building Engineer Training", render:renderHome },
  systems: { title:"Building Systems", render:renderSystems },
  chillerPlant: { title:"Chiller Plant Explorer", render:renderChillerPlant },
  bas: { title:"BAS Simulator", render:()=>placeholder("BAS Simulator","Future release: realistic BAS pages, live-style points, trends, alarms, and troubleshooting scenarios.") },
  scada: { title:"SCADA Training", render:()=>placeholder("SCADA Training","Future release: control-room style plant graphics, alarms, trends, and operating modes.") },
  study: { title:"Study Center", render:()=>placeholder("Study Center","Future release: flashcards, reference guides, practice exams, and troubleshooting review.") },
  equipment: { title:"Equipment Library", render:()=>placeholder("Equipment Library","Future release: AI-style equipment pages with components, operation, failures, BAS points, and maintenance.") },
  settings: { title:"Settings", render:()=>placeholder("Settings","Future release: preferences, saved progress, theme controls, and app configuration.") }
};

const modules = [
  {icon:"🏢",title:"Building Systems",description:"Explore complete commercial building systems instead of isolated equipment.",meta:"Main training path",view:"systems"},
  {icon:"🖥",title:"BAS Simulator",description:"Practice operating BAS systems with points, setpoints, alarms, and trends.",meta:"Simulator",view:"bas"},
  {icon:"📈",title:"SCADA Training",description:"Train on control-room style graphics for central plants and equipment.",meta:"Operations",view:"scada"},
  {icon:"📚",title:"Study Center",description:"Review theory, flashcards, references, and exam-style practice questions.",meta:"Learning",view:"study"},
  {icon:"📖",title:"Equipment Library",description:"Browse pumps, chillers, boilers, AHUs, towers, electrical equipment, and more.",meta:"Reference",view:"equipment"},
  {icon:"⚙",title:"Settings",description:"Manage preferences and future training profile options.",meta:"App",view:"settings"}
];

const systems = [
  {icon:"❄",title:"Chiller Plant",description:"Chillers, chilled water pumps, condenser water pumps, cooling towers, VFDs, expansion tanks, and heat exchangers.",meta:"Flagship system",view:"chillerPlant"},
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
function renderSystems(){return `<div class="section-title"><div><p class="eyebrow">Building Systems</p><h2>Select a system to explore.</h2><p>Chiller Plant is now clickable in Sprint 2.</p></div></div><div class="grid">${systems.map(i=>cardTemplate(i,"system")).join("")}</div>`}

function renderChillerPlant(){
  const e = equipment[selectedEquipment];
  return `
  <div class="section-title">
    <div>
      <p class="eyebrow">Plant Explorer</p>
      <h2>Chiller Plant Overview</h2>
      <p>Follow the chilled water and condenser water systems as one connected mechanical plant.</p>
    </div>
    <button class="primary-btn" id="startPlantBtn">${plantRunning ? "Stop Plant" : "Start Plant"}</button>
  </div>

  <div class="metric-row">
    <div class="metric"><small>CHWS</small><b>${plantRunning ? "44°F" : "--"}</b></div>
    <div class="metric"><small>Plant Load</small><b>${plantRunning ? "46%" : "Standby"}</b></div>
    <div class="metric"><small>Status</small><b>${plantRunning ? "Running" : "Off"}</b></div>
  </div>

  <div class="plant-layout">
    <section class="plant-map">
      <div class="plant-map-header">
        <div>
          <p class="eyebrow">Interactive Plant</p>
          <h3>Central Chiller Plant</h3>
        </div>
        <p>${plantRunning ? "Flow mode active" : "Tap Start Plant to animate flow"}</p>
      </div>

      <div class="plant-stage ${plantRunning ? "flow-active" : ""}">
        <div class="pipe vertical"></div>
        <div class="pipe horizontal"></div>
        ${node("tower","node-tower","Cooling Towers","Heat rejection")}
        ${node("cwp","node-cwp","CW Pumps","Condenser loop")}
        ${node("chiller","node-chiller","Chillers","Cooling source")}
        ${node("chwp","node-chwp","CHW Pumps","Building loop")}
        ${node("exp","node-exp","Expansion Tank","Pressure control")}
        ${node("hx","node-hx","Plate HX","Heat transfer")}
        ${node("building","node-building","Building Load","Airside coils")}
      </div>
    </section>

    <aside class="info-panel">
      <p class="eyebrow">Selected Equipment</p>
      <h2>${e.label}</h2>
      <p><strong>${e.type}</strong></p>
      <p>${e.description}</p>
      <p><strong>BAS points:</strong> ${e.points}</p>

      <div class="equipment-list">
        ${Object.entries(equipment).map(([key,item])=>`
          <div class="equipment-panel ${selectedEquipment===key?"active":""}" data-equipment="${key}">
            <strong>${item.label}</strong>
            <span>${item.type}</span>
          </div>`).join("")}
      </div>

      <button class="secondary-btn" style="margin-top:16px;width:100%" data-view="equipment">Open Detailed Equipment Page →</button>
    </aside>
  </div>`;
}

function node(key, cls, title, sub){
  return `<button class="equip-node ${cls} ${selectedEquipment===key?"active":""}" data-equipment="${key}"><small>${sub}</small><strong>${title}</strong><span>Tap to inspect</span></button>`;
}
function placeholder(title,text){return `<section class="placeholder-view"><p class="eyebrow">Module placeholder</p><h2>${title}</h2><p>${text}</p><button class="primary-btn" data-view="home">Back Home</button></section>`}
function setView(name){
  const view=views[name]||views.home;
  document.getElementById("pageTitle").textContent=view.title;
  document.getElementById("viewRoot").innerHTML=view.render();
  document.querySelectorAll(".nav-item").forEach(btn=>btn.classList.toggle("active",btn.dataset.view===name));
  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",e=>{
  const equip=e.target.closest("[data-equipment]");
  if(equip){
    selectedEquipment=equip.dataset.equipment;
    setView("chillerPlant");
    return;
  }
  if(e.target.id==="startPlantBtn"){
    plantRunning=!plantRunning;
    setView("chillerPlant");
    return;
  }
  const target=e.target.closest("[data-view]");
  if(target)setView(target.dataset.view);
});
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
setView("home");
