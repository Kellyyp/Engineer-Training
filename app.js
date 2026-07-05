let selectedEquipment = "chiller";
let selectedComponent = 0;
let plantRunning = false;
let viewerMode = "AI View";

const equipment = {
  tower: {
    label:"Cooling Towers", type:"Heat rejection", points:"Fan speed, basin level, CW supply temp", description:"Rejects heat from condenser water to the outdoor air through evaporation and airflow.",
    specs:{Status:"Auto", Fan:"45%", Basin:"Normal", Approach:"7°F"},
    components:["Fan","Gearbox","Drive shaft","Fill media","Spray nozzles","Cold water basin","Makeup valve","Blowdown valve"],
    how:"Warm condenser water is sprayed over fill while air moves across it. Evaporation removes heat before the water returns to the chiller condenser."
  },
  cwp: {
    label:"Condenser Water Pumps", type:"Condenser water loop", points:"Pump status, VFD speed, differential pressure", description:"Moves condenser water between chillers and cooling towers.",
    specs:{Status:"Running", Speed:"58%", DP:"18 PSI", Flow:"Normal"},
    components:["Motor","Coupling","Pump casing","Impeller","Mechanical seal","Shaft","Bearings","VFD"],
    how:"The pump circulates condenser water through the chiller condenser and cooling tower so heat can be rejected outdoors."
  },
  chiller: {
    label:"Water-Cooled Chillers", type:"Cooling production", points:"CHWS, CHWR, tons, amps, approach", description:"Removes heat from chilled water and rejects it into the condenser water loop.",
    specs:{Status:"Running", CHWS:"44°F", Load:"46%", Amps:"62%"},
    components:["Compressor","Evaporator","Condenser","Expansion device","Oil system","Starter","Control panel","Flow switches"],
    how:"The chiller evaporator removes heat from chilled water. The compressor raises refrigerant pressure, and the condenser rejects heat into the condenser water loop."
  },
  chwp: {
    label:"Chilled Water Pumps", type:"Chilled water loop", points:"Pump status, VFD speed, DP, flow", description:"Moves chilled water from the plant to the building air handlers and coils.",
    specs:{Status:"Running", Speed:"52%", DP:"22 PSI", Flow:"Normal"},
    components:["Motor","Volute casing","Impeller","Mechanical seal","Coupling","Shaft","Bearings","Discharge flange"],
    how:"The pump moves chilled water through the building. VFD speed usually adjusts to maintain differential pressure as control valves open and close."
  },
  exp: {
    label:"Expansion Tank", type:"Pressure control", points:"System pressure, fill status", description:"Absorbs water expansion and stabilizes hydronic system pressure.",
    specs:{Status:"Normal", Pressure:"18 PSI", Charge:"12 PSI", Isolation:"Open"},
    components:["Steel shell","Bladder","Air charge","System connection","Isolation valve","Pressure gauge"],
    how:"As water temperature changes, the tank absorbs volume changes to prevent large pressure swings in the closed hydronic system."
  },
  hx: {
    label:"Plate Heat Exchanger", type:"Heat transfer", points:"Entering/leaving temps, DP, isolation valve status", description:"Transfers heat between loops while keeping fluids separated.",
    specs:{Status:"Available", Approach:"4°F", DP:"8 PSI", Valves:"Open"},
    components:["Plates","Gaskets","Frame","Tie rods","Hot inlet","Hot outlet","Cold inlet","Cold outlet"],
    how:"Two fluids pass on opposite sides of thin plates. Heat transfers through the plates without the fluids mixing."
  },
  building: {
    label:"Building Load", type:"Cooling demand", points:"Supply air temp, space temp, valve position", description:"Represents the connected building load served by the chilled water plant.",
    specs:{Demand:"46%", Valves:"58%", SAT:"55°F", Comfort:"Normal"},
    components:["AHU coils","Control valves","VAV boxes","Space sensors","Supply fans","Return fans"],
    how:"Air handlers use chilled water coils to cool supply air. As space demand rises, valves open and chilled water flow increases."
  }
};

const componentInfo = {
  "Motor":"Converts electrical energy into rotation. Check amperage, heat, vibration, bearings, and command status.",
  "Coupling":"Connects motor shaft to pump shaft. Misalignment can cause vibration, seal failure, and bearing wear.",
  "Pump casing":"Houses the rotating impeller and directs water into the discharge piping.",
  "Volute casing":"Collects water leaving the impeller and converts velocity into pressure.",
  "Impeller":"Rotating element that adds energy to the water and creates flow.",
  "Mechanical seal":"Prevents water from leaking along the rotating shaft. Watch for drips, heat, and dry operation.",
  "Shaft":"Transfers rotation from motor/coupling to the impeller.",
  "Bearings":"Support the rotating shaft. Common symptoms include noise, heat, and vibration.",
  "VFD":"Controls motor speed by varying output frequency. Used to maintain pressure or flow efficiently.",
  "Compressor":"Raises refrigerant pressure and temperature so heat can be rejected in the condenser.",
  "Evaporator":"Heat exchanger where chilled water gives up heat to refrigerant.",
  "Condenser":"Heat exchanger where refrigerant rejects heat to condenser water.",
  "Expansion device":"Drops refrigerant pressure before the evaporator so refrigerant can absorb heat.",
  "Oil system":"Lubricates compressor bearings and moving parts. Oil pressure and temperature are critical.",
  "Starter":"Controls power to the chiller motor and protects it during starting.",
  "Control panel":"The chiller brain. Handles safeties, staging, alarms, and operating limits.",
  "Flow switches":"Prove water flow before the chiller is allowed to run.",
  "Fan":"Moves air through the cooling tower or AHU. Check status, speed, vibration, and safeties.",
  "Gearbox":"Reduces motor speed and transfers torque to the cooling tower fan.",
  "Drive shaft":"Connects gearbox and fan drive components.",
  "Fill media":"Increases surface area for water and air contact inside a cooling tower.",
  "Spray nozzles":"Distribute condenser water evenly over the tower fill.",
  "Cold water basin":"Collects cooled condenser water before it returns to the pumps.",
  "Makeup valve":"Adds water to replace evaporation, drift, and blowdown losses.",
  "Blowdown valve":"Removes concentrated tower water to control dissolved solids.",
  "Steel shell":"Outer tank body that contains the bladder and system pressure.",
  "Bladder":"Separates system water from air charge inside an expansion tank.",
  "Air charge":"Precharged air cushion that absorbs expansion.",
  "System connection":"Connection point between tank and hydronic piping.",
  "Isolation valve":"Allows equipment to be isolated for service.",
  "Pressure gauge":"Displays system or tank pressure.",
  "Plates":"Thin heat transfer surfaces inside a plate heat exchanger.",
  "Gaskets":"Seal the plate heat exchanger channels and keep fluids separated.",
  "Frame":"Holds the plate pack together under compression.",
  "Tie rods":"Compress and secure the plate heat exchanger frame.",
  "Hot inlet":"Connection where the warmer fluid enters.",
  "Hot outlet":"Connection where the warmer fluid exits after giving up heat.",
  "Cold inlet":"Connection where the cooler fluid enters.",
  "Cold outlet":"Connection where the cooler fluid exits after absorbing heat.",
  "AHU coils":"Heat exchangers in air handlers that transfer cooling or heating to the air stream.",
  "Control valves":"Modulate water flow through coils based on temperature demand.",
  "VAV boxes":"Terminal units that regulate airflow to spaces.",
  "Space sensors":"Measure room temperature and help control comfort.",
  "Supply fans":"Move conditioned air into occupied spaces.",
  "Return fans":"Move air back from the building to the air handling unit.",
  "Discharge flange":"Pump outlet connection to the discharge piping."
};

const views = {
  home: { title:"Professional Building Engineer Training", render:renderHome },
  systems: { title:"Building Systems", render:renderSystems },
  chillerPlant: { title:"Chiller Plant Explorer", render:renderChillerPlant },
  equipmentDetail: { title:"Detailed Equipment Viewer", render:renderEquipmentDetail },
  bas: { title:"BAS Simulator", render:()=>placeholder("BAS Simulator","Future release: realistic BAS pages, live-style points, trends, alarms, and troubleshooting scenarios.") },
  scada: { title:"SCADA Training", render:()=>placeholder("SCADA Training","Future release: control-room style plant graphics, alarms, trends, and operating modes.") },
  study: { title:"Study Center", render:()=>placeholder("Study Center","Future release: flashcards, reference guides, practice exams, and troubleshooting review.") },
  equipment: { title:"Equipment Library", render:()=>renderEquipmentLibrary() },
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
function renderSystems(){return `<div class="section-title"><div><p class="eyebrow">Building Systems</p><h2>Select a system to explore.</h2><p>Chiller Plant now includes a detailed equipment viewer.</p></div></div><div class="grid">${systems.map(i=>cardTemplate(i,"system")).join("")}</div>`}
function renderEquipmentLibrary(){return `<div class="section-title"><div><p class="eyebrow">Equipment Library</p><h2>Chiller Plant Equipment</h2><p>Select equipment to open the detailed viewer.</p></div></div><div class="grid">${Object.entries(equipment).map(([key,item])=>`<article class="module-card" data-open-equipment="${key}"><div><div class="card-icon">⚙</div><span class="card-meta">${item.type}</span><h3>${item.label}</h3><p>${item.description}</p></div><button class="card-btn" data-open-equipment="${key}">Open Detail →</button></article>`).join("")}</div>`}

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
      <div class="plant-map-header"><div><p class="eyebrow">Interactive Plant</p><h3>Central Chiller Plant</h3></div><p>${plantRunning ? "Flow mode active" : "Tap Start Plant to animate flow"}</p></div>
      <div class="plant-stage ${plantRunning ? "flow-active" : ""}">
        <div class="pipe vertical"></div><div class="pipe horizontal"></div>
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
      <p class="eyebrow">Selected Equipment</p><h2>${e.label}</h2><p><strong>${e.type}</strong></p><p>${e.description}</p><p><strong>BAS points:</strong> ${e.points}</p>
      <div class="equipment-list">${Object.entries(equipment).map(([key,item])=>`<div class="equipment-panel ${selectedEquipment===key?"active":""}" data-equipment="${key}"><strong>${item.label}</strong><span>${item.type}</span></div>`).join("")}</div>
      <button class="primary-btn" style="margin-top:16px;width:100%" data-view="equipmentDetail">Open Detailed Equipment Page →</button>
    </aside>
  </div>`;
}

function renderEquipmentDetail(){
  const e = equipment[selectedEquipment];
  const component = e.components[selectedComponent] || e.components[0];
  const explain = componentInfo[component] || "This component is part of the equipment assembly and should be inspected during routine operation and maintenance.";
  return `
  <div class="section-title">
    <div><p class="eyebrow">Equipment Detail</p><h2>${e.label}</h2><p>${e.description}</p></div>
    <button class="secondary-btn" data-view="chillerPlant">← Back to Plant</button>
  </div>
  <div class="viewer-layout">
    <section class="viewer-panel">
      <div class="viewer-header"><div><p class="eyebrow">${e.type}</p><h3>${viewerMode}</h3></div></div>
      <div class="mode-bar">${["AI View","Components","Flow","Maintenance","BAS Points"].map(m=>`<button class="mode-btn ${viewerMode===m?"active":""}" data-mode="${m}">${m}</button>`).join("")}</div>
      <div class="equipment-art">
        ${equipmentSvg(selectedEquipment)}
        ${e.components.slice(0,6).map((c,i)=>`<button class="hotspot ${selectedComponent===i?"active":""}" style="${hotspotStyle(i)}" data-component="${i}">${i+1}</button>`).join("")}
      </div>
      <div class="spec-grid">${Object.entries(e.specs).map(([k,v])=>`<div class="spec-card"><small>${k}</small><b>${v}</b></div>`).join("")}</div>
    </section>
    <aside class="component-panel">
      <p class="eyebrow">Components</p><h3>${component}</h3>
      <div class="component-list">${e.components.map((c,i)=>`<div class="component-item ${selectedComponent===i?"active":""}" data-component="${i}"><strong>${i+1}. ${c}</strong></div>`).join("")}</div>
      <div class="component-explain">
        <p><strong>How it works:</strong></p><p>${explain}</p>
        <p><strong>Equipment sequence:</strong></p><p>${e.how}</p>
        <p><strong>Related BAS points:</strong></p><p>${e.points}</p>
      </div>
    </aside>
  </div>`;
}

function node(key, cls, title, sub){return `<button class="equip-node ${cls} ${selectedEquipment===key?"active":""}" data-equipment="${key}"><small>${sub}</small><strong>${title}</strong><span>Tap to inspect</span></button>`}
function hotspotStyle(i){const spots=["left:18%;top:48%","left:33%;top:34%","left:48%;top:52%","left:62%;top:38%","left:76%;top:52%","left:86%;top:34%"];return spots[i]||"left:50%;top:50%"}
function equipmentSvg(key){
  if(key==="chiller") return `<svg viewBox="0 0 900 430"><rect x="120" y="170" width="520" height="160" rx="70" fill="#64748b" stroke="#cbd5e1" stroke-width="8"/><rect x="180" y="260" width="340" height="45" rx="22" fill="#dbeafe" stroke="#28b6ff" stroke-width="4"/><rect x="180" y="195" width="340" height="45" rx="22" fill="#dcfce7" stroke="#36d399" stroke-width="4"/><circle cx="390" cy="250" r="48" fill="#fef3c7" stroke="#f59e0b" stroke-width="5"/><rect x="690" y="190" width="120" height="100" rx="16" fill="#0f2c49" stroke="#28b6ff" stroke-width="4"/><text x="315" y="255" fill="#0b1220" font-size="22" font-weight="900">CHILLER</text></svg>`;
  if(key==="tower") return `<svg viewBox="0 0 900 430"><rect x="300" y="75" width="300" height="285" rx="24" fill="#334155" stroke="#cbd5e1" stroke-width="8"/><circle cx="450" cy="130" r="58" fill="none" stroke="#cbd5e1" stroke-width="9"/><rect x="350" y="230" width="200" height="82" fill="#0f766e"/><rect x="330" y="335" width="240" height="32" fill="#0f3a5a" stroke="#28b6ff" stroke-width="4"/><text x="365" y="215" fill="#fff" font-size="22" font-weight="900">COOLING TOWER</text></svg>`;
  if(key==="exp") return `<svg viewBox="0 0 900 430"><rect x="360" y="95" width="180" height="250" rx="80" fill="#94a3b8" stroke="#e2e8f0" stroke-width="8"/><line x1="450" y1="345" x2="450" y2="390" stroke="#28b6ff" stroke-width="10"/><text x="350" y="220" fill="#08111f" font-size="22" font-weight="900">EXPANSION</text></svg>`;
  if(key==="hx") return `<svg viewBox="0 0 900 430"><rect x="260" y="135" width="380" height="180" rx="28" fill="#64748b" stroke="#cbd5e1" stroke-width="8"/><g stroke="#28b6ff" stroke-width="5">${[0,1,2,3,4,5].map(i=>`<line x1="${310+i*48}" y1="155" x2="${310+i*48}" y2="295"/>`).join("")}</g><line x1="160" y1="210" x2="260" y2="210" stroke="#28b6ff" stroke-width="10"/><line x1="640" y1="240" x2="760" y2="240" stroke="#36d399" stroke-width="10"/><text x="330" y="225" fill="#fff" font-size="22" font-weight="900">PLATE HX</text></svg>`;
  if(key==="building") return `<svg viewBox="0 0 900 430"><rect x="280" y="95" width="330" height="260" rx="18" fill="#1e293b" stroke="#cbd5e1" stroke-width="8"/><g fill="#28b6ff">${[0,1,2].map(r=>[0,1,2,3].map(c=>`<rect x="${320+c*62}" y="${135+r*60}" width="36" height="32" rx="4"/>`).join("")).join("")}</g><text x="345" y="330" fill="#fff" font-size="24" font-weight="900">BUILDING LOAD</text></svg>`;
  return `<svg viewBox="0 0 900 430"><ellipse cx="330" cy="230" rx="110" ry="82" fill="#1d4ed8" stroke="#93c5fd" stroke-width="8"/><ellipse cx="330" cy="230" rx="52" ry="40" fill="#dbeafe" stroke="#28b6ff" stroke-width="5"/><rect x="500" y="190" width="210" height="90" rx="22" fill="#111827" stroke="#94a3b8" stroke-width="6"/><line x1="390" y1="230" x2="500" y2="230" stroke="#cbd5e1" stroke-width="12"/><line x1="120" y1="230" x2="220" y2="230" stroke="#28b6ff" stroke-width="12"/><line x1="710" y1="230" x2="800" y2="230" stroke="#28b6ff" stroke-width="12"/><text x="275" y="355" fill="#fff" font-size="24" font-weight="900">CENTRIFUGAL PUMP</text></svg>`;
}
function placeholder(title,text){return `<section class="placeholder-view"><p class="eyebrow">Module placeholder</p><h2>${title}</h2><p>${text}</p><button class="primary-btn" data-view="home">Back Home</button></section>`}
function setView(name){const view=views[name]||views.home;document.getElementById("pageTitle").textContent=view.title;document.getElementById("viewRoot").innerHTML=view.render();document.querySelectorAll(".nav-item").forEach(btn=>btn.classList.toggle("active",btn.dataset.view===name));document.getElementById("sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}
document.addEventListener("click",e=>{
  const mode=e.target.closest("[data-mode]"); if(mode){viewerMode=mode.dataset.mode;setView("equipmentDetail");return;}
  const comp=e.target.closest("[data-component]"); if(comp){selectedComponent=Number(comp.dataset.component);setView("equipmentDetail");return;}
  const open=e.target.closest("[data-open-equipment]"); if(open){selectedEquipment=open.dataset.openEquipment;selectedComponent=0;setView("equipmentDetail");return;}
  const equip=e.target.closest("[data-equipment]"); if(equip){selectedEquipment=equip.dataset.equipment;selectedComponent=0;setView("chillerPlant");return;}
  if(e.target.id==="startPlantBtn"){plantRunning=!plantRunning;setView("chillerPlant");return;}
  const target=e.target.closest("[data-view]"); if(target)setView(target.dataset.view);
});
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
setView("home");
