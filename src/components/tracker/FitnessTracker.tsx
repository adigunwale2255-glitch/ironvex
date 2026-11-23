import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { getStoredMeasurements, saveMeasurement } from '../../lib/storage';
import { FitnessMeasurement } from '../../types';
import { ironAudio } from '../../lib/ironAudio';
import { 
  Scale, Activity, TrendingDown, TrendingUp, Plus, 
  Calendar, Info, CheckCircle2, Flame, Award, Dumbbell, X 
} from 'lucide-react';

export const FitnessTracker: React.FC = () => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<FitnessMeasurement[]>(() => 
    getStoredMeasurements(user?.id)
  );

  // New entry form state
  const [showLogModal, setShowLogModal] = useState(false);
  const [weightLbs, setWeightLbs] = useState<number>(182);
  const [heightCm, setHeightCm] = useState<number>(182);
  const [bodyFat, setBodyFat] = useState<number>(11.8);
  const [notes, setNotes] = useState('');

  // Hover point tooltip for SVG weight line chart
  const [hoveredPoint, setHoveredPoint] = useState<FitnessMeasurement | null>(null);

  const calculateBMI = (weightInLbs: number, heightInCm: number) => {
    const heightM = heightInCm / 100;
    const weightKg = weightInLbs * 0.453592;
    if (heightM <= 0) return 0;
    return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  };

  const getBMICategory = (bmi: number): 'Underweight' | 'Normal' | 'Overweight' | 'Obese' => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi <= 24.9) return 'Normal';
    if (bmi <= 29.9) return 'Overweight';
    return 'Obese';
  };

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (weightLbs <= 0 || heightCm <= 0) return;

    const bmi = calculateBMI(weightLbs, heightCm);
    const bmiCategory = getBMICategory(bmi);

    const newEntry: FitnessMeasurement = {
      id: `m-${Date.now()}`,
      memberId: user?.id || 'guest',
      weightLbs: Number(weightLbs),
      heightCm: Number(heightCm),
      bmi,
      bmiCategory,
      bodyFatPercentage: bodyFat ? Number(bodyFat) : undefined,
      date: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined
    };

    saveMeasurement(newEntry);
    setMeasurements(getStoredMeasurements(user?.id));
    setShowLogModal(false);
    ironAudio.playSuccess();
  };

  const latest = measurements[measurements.length - 1] || {
    weightLbs: 182,
    heightCm: 182,
    bmi: 24.9,
    bmiCategory: 'Normal',
    bodyFatPercentage: 11.9,
    date: 'Today'
  };

  const baseline = measurements[0] || latest;
  const weightDiff = (latest.weightLbs - baseline.weightLbs).toFixed(1);
  const isLoss = Number(weightDiff) < 0;

  // Compute SVG chart coordinates for weight progress
  const minWeight = Math.min(...measurements.map(m => m.weightLbs), 170) - 5;
  const maxWeight = Math.max(...measurements.map(m => m.weightLbs), 205) + 5;
  const chartWidth = 650;
  const chartHeight = 200;

  const points = measurements.map((m, idx) => {
    const x = measurements.length > 1 ? (idx / (measurements.length - 1)) * (chartWidth - 60) + 30 : chartWidth / 2;
    const y = chartHeight - ((m.weightLbs - minWeight) / (maxWeight - minWeight)) * (chartHeight - 40) - 20;
    return { x, y, data: m };
  });

  const svgPath = points.length > 1 
    ? points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')
    : '';

  // Weekly Activity Data (Mon-Sun)
  const weeklyActivity = [
    { day: 'Mon', minutes: 75, completed: true, focus: 'Back Squat & Quads' },
    { day: 'Tue', minutes: 60, completed: true, focus: 'Bench Press & Pecs' },
    { day: 'Wed', minutes: 0, completed: false, focus: 'Rest & Sauna Recovery' },
    { day: 'Thu', minutes: 80, completed: true, focus: 'Deadlifts & Posterior' },
    { day: 'Fri', minutes: 65, completed: true, focus: 'Shoulders & Arms' },
    { day: 'Sat', minutes: 45, completed: true, focus: 'Sleds & Turf Cardio' },
    { day: 'Sun', minutes: 0, completed: false, focus: 'Rest & Mobility' },
  ];

  const totalWeeklyMinutes = weeklyActivity.reduce((sum, d) => sum + d.minutes, 0);

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Top Header & Log Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-gold-400 font-bold tracking-widest">
            BIOMETRICS & PROGRESS ENGINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-0.5">
            ATHLETIC FITNESS TRACKER
          </h2>
          <p className="text-xs text-gray-400">
            Log physical measurements, monitor weight velocity, and inspect weekly training volume.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            ironAudio.playClick();
            setShowLogModal(true);
          }}
          className="px-4 py-2.5 bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Record New Measurement</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Current Weight */}
        <div className="bg-iron-950 p-5 rounded-2xl border border-iron-800 space-y-1">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400">
            <span>CURRENT WEIGHT</span>
            <Scale className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-3xl font-heading font-black text-white">
            {latest.weightLbs} <span className="text-sm font-sans font-normal text-gray-400">lbs</span>
          </div>
          <div className="text-xs font-mono flex items-center space-x-1">
            {isLoss ? (
              <span className="text-emerald-400 flex items-center">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                {Math.abs(Number(weightDiff))} lbs down
              </span>
            ) : (
              <span className="text-amber-400 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +{weightDiff} lbs gained
              </span>
            )}
            <span className="text-gray-400">since baseline</span>
          </div>
        </div>

        {/* Calculated BMI */}
        <div className="bg-iron-950 p-5 rounded-2xl border border-iron-800 space-y-1">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400">
            <span>BMI BENCHMARK</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-heading font-black text-white flex items-baseline space-x-2">
            <span>{latest.bmi}</span>
            <span className="text-xs font-heading font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {latest.bmiCategory}
            </span>
          </div>
          <span className="text-[11px] font-mono text-gray-400 block">Height: {latest.heightCm} cm</span>
        </div>

        {/* Body Fat Estimation */}
        <div className="bg-iron-950 p-5 rounded-2xl border border-iron-800 space-y-1">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400">
            <span>BODY FAT EST.</span>
            <Flame className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-3xl font-heading font-black text-gold-400">
            {latest.bodyFatPercentage || 12.0}%
          </div>
          <span className="text-[11px] font-mono text-emerald-400 block">Athletic Tier (Sub-14%)</span>
        </div>

        {/* Weekly Minutes */}
        <div className="bg-iron-950 p-5 rounded-2xl border border-iron-800 space-y-1">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400">
            <span>WEEKLY TIME</span>
            <Dumbbell className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-3xl font-heading font-black text-white">
            {totalWeeklyMinutes} <span className="text-sm font-sans font-normal text-gray-400">min</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 block">5 Sessions logged</span>
        </div>

      </div>

      {/* Interactive Weight Progress Chart */}
      <div className="bg-iron-950 p-6 sm:p-8 rounded-2xl border border-gold-500/30 space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-gold-400 tracking-wider">
              DATA VISUALIZATION
            </span>
            <h3 className="font-heading font-bold text-lg text-white">
              WEIGHT TRAJECTORY & COMPOSITION (LBS)
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-400">
            Hover over markers to view biometric snapshot
          </span>
        </div>

        {/* SVG Line Chart */}
        <div className="relative w-full overflow-x-auto pt-4 pb-2">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56 min-w-[500px]">
            {/* Grid lines */}
            <line x1="30" y1="30" x2={chartWidth - 30} y2="30" stroke="#1f242d" strokeDasharray="4 4" />
            <line x1="30" y1="80" x2={chartWidth - 30} y2="80" stroke="#1f242d" strokeDasharray="4 4" />
            <line x1="30" y1="130" x2={chartWidth - 30} y2="130" stroke="#1f242d" strokeDasharray="4 4" />
            <line x1="30" y1="180" x2={chartWidth - 30} y2="180" stroke="#1f242d" strokeDasharray="4 4" />

            {/* Gradient fill under line */}
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {points.length > 1 && (
              <path
                d={`${svgPath} L ${points[points.length - 1].x} ${chartHeight - 10} L ${points[0].x} ${chartHeight - 10} Z`}
                fill="url(#goldGradient)"
              />
            )}

            {/* Path line */}
            {points.length > 1 && (
              <path
                d={svgPath}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data points */}
            {points.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint?.id === pt.data.id ? "7" : "5"}
                  fill="#F5D76E"
                  stroke="#080808"
                  strokeWidth="2"
                  className="cursor-pointer transition-all hover:scale-125"
                  onMouseEnter={() => setHoveredPoint(pt.data)}
                />
                <text
                  x={pt.x}
                  y={chartHeight - 2}
                  fill="#71717a"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {pt.data.date.slice(5)}
                </text>
              </g>
            ))}
          </svg>

          {/* Point Tooltip */}
          {hoveredPoint && (
            <div className="p-3 bg-iron-900 border border-gold-400/60 rounded-xl shadow-xl text-xs space-y-1 max-w-xs mt-2 font-mono">
              <div className="flex justify-between text-gold-400 font-bold">
                <span>Date: {hoveredPoint.date}</span>
                <span>{hoveredPoint.weightLbs} lbs</span>
              </div>
              <div className="text-gray-300">BMI: {hoveredPoint.bmi} ({hoveredPoint.bmiCategory})</div>
              {hoveredPoint.bodyFatPercentage && (
                <div className="text-gray-300">Est. Body Fat: {hoveredPoint.bodyFatPercentage}%</div>
              )}
              {hoveredPoint.notes && (
                <p className="text-[11px] text-gray-400 italic">"{hoveredPoint.notes}"</p>
              )}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-iron-900/60 rounded-lg border border-iron-800 text-[11px] text-gray-400 flex items-start space-x-2">
          <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-gray-300">Health Screening Notice:</strong> BMI is a general screening indicator. Muscle density can register high-caliber athletes in higher weight brackets while possessing low sub-12% body fat. For exact caliper and DEXA scans, schedule a master coach session.
          </p>
        </div>
      </div>

      {/* Weekly Activity Bar Chart */}
      <div className="bg-iron-950 p-6 sm:p-8 rounded-2xl border border-iron-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono uppercase text-gold-400 tracking-wider">
              WEEKLY TRAINING DURATION
            </span>
            <h3 className="font-heading font-bold text-lg text-white">
              ACTIVITY MATRIX (MINUTES / DAY)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Target: 300+ Min / Week
          </span>
        </div>

        <div className="grid grid-cols-7 gap-3 pt-4">
          {weeklyActivity.map((d, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <span className="text-[11px] font-mono text-gray-400">{d.minutes}m</span>
              <div className="w-full h-36 bg-iron-900 rounded-xl overflow-hidden flex flex-col justify-end p-1 border border-iron-800">
                <div
                  className={`w-full rounded-lg transition-all duration-500 ${
                    d.completed ? 'bg-gradient-gold shadow-gold-glow-sm' : 'bg-transparent'
                  }`}
                  style={{ height: `${Math.min((d.minutes / 90) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs font-heading font-bold text-white">{d.day}</span>
              <span className="text-[9px] font-mono text-gray-400 text-center line-clamp-1">
                {d.focus}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Log Measurement Modal Dialog */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-iron-900 border border-gold-500/40 rounded-2xl shadow-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-iron-800 pb-3">
              <h4 className="font-heading font-bold text-white text-base">LOG BIOMETRIC RECORD</h4>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeasurement} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">Body Weight (Pounds)</label>
                <input
                  type="number"
                  step="0.5"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2.5 text-white font-mono text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">Height (Centimeters)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2.5 text-white font-mono text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">Body Fat % (Optional)</label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(Number(e.target.value))}
                  className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2.5 text-white font-mono text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">Progress Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Weigh-in fasted before morning training..."
                  className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2 text-white focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-3 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider rounded-lg shadow-gold-glow"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
