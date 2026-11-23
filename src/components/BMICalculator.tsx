import React, { useState, useMemo } from 'react';
import { ironAudio } from '../lib/ironAudio';
import { Activity, Info, Scale, Dumbbell, Flame, CheckCircle, ArrowRight } from 'lucide-react';

export const BMICalculator: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  
  // Metric values
  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(76);

  // Imperial values
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(10);
  const [weightLbs, setWeightLbs] = useState<number>(168);

  // Compute BMI
  const calculation = useMemo(() => {
    let bmiValue = 0;
    if (unit === 'metric') {
      const heightM = heightCm / 100;
      if (heightM > 0) {
        bmiValue = weightKg / (heightM * heightM);
      }
    } else {
      const totalInches = heightFeet * 12 + heightInches;
      if (totalInches > 0) {
        bmiValue = (weightLbs / (totalInches * totalInches)) * 703;
      }
    }

    const roundedBmi = parseFloat(bmiValue.toFixed(1));

    let category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese' = 'Normal';
    let color = 'text-emerald-400';
    let borderColor = 'border-emerald-500';
    let bgGlow = 'rgba(16, 185, 129, 0.2)';
    let recommendation = '';
    let dietAdvice = '';
    let targetGoal = 'Hypertrophy & Conditioning';

    if (roundedBmi < 18.5) {
      category = 'Underweight';
      color = 'text-amber-400';
      borderColor = 'border-amber-500';
      bgGlow = 'rgba(245, 158, 11, 0.2)';
      recommendation = 'Focus on a controlled caloric surplus with heavy compound resistance training (Squats, Deadlifts, Presses) to stimulate lean muscle mass accretion.';
      dietAdvice = 'Aim for 1.8–2.2g of protein per kg of bodyweight, dense whole-food carbohydrates (oats, sweet potatoes, jasmine rice), and healthy fats.';
      targetGoal = 'Hypertrophy & Strength';
    } else if (roundedBmi >= 18.5 && roundedBmi <= 24.9) {
      category = 'Normal';
      color = 'text-emerald-400';
      borderColor = 'border-emerald-500';
      bgGlow = 'rgba(16, 185, 129, 0.2)';
      recommendation = 'Optimal body composition foundation. Focus on progressive overload, athletic conditioning, and maintaining high metabolic velocity.';
      dietAdvice = 'Maintain isocaloric energy balance with 1.6–2.0g protein/kg, optimal hydration, and peri-workout nutrient timing.';
      targetGoal = 'Strength & Power';
    } else if (roundedBmi >= 25 && roundedBmi <= 29.9) {
      category = 'Overweight';
      color = 'text-gold-400';
      borderColor = 'border-gold-500';
      bgGlow = 'rgba(212, 175, 55, 0.2)';
      recommendation = 'Incorporate high-density resistance circuits and Zone 2 cardiovascular work (curved treadmills, sled pushes) to mobilize visceral fat stores.';
      dietAdvice = 'Slight 300–500 kcal deficit, high protein (2.0g/kg) to preserve lean mass, and fiber-rich greens to optimize satiety.';
      targetGoal = 'Body Recomposition & Fat Shred';
    } else {
      category = 'Obese';
      color = 'text-rose-400';
      borderColor = 'border-rose-500';
      bgGlow = 'rgba(244, 63, 94, 0.2)';
      recommendation = 'Structured joint-friendly resistance training combined with low-impact steady state cardio (rowing, swimming, incline walking). Work closely with an IRONVEX master trainer.';
      dietAdvice = 'Structured calorie deficit supervised by nutrition coaching, elimination of refined sugars, and daily hydration exceeding 3 liters.';
      targetGoal = 'Metabolic Reconditioning';
    }

    // Gauge percentage (10 to 40 BMI scale)
    const gaugePercent = Math.min(Math.max(((roundedBmi - 15) / (40 - 15)) * 100, 0), 100);

    return {
      bmi: roundedBmi,
      category,
      color,
      borderColor,
      bgGlow,
      recommendation,
      dietAdvice,
      targetGoal,
      gaugePercent
    };
  }, [unit, heightCm, weightKg, heightFeet, heightInches, weightLbs]);

  return (
    <section id="bmi" className="relative py-24 bg-iron-900 border-y border-iron-800 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>BIOMETRIC PRECISION TOOL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-white mb-4">
            BODY MASS INDEX & COMPOSITION
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Input your metrics to calculate your BMI and generate tailored training and nutritional recommendations.
          </p>

          {/* Unit Toggle */}
          <div className="mt-6 inline-flex bg-iron-950 p-1 rounded-xl border border-iron-800">
            <button
              type="button"
              onClick={() => {
                ironAudio.playClick();
                setUnit('metric');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                unit === 'metric'
                  ? 'bg-gradient-gold text-black shadow-gold-glow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Metric (cm / kg)
            </button>
            <button
              type="button"
              onClick={() => {
                ironAudio.playClick();
                setUnit('imperial');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                unit === 'imperial'
                  ? 'bg-gradient-gold text-black shadow-gold-glow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Imperial (ft, in / lbs)
            </button>
          </div>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-5 bg-iron-950 p-6 sm:p-8 rounded-2xl border border-iron-800 space-y-6">
            <h3 className="font-heading font-bold text-lg text-white flex items-center space-x-2 border-b border-iron-800 pb-3">
              <Activity className="w-5 h-5 text-gold-400" />
              <span>ENTER YOUR METRICS</span>
            </h3>

            {unit === 'metric' ? (
              <>
                {/* Height (cm) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-400 uppercase">Height (Centimeters)</span>
                    <span className="text-gold-400 font-bold text-sm">{heightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min={120}
                    max={225}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full accent-gold-400 cursor-pointer h-2 bg-iron-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                    <span>120 cm</span>
                    <span>170 cm</span>
                    <span>225 cm</span>
                  </div>
                </div>

                {/* Weight (kg) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-400 uppercase">Weight (Kilograms)</span>
                    <span className="text-gold-400 font-bold text-sm">{weightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={160}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-gold-400 cursor-pointer h-2 bg-iron-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                    <span>40 kg</span>
                    <span>100 kg</span>
                    <span>160 kg</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Height (ft & in) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-400 uppercase">Height</span>
                    <span className="text-gold-400 font-bold text-sm">
                      {heightFeet} ft {heightInches} in
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-mono block mb-1">Feet</label>
                      <input
                        type="number"
                        min={4}
                        max={7}
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(Number(e.target.value))}
                        className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2 text-white font-mono text-sm focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-mono block mb-1">Inches</label>
                      <input
                        type="number"
                        min={0}
                        max={11}
                        value={heightInches}
                        onChange={(e) => setHeightInches(Number(e.target.value))}
                        className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2 text-white font-mono text-sm focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Weight (lbs) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-400 uppercase">Weight (Pounds)</span>
                    <span className="text-gold-400 font-bold text-sm">{weightLbs} lbs</span>
                  </div>
                  <input
                    type="range"
                    min={90}
                    max={350}
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-full accent-gold-400 cursor-pointer h-2 bg-iron-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                    <span>90 lbs</span>
                    <span>220 lbs</span>
                    <span>350 lbs</span>
                  </div>
                </div>
              </>
            )}

            {/* Disclaimer box */}
            <div className="p-3 bg-iron-900/90 rounded-lg border border-iron-800 flex items-start space-x-2.5 text-xs text-gray-400">
              <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-gray-300">Disclaimer:</strong> BMI is a general screening indicator. Highly trained lifters with high lean muscular density may register as "Overweight" while possessing optimal sub-12% body fat. For exact caliper & DEXA scans, book with an IRONVEX coach.
              </p>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 bg-iron-950 p-6 sm:p-8 rounded-2xl border border-gold-500/30 relative overflow-hidden shadow-2xl">
            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-500"
              style={{ backgroundColor: calculation.bgGlow }}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-iron-800 gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-gray-400 tracking-wider">
                  Calculated BMI Index
                </span>
                <div className="flex items-baseline space-x-3 mt-1">
                  <span className="text-5xl sm:text-6xl font-heading font-black text-white">
                    {calculation.bmi}
                  </span>
                  <span className={`text-base sm:text-lg font-heading font-bold px-3 py-1 rounded-full border ${calculation.borderColor} ${calculation.color} bg-black/40`}>
                    {calculation.category}
                  </span>
                </div>
              </div>

              <div className="bg-iron-900 p-3 rounded-xl border border-iron-800 text-xs text-right">
                <span className="text-gray-400 block font-mono">Optimal Health Range</span>
                <span className="font-heading font-bold text-gold-400 text-sm">18.5 – 24.9 BMI</span>
              </div>
            </div>

            {/* Gauge Bar */}
            <div className="my-6 space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-gray-400 uppercase">
                <span>Underweight (&lt;18.5)</span>
                <span>Normal (18.5-24.9)</span>
                <span>Overweight (25-29.9)</span>
                <span>Obese (30+)</span>
              </div>
              <div className="h-3 w-full bg-iron-900 rounded-full overflow-hidden flex relative p-0.5 border border-iron-800">
                <div className="h-full bg-amber-500/70 w-[22%]" />
                <div className="h-full bg-emerald-500/80 w-[26%]" />
                <div className="h-full bg-gold-500/80 w-[22%]" />
                <div className="h-full bg-rose-500/80 w-[30%]" />

                {/* Marker pointer */}
                <div 
                  className="absolute top-0 bottom-0 w-2.5 bg-white shadow-lg border border-black rounded-full transform -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${calculation.gaugePercent}%` }}
                />
              </div>
            </div>

            {/* Custom Prescriptions */}
            <div className="space-y-4 pt-2">
              <div className="bg-iron-900/80 p-4 rounded-xl border border-iron-800">
                <div className="flex items-center space-x-2 text-gold-400 text-xs font-mono uppercase font-bold mb-1">
                  <Dumbbell className="w-4 h-4" />
                  <span>Targeted Training Protocol</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {calculation.recommendation}
                </p>
              </div>

              <div className="bg-iron-900/80 p-4 rounded-xl border border-iron-800">
                <div className="flex items-center space-x-2 text-gold-400 text-xs font-mono uppercase font-bold mb-1">
                  <Flame className="w-4 h-4" />
                  <span>Nutritional & Caloric Strategy</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {calculation.dietAdvice}
                </p>
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-6 pt-4 border-t border-iron-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <CheckCircle className="w-4 h-4 text-gold-400" />
                <span>Recommended Split: <strong className="text-white">{calculation.targetGoal}</strong></span>
              </div>
              <a
                href="#workout-planner"
                onClick={() => ironAudio.playClick()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Generate Plan for This BMI</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
