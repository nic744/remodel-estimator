import React, { useState, useEffect } from 'react';
import { Calculator, Bath, ChefHat, Info, Plus, Minus, Clock, Hammer, PaintBucket, ChevronDown, ChevronUp, Wand2, Grid, Droplets } from 'lucide-react';

// --- HELPER COMPONENTS ---

interface InputCardProps {
  children: React.ReactNode;
  className?: string;
}

const InputCard = ({ children, className = "" }: InputCardProps) => (
  <div className={`bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100 ${className}`}>
    {children}
  </div>
);

interface AccordionProps {
  title: string;
  icon?: any;
  children: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

const Accordion = ({ title, icon: Icon, children, isOpen, toggle }: AccordionProps) => (
  <div className="mb-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <button 
      onClick={toggle}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-2 text-gray-700 font-bold">
        {Icon && <Icon size={18} className="text-blue-500"/>}
        <span>{title}</span>
      </div>
      {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
    </button>
    {isOpen && <div className="p-4 border-t border-gray-100">{children}</div>}
  </div>
);

interface MoneyStepperProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
}

// 1. MONEY STEPPER
const MoneyStepper = ({ label, value, onChange, min, max, step }: MoneyStepperProps) => {
  const handleDecrease = () => onChange(Math.max(min, (value || 0) - step));
  const handleIncrease = () => onChange(Math.min(max, (value || 0) + step));

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1 border border-gray-100">
        <button onClick={handleDecrease} disabled={value <= min} className="p-2 bg-white rounded shadow-sm disabled:opacity-50"><Minus size={16}/></button>
        <span className="font-bold text-gray-800">${(value || 0).toLocaleString()}</span>
        <button onClick={handleIncrease} disabled={value >= max} className="p-2 bg-blue-600 text-white rounded shadow-sm disabled:opacity-50"><Plus size={16}/></button>
      </div>
    </div>
  );
};

interface ArrayStepperProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  steps: number[];
}

// 2. ARRAY STEPPER
const ArrayStepper = ({ label, value, onChange, steps }: ArrayStepperProps) => {
  const currentIndex = steps.indexOf(value) !== -1 ? steps.indexOf(value) : 0;
  const handlePrev = () => { if (currentIndex > 0) onChange(steps[currentIndex - 1]); };
  const handleNext = () => { if (currentIndex < steps.length - 1) onChange(steps[currentIndex + 1]); };

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1 border border-gray-100">
        <button onClick={handlePrev} disabled={currentIndex === 0} className="p-2 bg-white rounded shadow-sm disabled:opacity-50"><Minus size={16}/></button>
        <span className="font-bold text-gray-800">${(value || 0).toLocaleString()}</span>
        <button onClick={handleNext} disabled={currentIndex === steps.length - 1} className="p-2 bg-blue-600 text-white rounded shadow-sm disabled:opacity-50"><Plus size={16}/></button>
      </div>
    </div>
  );
};

interface UnitStepperProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  unit?: string;
}

// 3. UNIT STEPPER
const UnitStepper = ({ label, value, onChange, min, max, unit = "" }: UnitStepperProps) => {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1 border border-gray-100">
        <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="p-2 bg-white rounded shadow-sm disabled:opacity-50"><Minus size={16}/></button>
        <span className="font-bold text-gray-800">{value} {unit}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="p-2 bg-blue-600 text-white rounded shadow-sm disabled:opacity-50"><Plus size={16}/></button>
      </div>
    </div>
  );
};

interface CountInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  costPerUnit: number;
}

// 4. COUNT INPUT
const CountInput = ({ label, value, onChange, costPerUnit }: CountInputProps) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <div>
      <div className="text-sm font-semibold text-gray-700">{label}</div>
      <div className="text-xs text-gray-400">Cost: ${costPerUnit}/ea</div>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(Math.max(0, value - 1))} disabled={value === 0} className="p-1 bg-gray-100 rounded text-gray-600"><Minus size={14}/></button>
      <span className="w-4 text-center font-bold text-gray-800">{value}</span>
      <button onClick={() => onChange(value + 1)} className="p-1 bg-blue-100 text-blue-700 rounded"><Plus size={14}/></button>
    </div>
  </div>
);

interface AreaLevelInputProps {
  label: string;
  sqFt: number;
  setSqFt: (val: number) => void;
  levelCost: number;
  setLevelCost: (val: number) => void;
  levels: { label: string; cost: number }[];
  step?: number;
}

// 5. AREA INPUT
const AreaLevelInput = ({ label, sqFt, setSqFt, levelCost, setLevelCost, levels, step = 5 }: AreaLevelInputProps) => (
  <div className="mb-6 last:mb-0">
    <div className="flex justify-between items-center mb-2">
      <label className="text-sm font-bold text-gray-800">{label}</label>
      <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
        <button onClick={() => setSqFt(Math.max(0, sqFt - step))} className="text-blue-400 p-1 active:scale-95 transition-transform"><Minus size={12}/></button>
        <input 
          type="number"
          value={sqFt}
          onChange={(e) => setSqFt(Math.max(0, parseInt(e.target.value) || 0))}
          className="font-bold text-blue-700 w-10 text-center bg-transparent outline-none p-0"
        />
        <span className="text-[10px] text-blue-400 font-bold">SF</span>
        <button onClick={() => setSqFt(sqFt + step)} className="text-blue-600 p-1 active:scale-95 transition-transform"><Plus size={12}/></button>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-1">
      {levels.map((lvl) => (
        <button
          key={lvl.cost}
          onClick={() => setLevelCost(lvl.cost)}
          className={`py-2 text-center rounded border transition-all ${
            levelCost === lvl.cost ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-gray-500'
          }`}
        >
          <div className="text-[9px] uppercase font-bold opacity-80">{lvl.label}</div>
          <div className="text-xs font-black">${lvl.cost}</div>
        </button>
      ))}
    </div>
  </div>
);


// --- MAIN APP COMPONENT ---

export default function App() {
  const [activeTab, setActiveTab] = useState('bathroom'); 
  const [showDetails, setShowDetails] = useState(false);
  const [openSections, setOpenSections] = useState({ trades: false, vanity: false, wet: true, tiling: true, lvp: false, misc: false });

  const toggleSection = (section: string) => {
    setOpenSections((prev: any) => ({ ...prev, [section]: !prev[section] }));
  };

  // --- SMART INPUTS ---
  const [roomSize, setRoomSize] = useState(60); 
  const [ceilingHeight, setCeilingHeight] = useState(8); 
  const [scopeLevel, setScopeLevel] = useState('gut'); 

  // --- DERIVED STATE ---
  
  // 1. Prep & General
  const [permitCost, setPermitCost] = useState(150);
  const [jobWeeks, setJobWeeks] = useState(6); 
  const [demoCost, setDemoCost] = useState(1500);

  // 2. Trades
  const [framingCost, setFramingCost] = useState(500); 
  const [insulationCost, setInsulationCost] = useState(200);
  const [drywallCost, setDrywallCost] = useState(1500);
  const [carpentryCost, setCarpentryCost] = useState(300); 
  const [paintCost, setPaintCost] = useState(750); 
  const [plumbingCost, setPlumbingCost] = useState(2100); 
  const [electricalCost, setElectricalCost] = useState(1500); 
  const [hvacCost, setHvacCost] = useState(250); 

  // 3. Vanity
  const [vanityCost, setVanityCost] = useState(2500); 
  const [mirrorCost, setMirrorCost] = useState(750); 
  const [counterSF, setCounterSF] = useState(10);
  const [counterCost, setCounterCost] = useState(80); 
  const [sinkCount, setSinkCount] = useState(1);
  const [faucetCount, setFaucetCount] = useState(1);
  const [lightCount, setLightCount] = useState(1);

  // 4. Wet Area & Plumbing
  const [tubCost, setTubCost] = useState(2500); 
  const [plumbingFixtureCost, setPlumbingFixtureCost] = useState(600); 
  const [glassCost, setGlassCost] = useState(1500); 
  const [toiletCount, setToiletCount] = useState(1);

  // 5. Tiling (Consolidated)
  const [showerWallSF, setShowerWallSF] = useState(90);
  const [showerWallCost, setShowerWallCost] = useState(7.5); 
  const [showerFloorSF, setShowerFloorSF] = useState(15);
  const [showerFloorCost, setShowerFloorCost] = useState(10); 
  const [bathFloorSF, setBathFloorSF] = useState(45);
  const [bathFloorCost, setBathFloorCost] = useState(7.5); 
  const [otherTileSF, setOtherTileSF] = useState(0);
  const [otherTileCost, setOtherTileCost] = useState(10); 
  const [tileInstallCost, setTileInstallCost] = useState(0); 

  // 6. LVP
  const [lvpSF, setLvpSF] = useState(0);
  const [lvpCost, setLvpCost] = useState(5); 
  const [lvpInstallCost, setLvpInstallCost] = useState(0); 


  // --- SMART LOGIC EFFECT ---
  useEffect(() => {
    if (activeTab === 'kitchen') return;

    // Height Multiplier (Standard is 8ft, so 10ft = 1.25x)
    const heightMult = ceilingHeight / 8;

    // 1. General & Demo
    const isGut = scopeLevel === 'gut';
    setDemoCost(isGut ? 500 + (roomSize * 15 * heightMult) : 500 + (roomSize * 5)); 
    setJobWeeks(isGut ? Math.max(3, Math.ceil(roomSize / 15)) : Math.max(2, Math.ceil(roomSize / 25)));

    // 2. Trades
    setPlumbingCost(roomSize * 35);
    setElectricalCost(roomSize * 25);
    setHvacCost(250);
    setCarpentryCost(roomSize * 5);
    
    setFramingCost(isGut ? Math.round(Math.min(2000, 250 + (roomSize * 10 * heightMult))) : 0);
    setInsulationCost(isGut ? Math.round(Math.min(500, 100 + (roomSize * 2))) : 0);
    setDrywallCost(Math.round(roomSize * 20 * heightMult)); 
    setPaintCost(Math.round(roomSize * 20 * heightMult));

    // 3. Vanity Logic
    const isLarge = roomSize > 65;
    setSinkCount(isLarge ? 2 : 1);
    setFaucetCount(isLarge ? 2 : 1);
    setLightCount(isLarge ? 2 : 1);
    
    setVanityCost(roomSize * 25);
    setMirrorCost(roomSize * 10);
    setCounterSF(isLarge ? 15 : 8);

    // 4. Wet Area Logic
    setTubCost(roomSize > 60 ? 3000 : 750);
    setPlumbingFixtureCost(roomSize * 10);
    setGlassCost(Math.round(roomSize * 35 * heightMult));

    // 5. Tiling Logic
    const baseShowerWalls = isLarge ? 110 : 80;
    setShowerWallSF(Math.round(baseShowerWalls * heightMult));
    setShowerFloorSF(isLarge ? 20 : 12);
    setBathFloorSF(Math.round(roomSize * 0.75));

  }, [roomSize, scopeLevel, activeTab, ceilingHeight]);

  // --- INSTALL CALCULATION EFFECTS ---
  useEffect(() => {
    const totalTileSF = showerWallSF + showerFloorSF + bathFloorSF + otherTileSF;
    setTileInstallCost(totalTileSF * 15);
  }, [showerWallSF, showerFloorSF, bathFloorSF, otherTileSF]);

  useEffect(() => {
    setLvpInstallCost(lvpSF * 2.5);
  }, [lvpSF]);


  // --- TOTAL CALCULATION ---
  const MARKUP = 1.54; 

  const getCleanupCost = () => {
    if (jobWeeks >= 5) return 900;
    if (jobWeeks >= 3) return 600;
    return 300;
  };

  const calculateBath = () => {
    let totalCost = 0;
    totalCost += permitCost + (jobWeeks * 1200) + demoCost + getCleanupCost();
    
    totalCost += framingCost + insulationCost + drywallCost + carpentryCost + paintCost;
    totalCost += plumbingCost + electricalCost + hvacCost;

    const rawCounterCost = counterSF * counterCost;
    const finalCounterCost = Math.max(750, rawCounterCost); 
    totalCost += vanityCost + mirrorCost + finalCounterCost + (sinkCount * 175) + (faucetCount * 350) + (lightCount * 200);

    totalCost += tubCost + plumbingFixtureCost + glassCost + (toiletCount * 450);

    totalCost += (showerWallSF * showerWallCost);
    totalCost += (showerFloorSF * showerFloorCost);
    totalCost += (bathFloorSF * bathFloorCost);
    totalCost += (otherTileSF * otherTileCost);
    totalCost += tileInstallCost; 

    totalCost += (lvpSF * lvpCost);
    totalCost += lvpInstallCost; 

    return totalCost * MARKUP;
  };

  const getEstimate = () => {
    const base = calculateBath();
    return {
      low: Math.round((base * 0.97) / 100) * 100,
      high: Math.round((base * 1.03) / 100) * 100,
    };
  };

  const estimate = getEstimate();

  // WIDENED CONTAINER HERE: max-w-3xl
  return (
    <div className="flex flex-col h-screen bg-slate-100 w-full max-w-3xl mx-auto shadow-2xl overflow-hidden font-sans">
      
      {/* HEADER */}
      <header className="bg-blue-900 text-white pt-6 pb-4 px-6 shadow-lg shrink-0 z-50 relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calculator size={24} />
            QuickEst
          </h1>
          <span className="text-xs bg-blue-800 px-2 py-1 rounded text-blue-200 border border-blue-700">v1.6 Wide</span>
        </div>
        <div className="flex p-1 bg-blue-800 rounded-xl">
           <div className="flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 bg-white text-blue-900 shadow-sm">
            <Bath size={18} /> Bathroom Estimator
           </div>
        </div>
      </header>

      {/* SCROLLABLE CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="pt-6 px-4 space-y-4">
          
          {/* --- SMART MASTER INPUTS --- */}
          <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 size={20} className="text-yellow-300"/>
              <h2 className="font-bold text-lg">Smart Setup</h2>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-blue-100">Room Size</label>
                <span className="text-2xl font-bold">{roomSize} SF</span>
              </div>
              <input
                type="range"
                min={30}
                max={150}
                step={5}
                value={roomSize}
                onChange={(e) => setRoomSize(Number(e.target.value))}
                className="w-full h-2 bg-blue-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
            </div>

             {/* Ceiling Height */}
             <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-blue-100">Ceiling Height</label>
                <span className="text-2xl font-bold">{ceilingHeight} FT</span>
              </div>
              <input
                type="range"
                min={8}
                max={12}
                step={1}
                value={ceilingHeight}
                onChange={(e) => setCeilingHeight(Number(e.target.value))}
                className="w-full h-2 bg-blue-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
               <div className="flex justify-between text-[10px] text-blue-300 mt-1">
                <span>Std (8)</span>
                <span>Tall (12)</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-blue-100 mb-2 block">Scope Level</label>
              <div className="grid grid-cols-2 gap-2 bg-blue-800 p-1 rounded-lg">
                <button
                  onClick={() => setScopeLevel('cosmetic')}
                  className={`py-2 rounded text-sm font-bold transition-all ${scopeLevel === 'cosmetic' ? 'bg-white text-blue-900' : 'text-blue-300'}`}
                >
                  Cosmetic
                </button>
                <button
                  onClick={() => setScopeLevel('gut')}
                  className={`py-2 rounded text-sm font-bold transition-all ${scopeLevel === 'gut' ? 'bg-white text-blue-900' : 'text-blue-300'}`}
                >
                  Full Gut
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 font-medium py-2">
            Default costs based on {roomSize} SF & {ceilingHeight} FT Ceiling.
          </p>

          {/* --- COLLAPSIBLE SECTIONS --- */}

          {/* SECTION 1: PREP */}
          <Accordion title="Prep & General" icon={Clock} isOpen={true} toggle={() => {}}>
             <MoneyStepper label="Permit Cost" value={permitCost} onChange={setPermitCost} min={0} max={1000} step={50} />
             <MoneyStepper label="Demo & Dumpster" value={demoCost} onChange={setDemoCost} min={500} max={3500} step={100} />
             <UnitStepper label="Job Duration" value={jobWeeks} onChange={setJobWeeks} min={1} max={12} unit="Weeks" />
             <div className="text-xs text-gray-500 mt-2 text-right">
               PM: ${(jobWeeks*1200).toLocaleString()} | Clean: ${getCleanupCost()}
             </div>
          </Accordion>

          {/* SECTION 2: TRADES */}
          <Accordion title="Trades & Rough-In" icon={Hammer} isOpen={openSections.trades} toggle={() => toggleSection('trades')}>
             <MoneyStepper label="Plumbing" value={plumbingCost} onChange={setPlumbingCost} min={0} max={8000} step={100} />
             <MoneyStepper label="Electrical" value={electricalCost} onChange={setElectricalCost} min={0} max={6000} step={100} />
             <MoneyStepper label="HVAC" value={hvacCost} onChange={setHvacCost} min={0} max={2000} step={50} />
             <MoneyStepper label="Carpentry" value={carpentryCost} onChange={setCarpentryCost} min={0} max={5000} step={100} />
             <div className="my-4 border-t border-gray-100"></div>
             <ArrayStepper label="Paint" value={paintCost} onChange={setPaintCost} steps={[0, 500, 750, 1000, 1250, 1500, 2000, 2500, 3000]} />
             <MoneyStepper label="Framing" value={framingCost} onChange={setFramingCost} min={0} max={2000} step={100} />
             <MoneyStepper label="Insulation" value={insulationCost} onChange={setInsulationCost} min={0} max={500} step={50} />
             <MoneyStepper label="Drywall" value={drywallCost} onChange={setDrywallCost} min={0} max={3000} step={100} />
          </Accordion>

          {/* SECTION 3: VANITY */}
          <Accordion title="Vanity & Sink Area" icon={ChefHat} isOpen={openSections.vanity} toggle={() => toggleSection('vanity')}>
             <MoneyStepper label="Vanity Unit" value={vanityCost} onChange={setVanityCost} min={0} max={6500} step={100} />
             <MoneyStepper label="Mirrors" value={mirrorCost} onChange={setMirrorCost} min={0} max={2000} step={50} />
             <CountInput label="Sinks" value={sinkCount} onChange={setSinkCount} costPerUnit={175} />
             <CountInput label="Faucets" value={faucetCount} onChange={setFaucetCount} costPerUnit={350} />
             <CountInput label="Lights" value={lightCount} onChange={setLightCount} costPerUnit={200} />
             <AreaLevelInput label="Countertop" sqFt={counterSF} setSqFt={setCounterSF} levelCost={counterCost} setLevelCost={setCounterCost} levels={[{label: 'Lvl 1', cost: 60}, {label: 'Lvl 2', cost: 80}, {label: 'Lvl 3', cost: 100}]} step={1} />
             <div className="text-xs text-blue-600 text-right -mt-4 mb-4 mr-2 italic">
               (Min. Charge: $750)
             </div>
          </Accordion>

          {/* SECTION 4: TILING */}
          <Accordion title="Tiling & Stone" icon={Grid} isOpen={openSections.tiling} toggle={() => toggleSection('tiling')}>
            <AreaLevelInput label="Shower Walls" sqFt={showerWallSF} setSqFt={setShowerWallSF} levelCost={showerWallCost} setLevelCost={setShowerWallCost} levels={[{label: 'Bud', cost: 5}, {label: 'Std', cost: 7.5}, {label: 'Lux', cost: 10}]} />
            <AreaLevelInput label="Shower Floor" sqFt={showerFloorSF} setSqFt={setShowerFloorSF} levelCost={showerFloorCost} setLevelCost={setShowerFloorCost} levels={[{label: 'Bud', cost: 6}, {label: 'Std', cost: 10}, {label: 'Lux', cost: 15}]} />
            <AreaLevelInput label="Bath Floor" sqFt={bathFloorSF} setSqFt={setBathFloorSF} levelCost={bathFloorCost} setLevelCost={setBathFloorCost} levels={[{label: 'Bud', cost: 5}, {label: 'Std', cost: 7.5}, {label: 'Lux', cost: 10}]} />
            <AreaLevelInput label="Other Tile" sqFt={otherTileSF} setSqFt={setOtherTileSF} levelCost={otherTileCost} setLevelCost={setOtherTileCost} levels={[{label: 'Bud', cost: 6}, {label: 'Std', cost: 10}, {label: 'Lux', cost: 15}]} />
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex justify-between items-center mt-2">
              <span className="text-sm font-bold text-blue-700">Tile Labor ($15/sf)</span>
              <span className="text-lg font-black text-blue-900">${tileInstallCost.toLocaleString()}</span>
            </div>
          </Accordion>

          {/* SECTION 5: WET AREA & PLUMBING */}
          <Accordion title="Wet Area & Toilet" icon={Droplets} isOpen={openSections.wet} toggle={() => toggleSection('wet')}>
            <MoneyStepper label="Tub+Filler" value={tubCost} onChange={setTubCost} min={0} max={5000} step={100} />
            <MoneyStepper label="Plumbing Fix." value={plumbingFixtureCost} onChange={setPlumbingFixtureCost} min={0} max={2500} step={50} />
            <MoneyStepper label="Shower Glass" value={glassCost} onChange={setGlassCost} min={0} max={5000} step={100} />
            <CountInput label="Toilets" value={toiletCount} onChange={setToiletCount} costPerUnit={450} />
          </Accordion>

          {/* SECTION 6: LVP */}
          <Accordion title="LVP Flooring" icon={PaintBucket} isOpen={openSections.lvp} toggle={() => toggleSection('lvp')}>
             <AreaLevelInput label="LVP Material" sqFt={lvpSF} setSqFt={setLvpSF} levelCost={lvpCost} setLevelCost={setLvpCost} levels={[{label: 'Basic', cost: 3.5}, {label: 'Mid', cost: 5}, {label: 'High', cost: 7}]} />
             <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center mt-2">
              <span className="text-sm font-bold text-gray-700">LVP Install ($2.50/sf)</span>
              <span className="text-lg font-black text-gray-900">${lvpInstallCost.toLocaleString()}</span>
            </div>
          </Accordion>

        </div>
      </main>

      {/* STICKY FOOTER WITH FIXED CENTERING */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50">
        <div className="p-4">
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-medium text-gray-500">Estimated Range</span>
            <button onClick={() => setShowDetails(!showDetails)} className="text-blue-600 text-xs font-bold flex items-center gap-1">
              {showDetails ? 'Hide Details' : 'Show Breakdown'} <Info size={12}/>
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-800">${estimate.low.toLocaleString()}</span>
            <span className="text-lg font-medium text-gray-400">-</span>
            <span className="text-3xl font-extrabold text-gray-800">${estimate.high.toLocaleString()}</span>
          </div>
          
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600 space-y-1 animate-in slide-in-from-bottom-2 fade-in duration-300">
               <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between"><span>Raw Costs:</span> <span className="font-medium text-gray-500">${(estimate.low / MARKUP).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Markup (1.54):</span> <span className="font-medium text-green-600">+${(estimate.low - (estimate.low / MARKUP)).toLocaleString()}</span></div>
               </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}