import React, { useState, useEffect } from 'react';
import { ironAudio } from '../lib/ironAudio';
import { 
  Dumbbell, Timer, CheckSquare, Square, RotateCcw, Play, Pause, 
  Flame, Award, Layers, Zap, ChevronRight 
} from 'lucide-react';

interface RoutineExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  target: string;
  tips: string;
}

interface RoutineDay {
  dayName: string;
  title: string;
  exercises: RoutineExercise[];
}

export const WorkoutPlanner: React.FC = () => {
  // Config state
  const [goal, setGoal] = useState<'hypertrophy' | 'fat_loss' | 'strength' | 'endurance' | 'functional'>('strength');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [splitDays, setSplitDays] = useState<3 | 4 | 5 | 6>(4);

  // Active day tab
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Completed exercises set
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('ironvex_completed_exercises');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Built-in Rest Timer
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInitial, setTimerInitial] = useState(60);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 4 && prev > 1) {
            ironAudio.playBeep(false);
          } else if (prev === 1) {
            ironAudio.playBeep(true);
            setIsTimerRunning(false);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startRestTimer = (seconds: number) => {
    ironAudio.playClick(900);
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    ironAudio.playClick();
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    ironAudio.playClick(600);
    setIsTimerRunning(false);
    setTimerSeconds(timerInitial);
  };

  // Generate dynamic schedule based on selections
  const schedule: RoutineDay[] = React.useMemo(() => {
    if (goal === 'strength') {
      return [
        {
          dayName: 'Day 1',
          title: 'Heavy Barbell Back Squat & Lower Kinetic Chain',
          exercises: [
            { id: 's1', name: 'Barbell Back Squat', sets: level === 'advanced' ? 5 : 4, reps: level === 'beginner' ? '5 reps' : '3-5 reps @ RPE 8.5', restSec: 180, target: 'Quadriceps, Glutes, Core', tips: 'Break at knees and hips simultaneously, hit parallel with braced thoracic cage.' },
            { id: 's2', name: 'Romanian Deadlift (RDL)', sets: 3, reps: '8-10 reps', restSec: 120, target: 'Hamstrings, Posterior Chain', tips: 'Hinge hips backwards, keep barbell skimming shins, neutral cervical spine.' },
            { id: 's3', name: 'Bulgarian Split Squat', sets: 3, reps: '10 reps / leg', restSec: 90, target: 'Unilateral Quads & Stabilizers', tips: 'Drive through lead heel, control descent for 3 seconds.' },
            { id: 's4', name: 'Standing Calf Raise on Platform', sets: 4, reps: '12-15 reps', restSec: 60, target: 'Gastrocnemius & Soleus', tips: 'Full stretch at bottom, pause 2 seconds at peak contraction.' }
          ]
        },
        {
          dayName: 'Day 2',
          title: 'Heavy Competition Bench Press & Upper Power',
          exercises: [
            { id: 's5', name: 'Barbell Flat Bench Press', sets: level === 'advanced' ? 5 : 4, reps: '4-6 reps', restSec: 150, target: 'Pectoralis Major, Anterior Deltoid', tips: 'Retract scapulae tightly, drive heels into floor, bar touches sternum.' },
            { id: 's6', name: 'Overhead Standing Military Press', sets: 3, reps: '6-8 reps', restSec: 120, target: 'Anterior/Lateral Delts, Triceps', tips: 'Full lockout overhead without excessive lumbar hyperextension.' },
            { id: 's7', name: 'Pendlay Barbell Row', sets: 4, reps: '6-8 reps', restSec: 90, target: 'Latissimus Dorsi, Rhomboids', tips: 'Reset on floor between each rep for explosive concentric pull.' },
            { id: 's8', name: 'Close-Grip Triceps Press', sets: 3, reps: '8-10 reps', restSec: 60, target: 'Triceps Brachii', tips: 'Shoulder-width grip, tuck elbows tight against ribs.' }
          ]
        },
        {
          dayName: 'Day 3',
          title: 'Deadlift Mastery & Heavy Posterior Power',
          exercises: [
            { id: 's9', name: 'Conventional Deadlift', sets: level === 'advanced' ? 5 : 3, reps: '3-5 reps', restSec: 180, target: 'Entire Posterior Chain & Grip', tips: 'Pull slack out of bar before breaking the floor, squeeze glutes at lockout.' },
            { id: 's10', name: 'Barbell Hip Thrust', sets: 3, reps: '8-10 reps', restSec: 90, target: 'Gluteus Maximus', tips: 'Pivot on bench below shoulder blades, hold 2-second squeeze at top.' },
            { id: 's11', name: 'Farmer Walk with Heavy Trap Bar', sets: 4, reps: '50 Meters', restSec: 90, target: 'Traps, Grip, Core Anti-Lateral Flexion', tips: 'Tall spine, tight core, steady measured footsteps.' },
            { id: 's12', name: 'Hanging Leg Raises', sets: 3, reps: '12-15 reps', restSec: 60, target: 'Rectus Abdominis', tips: 'Control swing, tilt pelvis upwards at top of movement.' }
          ]
        },
        {
          dayName: 'Day 4',
          title: 'Accessory Hypertrophy & Biomechanics Balance',
          exercises: [
            { id: 's13', name: 'Incline Dumbbell Press', sets: 4, reps: '8-10 reps', restSec: 90, target: 'Clavicular Head Pectoralis', tips: 'Set bench to 30 degrees for maximum upper chest stimulation.' },
            { id: 's14', name: 'Weighted Pull-Ups / Lat Pulldown', sets: 4, reps: '6-8 reps', restSec: 90, target: 'Latissimus Dorsi', tips: 'Drive elbows down to waist, avoid chin craning.' },
            { id: 's15', name: 'Dumbbell Lateral Raise (Heavy Partial to Drop)', sets: 4, reps: '12-15 reps', restSec: 60, target: 'Lateral Deltoid', tips: 'Lead with elbows, keep pinkies slightly tilted up.' },
            { id: 's16', name: 'Barbell Preacher Curl', sets: 3, reps: '10-12 reps', restSec: 60, target: 'Biceps Brachii Short Head', tips: 'Full extension without hyperextending elbows.' }
          ]
        }
      ].slice(0, splitDays);
    } else if (goal === 'hypertrophy') {
      return [
        {
          dayName: 'Day 1',
          title: 'Chest & Triceps Hypertrophy Annihilation',
          exercises: [
            { id: 'h1', name: 'Incline Barbell Bench Press', sets: 4, reps: '8-10 reps', restSec: 90, target: 'Upper Chest', tips: 'Focus on 3-second eccentric stretch at bottom.' },
            { id: 'h2', name: 'Flat Dumbbell Press', sets: 4, reps: '10-12 reps', restSec: 75, target: 'Mid Pecs', tips: 'Deep stretch at bottom, convergent squeeze at top.' },
            { id: 'h3', name: 'Standing Cable Flyes (Low to High)', sets: 3, reps: '12-15 reps', restSec: 60, target: 'Sternal & Clavicular Chest', tips: 'Keep elbows with slight bend, hold peak squeeze 1 second.' },
            { id: 'h4', name: 'Overhead Cable Rope Triceps Extension', sets: 4, reps: '12-15 reps', restSec: 60, target: 'Triceps Long Head', tips: 'Flatter elbows out slightly to isolate long head.' }
          ]
        },
        {
          dayName: 'Day 2',
          title: 'Back & Biceps Width and Thickness',
          exercises: [
            { id: 'h5', name: 'Barbell Chest-Supported T-Bar Row', sets: 4, reps: '8-10 reps', restSec: 90, target: 'Rhomboids, Mid Traps', tips: 'Elbows flared 45 degrees, pull through hands as hooks.' },
            { id: 'h6', name: 'Wide-Grip Lat Pulldown', sets: 4, reps: '10-12 reps', restSec: 75, target: 'Lat Width', tips: 'Engage lats first before bending arms.' },
            { id: 'h7', name: 'Seated Incline Dumbbell Bicep Curl', sets: 3, reps: '10-12 reps', restSec: 60, target: 'Biceps Long Head', tips: 'Maximum stretch at bottom of 45-degree incline.' },
            { id: 'h8', name: 'Hammer Curls with Dumbbells', sets: 3, reps: '12-15 reps', restSec: 60, target: 'Brachialis & Forearms', tips: 'Thumbs pointing up throughout the entire arc.' }
          ]
        },
        {
          dayName: 'Day 3',
          title: 'Shoulders & Trap 3D Cap Sculpting',
          exercises: [
            { id: 'h9', name: 'Seated Dumbbell Shoulder Press', sets: 4, reps: '8-10 reps', restSec: 90, target: 'Anterior & Lateral Delts', tips: 'Palms slightly angled inward for shoulder health.' },
            { id: 'h10', name: 'Cable Lateral Raise Behind Back', sets: 4, reps: '12-15 reps', restSec: 60, target: 'Lateral Deltoid Isolated', tips: 'Constant tension throughout the entire movement arc.' },
            { id: 'h11', name: 'Face Pulls with External Rotation', sets: 4, reps: '15-20 reps', restSec: 60, target: 'Rear Delts & Rotator Cuff', tips: 'Pull rope apart at eye level, finish with thumbs back.' },
            { id: 'h12', name: 'Heavy Barbell Shrugs', sets: 4, reps: '10-12 reps', restSec: 60, target: 'Upper Trapezius', tips: '2-second pause at top, avoid rolling shoulders.' }
          ]
        },
        {
          dayName: 'Day 4',
          title: 'Quads, Hamstrings & Calves Quad Sweep',
          exercises: [
            { id: 'h13', name: 'Hack Squat Machine', sets: 4, reps: '10-12 reps', restSec: 90, target: 'Quad Sweep', tips: 'Low foot placement for pure knee flexion quad loading.' },
            { id: 'h14', name: 'Lying Leg Curl Machine', sets: 4, reps: '10-12 reps', restSec: 75, target: 'Hamstring Bellies', tips: 'Keep hips pinned to pad, slow 3-second negative.' },
            { id: 'h15', name: 'Leg Extension (Quad Burnout Dropset)', sets: 3, reps: '12-15 reps + dropset', restSec: 60, target: 'Rectus Femoris', tips: 'Hard pause at lockout, descend smoothly.' },
            { id: 'h16', name: 'Seated Calf Raise', sets: 4, reps: '15-20 reps', restSec: 45, target: 'Soleus', tips: 'Full ankle dorsiflexion stretch.' }
          ]
        }
      ].slice(0, splitDays);
    } else {
      // General Functional & Athletic conditioning
      return [
        {
          dayName: 'Day 1',
          title: 'Explosive Lower Power & Kinetic Acceleration',
          exercises: [
            { id: 'f1', name: 'Kettlebell Heavy Cleans & Squats', sets: 4, reps: '8 reps', restSec: 90, target: 'Triple Extension Power', tips: 'Hinge explosively, snap hips into locked extension.' },
            { id: 'f2', name: 'Hex Bar Deadlift Jumps (Low Load)', sets: 4, reps: '5 reps', restSec: 90, target: 'Rate of Force Development', tips: 'Explode off ground, soft knee landing mechanics.' },
            { id: 'f3', name: 'Sled Push (Turf 40 Yards)', sets: 4, reps: '40 Yards', restSec: 60, target: 'Metabolic Drive & Quads', tips: 'Low body angle, drive balls of feet hard into turf.' },
            { id: 'f4', name: 'Medicine Ball Rotational Slams', sets: 3, reps: '10 / side', restSec: 45, target: 'Obliques & Transverse Power', tips: 'Pivot rear foot, slam ball violently beside lead foot.' }
          ]
        },
        {
          dayName: 'Day 2',
          title: 'Upper Torso Athletic Strength & Trunk Integrity',
          exercises: [
            { id: 'f5', name: 'Gymnastic Ring Dips', sets: 4, reps: '8-10 reps', restSec: 90, target: 'Chest, Triceps, Shoulder Stabilizers', tips: 'Turn rings out at top of lockout for rotator stability.' },
            { id: 'f6', name: 'Renegade Rows with Hex Dumbbells', sets: 3, reps: '8 reps / side', restSec: 60, target: 'Core Anti-Rotation & Lats', tips: 'Wide foot stance, keep pelvis parallel to floor.' },
            { id: 'f7', name: 'Concept2 Rower 500m Sprints', sets: 4, reps: '500m @ Max Wattage', restSec: 90, target: 'Full Body Cardiovascular Capacity', tips: 'Leg drive 60%, hip hinge 20%, arm pull 20%.' },
            { id: 'f8', name: 'Hanging Windshield Wipers', sets: 3, reps: '10 reps', restSec: 60, target: 'Deep Core Musculature', tips: 'Keep shoulders locked down, sweep legs with control.' }
          ]
        },
        {
          dayName: 'Day 3',
          title: 'High-Velocity Conditioning & Dynamic Agility',
          exercises: [
            { id: 'f9', name: 'Assault AirBike Tabata Sprints', sets: 8, reps: '20s Sprint / 10s Rest', restSec: 120, target: 'VO2 Max & Lactic Threshold', tips: 'Full gas pedal from second 1, push and pull handlebars.' },
            { id: 'f10', name: 'Dual Kettlebell Front Rack Carry', sets: 3, reps: '60 Meters', restSec: 75, target: 'Thoracic Extension & Diaphragm', tips: 'Breathe into belly while maintaining vertical posture.' },
            { id: 'f11', name: 'Plyometric Box Jumps (Step Down)', sets: 4, reps: '6 reps', restSec: 60, target: 'Elastic Stretch-Shortening Cycle', tips: 'Land softly like a panther, step down rather than jumping down.' },
            { id: 'f12', name: 'Battle Ropes Alternating Waves', sets: 4, reps: '30 seconds', restSec: 45, target: 'Shoulder Endurance & Heart Rate', tips: 'Athletic quarter squat stance, flick wrists vigorously.' }
          ]
        }
      ].slice(0, splitDays);
    }
  }, [goal, level, splitDays]);

  const currentDay = schedule[activeDayIndex] || schedule[0];

  const toggleExerciseComplete = (id: string) => {
    const next = new Set(completedExercises);
    if (next.has(id)) {
      next.delete(id);
      ironAudio.playClick(500);
    } else {
      next.add(id);
      ironAudio.playSuccess();
    }
    setCompletedExercises(next);
    localStorage.setItem('ironvex_completed_exercises', JSON.stringify(Array.from(next)));
  };

  const totalExercisesInSchedule = schedule.reduce((acc, d) => acc + d.exercises.length, 0);
  const completedInCurrentSchedule = schedule.flatMap(d => d.exercises).filter(e => completedExercises.has(e.id)).length;
  const progressPercent = totalExercisesInSchedule > 0 
    ? Math.round((completedInCurrentSchedule / totalExercisesInSchedule) * 100) 
    : 0;

  return (
    <section id="planner" className="relative py-28 bg-iron-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>DYNAMIC SPLIT ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-white mb-4">
            BESPOKE WORKOUT PLANNER
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Select your training goal, lifting tenure, and frequency to compile a day-by-day protocol with built-in rest intervals and live completion tracking.
          </p>
        </div>

        {/* Configuration Bar */}
        <div className="bg-iron-900/90 border border-gold-500/30 rounded-2xl p-6 sm:p-8 mb-10 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Goal Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-gold-400 tracking-wider mb-2 flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Primary Training Goal</span>
              </label>
              <select
                value={goal}
                onChange={(e) => {
                  ironAudio.playClick();
                  setGoal(e.target.value as any);
                }}
                className="w-full bg-iron-950 border border-iron-700 text-white rounded-lg p-2.5 text-sm font-semibold focus:border-gold-400 focus:outline-none cursor-pointer"
              >
                <option value="strength">Strength & Powerlifting (Raw Strength)</option>
                <option value="hypertrophy">Muscle Building & Hypertrophy (Aesthetics)</option>
                <option value="fat_loss">Body Fat Shred & Conditioning</option>
                <option value="endurance">Athletic Endurance & VO2 Peak</option>
                <option value="functional">Functional Movement & Longevity</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-mono uppercase text-gold-400 tracking-wider mb-2 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Experience Level</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      ironAudio.playClick();
                      setLevel(lvl);
                    }}
                    className={`py-2 rounded-lg text-xs font-mono uppercase font-bold tracking-wider transition-all ${
                      level === lvl
                        ? 'bg-gradient-gold text-black shadow-gold-glow'
                        : 'bg-iron-950 text-gray-400 hover:text-white border border-iron-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Training Frequency Split */}
            <div>
              <label className="block text-xs font-mono uppercase text-gold-400 tracking-wider mb-2 flex items-center space-x-1.5">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Weekly Training Split</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {([3, 4, 5, 6] as const).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => {
                      ironAudio.playClick();
                      setSplitDays(days);
                      if (activeDayIndex >= days) setActiveDayIndex(0);
                    }}
                    className={`py-2 rounded-lg text-xs font-mono uppercase font-bold tracking-wider transition-all ${
                      splitDays === days
                        ? 'bg-gradient-gold text-black shadow-gold-glow'
                        : 'bg-iron-950 text-gray-400 hover:text-white border border-iron-800'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div className="pt-4 border-t border-iron-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <span className="text-xs font-mono uppercase text-gray-400">Routine Progress:</span>
              <div className="flex-1 sm:w-64 h-3 bg-iron-950 rounded-full overflow-hidden p-0.5 border border-iron-800">
                <div
                  className="h-full bg-gradient-gold rounded-full transition-all duration-500 shadow-gold-glow"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-mono text-gold-400 text-xs font-bold">{progressPercent}%</span>
            </div>

            <div className="text-xs font-mono text-gray-400 flex items-center space-x-2">
              <Zap className="w-3.5 h-3.5 text-gold-400" />
              <span>{completedInCurrentSchedule} of {totalExercisesInSchedule} lifts recorded</span>
            </div>
          </div>
        </div>

        {/* Schedule Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Day Tabs */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-iron-900/60 p-4 rounded-xl border border-iron-800">
              <h3 className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold mb-3">
                WEEKLY SPLIT DAYS
              </h3>
              <div className="space-y-2">
                {schedule.map((day, idx) => {
                  const dayCompletedCount = day.exercises.filter(e => completedExercises.has(e.id)).length;
                  const isDayDone = dayCompletedCount === day.exercises.length && day.exercises.length > 0;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        ironAudio.playClick();
                        setActiveDayIndex(idx);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between ${
                        activeDayIndex === idx
                          ? 'bg-iron-800 border-2 border-gold-500/80 shadow-md'
                          : 'bg-iron-950/70 border border-iron-800/80 hover:border-iron-700'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-mono font-bold uppercase ${
                            activeDayIndex === idx ? 'text-gold-400' : 'text-gray-400'
                          }`}>
                            {day.dayName}
                          </span>
                          {isDayDone && (
                            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/40">
                              COMPLETE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white font-medium line-clamp-1">{day.title}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                        activeDayIndex === idx ? 'text-gold-400 translate-x-1' : 'text-gray-400'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Built-in Rest Timer Widget */}
            <div className="bg-iron-900 p-6 rounded-xl border border-gold-500/30 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-gold-400 text-xs font-mono uppercase font-bold">
                <Timer className="w-4 h-4" />
                <span>BARBELL REST TIMER</span>
              </div>
              <div className="text-5xl font-mono font-black text-white tracking-widest">
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </div>
              <div className="flex justify-center space-x-2">
                {[30, 60, 90, 180].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => startRestTimer(sec)}
                    className="px-2.5 py-1 rounded bg-iron-950 text-[11px] font-mono text-gray-300 hover:text-gold-400 border border-iron-800 transition-colors"
                  >
                    {sec}s
                  </button>
                ))}
              </div>
              <div className="flex justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={toggleTimer}
                  className="px-4 py-2 rounded-lg bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider flex items-center space-x-1 shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetTimer}
                  className="px-3 py-2 rounded-lg bg-iron-800 text-gray-300 hover:text-white font-mono text-xs uppercase flex items-center space-x-1 border border-iron-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Exercise Table for the Active Day */}
          <div className="lg:col-span-8 bg-iron-900/50 p-6 sm:p-8 rounded-2xl border border-iron-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-iron-800 gap-2">
              <div>
                <span className="text-xs font-mono uppercase text-gold-400 font-bold tracking-wider">
                  {currentDay.dayName} Focus
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-white mt-0.5">
                  {currentDay.title}
                </h3>
              </div>
              <span className="text-xs font-mono text-gray-400 bg-iron-950 px-3 py-1.5 rounded-lg border border-iron-800 self-start sm:self-auto">
                {currentDay.exercises.length} Exercises Scheduled
              </span>
            </div>

            {/* Exercises List */}
            <div className="space-y-4">
              {currentDay.exercises.map((ex) => {
                const isDone = completedExercises.has(ex.id);
                return (
                  <div
                    key={ex.id}
                    className={`p-4 rounded-xl transition-all border ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-500/40 opacity-80'
                        : 'bg-iron-950 border-iron-800 hover:border-gold-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <button
                          type="button"
                          onClick={() => toggleExerciseComplete(ex.id)}
                          className="mt-1 text-gold-400 hover:text-gold-300 transition-transform active:scale-90"
                          title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                        >
                          {isDone ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400 hover:text-gold-400" />
                          )}
                        </button>
                        <div>
                          <h4 className={`text-base font-heading font-bold text-white ${
                            isDone ? 'line-through text-gray-400' : ''
                          }`}>
                            {ex.name}
                          </h4>
                          <span className="text-xs text-gold-400/90 font-mono">
                            Target: {ex.target}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => startRestTimer(ex.restSec)}
                        className="px-2.5 py-1 rounded bg-iron-900 border border-iron-700 text-[11px] font-mono text-gray-300 hover:text-gold-400 flex items-center space-x-1 shrink-0"
                        title="Start Rest Timer"
                      >
                        <Timer className="w-3 h-3 text-gold-400" />
                        <span>{ex.restSec}s Rest</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-iron-900 text-xs font-mono">
                      <div className="bg-iron-900/80 px-2.5 py-1 rounded">
                        <span className="text-gray-400">Sets: </span>
                        <strong className="text-white">{ex.sets} Working Sets</strong>
                      </div>
                      <div className="bg-iron-900/80 px-2.5 py-1 rounded">
                        <span className="text-gray-400">Reps: </span>
                        <strong className="text-white">{ex.reps}</strong>
                      </div>
                      <div className="col-span-2 sm:col-span-1 bg-iron-900/80 px-2.5 py-1 rounded">
                        <span className="text-gray-400">Tempo: </span>
                        <strong className="text-white">3-1-X-1</strong>
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs text-gray-400 italic bg-black/30 p-2 rounded border border-iron-900">
                      💡 <strong>Coaching Cue:</strong> {ex.tips}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
