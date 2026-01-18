
import React, { useState } from 'react';
import { Quarter, EvaluationSubject, GradeEntry, WeightCategory, SUBJECT_COLORS } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calculator, ChevronRight, ArrowLeft, X, Settings2, AlertCircle, Trophy, Zap, RefreshCw, Star, Scale, CheckCircle2, SendHorizonal } from 'lucide-react';

interface EvaluationsViewProps {
  quarters: Quarter[];
  onUpdateQuarters: (quarters: Quarter[]) => void;
}

export const EvaluationsView: React.FC<EvaluationsViewProps> = ({ quarters, onUpdateQuarters }) => {
  const [activeQuarterIdx, setActiveQuarterIdx] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [showWeightSettings, setShowWeightSettings] = useState(false);
  
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [newGradeName, setNewGradeName] = useState('');
  const [newGradeScore, setNewGradeScore] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatWeight, setNewCatWeight] = useState('');

  const [isProtocolActive, setIsProtocolActive] = useState(false);
  const [protocolScore, setProtocolScore] = useState('');

  const activeQuarter = quarters[activeQuarterIdx] || quarters[0];
  const selectedSubject = activeQuarter?.subjects.find(s => s.id === selectedSubjectId);

  // LOGICA DE CALCULOS
  const getSubjectStats = (subject: EvaluationSubject) => {
    const gradesByCategory: Record<string, number[]> = {};
    subject.grades.forEach(g => {
      if (!gradesByCategory[g.categoryId]) gradesByCategory[g.categoryId] = [];
      gradesByCategory[g.categoryId].push(g.score);
    });
    
    let calculatedPoints = 0;
    let weightEvaluatedSoFar = 0;

    Object.entries(gradesByCategory).forEach(([catId, scores]) => {
      const cat = subject.weightCategories.find(c => c.id === catId);
      if (cat) {
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        calculatedPoints += (avgScore * cat.weight) / 100;
        weightEvaluatedSoFar += cat.weight;
      }
    });

    const totalWeightConfigured = subject.weightCategories.reduce((acc, c) => acc + c.weight, 0);
    
    let finalGrade = calculatedPoints; 
    let status: 'normal' | 'recovered' | 'improved' = 'normal';
    let isManual = false;

    if (subject.improvementGrade !== undefined) {
      finalGrade = subject.improvementGrade;
      status = 'improved';
      isManual = true;
    } else if (subject.recoveryGrade !== undefined) {
      finalGrade = subject.recoveryGrade;
      status = 'recovered';
      isManual = true;
    }
    
    return { 
      finalGrade, 
      status, 
      isManual,
      calculatedPoints, 
      weightEvaluatedSoFar,
      totalWeightConfigured
    };
  };

  const handleUpdateSubject = (updatedSubject: EvaluationSubject) => {
    const newQuarters = quarters.map((q, idx) => {
      if (idx === activeQuarterIdx) {
        return {
          ...q,
          subjects: q.subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s)
        };
      }
      return q;
    });
    onUpdateQuarters(newQuarters);
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    const currentSubjectCount = activeQuarter?.subjects.length || 0;
    const newSubject: EvaluationSubject = {
      id: crypto.randomUUID(),
      name: newSubjectName.trim().toUpperCase(),
      color: SUBJECT_COLORS[currentSubjectCount % SUBJECT_COLORS.length].value,
      weightCategories: [],
      grades: []
    };
    
    const newQuarters = quarters.map((q, idx) => {
      if (idx === activeQuarterIdx) {
        return { ...q, subjects: [...q.subjects, newSubject] };
      }
      return q;
    });
    
    onUpdateQuarters(newQuarters);
    setNewSubjectName('');
    setIsAddingSubject(false);
  };

  const handleAddCategory = () => {
    if (!selectedSubject) return;
    const weight = parseFloat(newCatWeight);
    if (!newCatName || isNaN(weight)) return;
    
    const currentTotal = selectedSubject.weightCategories.reduce((acc, c) => acc + c.weight, 0);
    if (currentTotal + weight > 100) return alert(`Límite excedido. Solo puedes añadir un ${100 - currentTotal}% más.`);

    const updated = {
      ...selectedSubject,
      weightCategories: [...selectedSubject.weightCategories, { id: crypto.randomUUID(), name: newCatName.toUpperCase(), weight }]
    };
    handleUpdateSubject(updated);
    setIsAddingCategory(false);
    setNewCatName('');
    setNewCatWeight('');
  };

  const deleteSubject = (id: string) => {
    if (!confirm("¿ELIMINAR ASIGNATURA? Esta acción es irreversible.")) return;
    const newQuarters = quarters.map((q, idx) => {
      if (idx === activeQuarterIdx) {
        return { ...q, subjects: q.subjects.filter(s => s.id !== id) };
      }
      return q;
    });
    onUpdateQuarters(newQuarters);
    setSelectedSubjectId(null);
  };

  const handleApplyProtocol = (type: 'recovery' | 'improvement') => {
    if (!selectedSubject) return;
    const score = parseFloat(protocolScore);
    if (isNaN(score) || score < 0 || score > 10) return alert("Error: Nota inválida (0-10)");

    const updated: EvaluationSubject = { ...selectedSubject };
    if (type === 'recovery') {
      updated.recoveryGrade = score;
      delete updated.improvementGrade;
    } else {
      updated.improvementGrade = score;
      delete updated.recoveryGrade;
    }

    handleUpdateSubject(updated);
    setIsProtocolActive(false);
    setProtocolScore('');
  };

  const resetProtocol = () => {
    if (!selectedSubject) return;
    const updated = { ...selectedSubject };
    delete updated.recoveryGrade;
    delete updated.improvementGrade;
    handleUpdateSubject(updated);
  };

  if (showSummary) {
    const allSubjectNames = Array.from(new Set(quarters.flatMap(q => q.subjects.map(s => s.name)))).sort();
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6 pb-24">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowSummary(false)} className="p-2 bg-surface border-2 border-main neo-shadow-sm hover:scale-110 active:scale-95 transition-transform"><ArrowLeft size={20} /></button>
          <h2 className="text-2xl font-black italic uppercase text-main tracking-tighter">EL EVALUADOR</h2>
        </div>
        <div className="bg-surface border-[4px] border-main neo-shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-main text-surface text-[10px] font-black uppercase tracking-widest">
                <th className="p-4 border-r-2 border-surface/20">ASIGNATURA</th>
                {quarters.map(q => <th key={q.id} className="p-4 text-center">{q.name.split(' ')[0]}</th>)}
              </tr>
            </thead>
            <tbody>
              {allSubjectNames.map((name) => (
                <tr key={name} className="border-b-2 border-main/10 hover:bg-main/5 transition-colors">
                  <td className="p-4 text-[10px] font-black uppercase border-r-2 border-main/10">{name}</td>
                  {quarters.map(q => {
                    const sub = q.subjects.find(s => s.name === name);
                    if (!sub) return <td key={q.id} className="p-4 text-center opacity-5">-</td>;
                    const stats = getSubjectStats(sub);
                    return (
                      <td key={q.id} className="p-4 text-center">
                        <span className={`text-lg font-black italic ${stats.finalGrade >= 5 ? 'text-primary' : 'text-red-500'}`}>
                          {stats.finalGrade.toFixed(2)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black italic uppercase text-main tracking-tighter">Evaluaciones</h2>
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowSummary(true)} 
          className="bg-primary text-white border-[3px] border-main neo-shadow-sm px-4 py-2 text-[10px] font-black uppercase flex items-center gap-2"
        >
          <Calculator size={14} /> EL EVALUADOR
        </motion.button>
      </div>

      <div className="flex gap-2 bg-surface border-[3px] border-main p-1 neo-shadow-sm overflow-x-auto no-scrollbar">
        {quarters.map((q, idx) => (
          <button key={q.id} onClick={() => { setActiveQuarterIdx(idx); setSelectedSubjectId(null); }} className={`flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeQuarterIdx === idx ? 'bg-main text-surface' : 'text-main opacity-30 hover:opacity-100'}`}>
            {q.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!selectedSubjectId ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            {activeQuarter?.subjects.map((sub) => {
              const stats = getSubjectStats(sub);
              return (
                <motion.div 
                  layoutId={sub.id}
                  key={sub.id} onClick={() => setSelectedSubjectId(sub.id)} 
                  className="bg-surface border-[3px] border-main p-5 neo-shadow-sm flex items-center justify-between cursor-pointer group hover:bg-main/5 relative overflow-hidden" 
                  style={{ borderLeft: `8px solid ${sub.color}` }}
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-black uppercase italic text-main">{sub.name}</h4>
                    <div className="flex gap-3 mt-1 opacity-40">
                      <span className="text-[9px] font-black uppercase tracking-widest">{sub.grades.length} EXÁMENES</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${stats.finalGrade >= 5 ? 'text-primary' : 'text-red-500'}`}>NOTA: {stats.finalGrade.toFixed(2)}</span>
                    </div>
                  </div>
                  <ChevronRight size={22} className="text-main opacity-10 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              );
            })}
            
            {isAddingSubject ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border-[3px] border-main p-4 neo-shadow-sm space-y-4">
                <input autoFocus type="text" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddSubject()} placeholder="NOMBRE ASIGNATURA" className="w-full bg-main/5 border-[2px] border-main p-4 text-[12px] font-black uppercase outline-none focus:bg-main/10 text-main" />
                <div className="flex gap-2">
                  <button onClick={handleAddSubject} className="flex-1 bg-primary text-white py-3 text-[10px] font-black uppercase border-[2px] border-main neo-shadow-sm">GUARDAR</button>
                  <button onClick={() => setIsAddingSubject(false)} className="bg-surface text-main py-3 px-6 text-[10px] font-black uppercase border-[2px] border-main">X</button>
                </div>
              </motion.div>
            ) : (
              <button onClick={() => setIsAddingSubject(true)} className="w-full py-6 border-[3px] border-dashed border-main/20 flex items-center justify-center gap-3 text-[11px] font-black uppercase opacity-30 hover:opacity-100 transition-all"><Plus size={18} /> NUEVA ASIGNATURA</button>
            )}
          </motion.div>
        ) : (
          <motion.div layoutId={selectedSubjectId} key="detail" className="space-y-6">
            <div className="bg-surface border-[4px] border-main p-6 neo-shadow relative">
              <div className="flex items-center justify-between mb-8">
                <button onClick={() => { setSelectedSubjectId(null); setIsProtocolActive(false); }} className="text-[9px] font-black uppercase opacity-40 hover:opacity-100 flex items-center gap-1"><ArrowLeft size={12} /> VOLVER</button>
                <div className="flex gap-2">
                  <button onClick={() => deleteSubject(selectedSubject!.id)} className="p-2 border-2 border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded"><Trash2 size={16} /></button>
                  <button onClick={() => setShowWeightSettings(!showWeightSettings)} className={`p-2 border-2 border-main neo-shadow-sm ${showWeightSettings ? 'bg-main text-white' : 'bg-surface text-main'}`}><Settings2 size={16} /></button>
                </div>
              </div>

              {showWeightSettings ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-black italic uppercase text-main">Pesos y Ponderación</h3>
                    <div className="px-3 py-1 border-2 border-main/20 text-[10px] font-black uppercase">
                      Ponderado: <span className={getSubjectStats(selectedSubject!).totalWeightConfigured === 100 ? 'text-primary' : 'text-red-500'}>{getSubjectStats(selectedSubject!).totalWeightConfigured}/100%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedSubject?.weightCategories.map(cat => (
                      <div key={cat.id} className="flex items-center justify-between p-3 bg-main/5 border-2 border-main/10">
                        <span className="text-[10px] font-black uppercase text-main">{cat.name} ({cat.weight}%)</span>
                        <button onClick={() => handleUpdateSubject({...selectedSubject, weightCategories: selectedSubject.weightCategories.filter(c => c.id !== cat.id)})} className="text-red-500 hover:scale-125 transition-transform"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                  {isAddingCategory ? (
                    <div className="p-4 border-2 border-main bg-main/5 space-y-3">
                      <input autoFocus type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="NOMBRE CATEGORÍA" className="w-full p-2 text-[10px] border-2 border-main font-black uppercase outline-none" />
                      <input type="number" value={newCatWeight} onChange={e => setNewCatWeight(e.target.value)} placeholder="PESO %" className="w-full p-2 text-[10px] border-2 border-main font-black outline-none" />
                      <button onClick={handleAddCategory} className="w-full py-2 bg-main text-surface font-black text-[10px] uppercase">AÑADIR</button>
                    </div>
                  ) : (
                    <button onClick={() => setIsAddingCategory(true)} className="w-full py-2 border-2 border-dashed border-main/20 text-[10px] font-black uppercase opacity-40 hover:opacity-100">+ NUEVA CATEGORÍA</button>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-4xl font-black italic uppercase text-main leading-none">{selectedSubject?.name}</h3>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-2">EXPEDIENTE OPERATIVO</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-5xl font-black italic ${getSubjectStats(selectedSubject!).finalGrade >= 5 ? 'text-primary' : 'text-red-500'}`}>
                        {getSubjectStats(selectedSubject!).finalGrade.toFixed(2)}
                      </span>
                      <p className="text-[8px] font-black opacity-30 uppercase">NOTA GLOBAL</p>
                    </div>
                  </div>

                  {/* PROTOCOLOS DE REESCRITURA */}
                  <div className="bg-main/5 border-[3px] border-main p-5 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 opacity-50">
                        <AlertCircle size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Protocolos de Éxito</span>
                      </div>
                      {getSubjectStats(selectedSubject!).isManual && (
                        <button onClick={resetProtocol} className="text-[8px] font-black text-red-500 uppercase flex items-center gap-1 border border-red-500/30 px-2 py-1"><RefreshCw size={10} /> RESET</button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setIsProtocolActive(true)}
                        className={`py-4 border-2 border-main text-[10px] font-black uppercase flex items-center justify-center gap-2 ${getSubjectStats(selectedSubject!).finalGrade < 5 ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}
                      >
                        {getSubjectStats(selectedSubject!).finalGrade < 5 ? <><Zap size={14} fill="currentColor" /> RECUPERACIÓN</> : <><Trophy size={14} /> SUBIR NOTA</>}
                      </button>
                      <div className="bg-surface border-2 border-main flex flex-col items-center justify-center">
                         <motion.span 
                            key={protocolScore}
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                            className="text-lg font-black italic text-main"
                         >
                           {(isProtocolActive && protocolScore) ? parseFloat(protocolScore).toFixed(2) : getSubjectStats(selectedSubject!).finalGrade.toFixed(2)}
                         </motion.span>
                         <span className="text-[7px] font-black opacity-30 uppercase">PTS REALES</span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isProtocolActive && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-4 border-t-2 border-main/10 overflow-hidden space-y-4">
                           <input autoFocus type="number" step="0.1" value={protocolScore} onChange={e => setProtocolScore(e.target.value)} placeholder="INTRODUCE NOTA FINAL (0-10)" className="w-full bg-surface border-2 border-main p-4 text-2xl font-black italic outline-none text-main" />
                           <button onClick={() => handleApplyProtocol(getSubjectStats(selectedSubject!).finalGrade < 5 ? 'recovery' : 'improvement')} className="w-full bg-main text-surface py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary transition-colors">
                               INYECTAR CALIFICACIÓN <SendHorizonal size={18} />
                           </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* HISTORIAL EXAMENES */}
                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-main opacity-20 uppercase tracking-[0.4em]">Historial Operativo</p>
                    {selectedSubject?.grades.map((grade) => {
                      const cat = selectedSubject.weightCategories.find(c => c.id === grade.categoryId);
                      const points = (grade.score * (cat?.weight || 0)) / 100;
                      return (
                        <div key={grade.id} className="flex items-center justify-between p-4 bg-main/5 border-2 border-main/10 group">
                          <div className="flex-1">
                            <p className="text-[11px] font-black uppercase text-main">{grade.name}</p>
                            <span className="text-[8px] font-black uppercase opacity-40">VALOR: {cat?.weight || 0}% PESO</span>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-black italic ${grade.score >= 5 ? 'text-primary' : 'text-red-500'}`}>{grade.score.toFixed(1)}</p>
                            <p className="text-[8px] font-black text-primary uppercase">+{points.toFixed(2)} PTS</p>
                          </div>
                          <button 
                            onClick={() => handleUpdateSubject({...selectedSubject, grades: selectedSubject.grades.filter(g => g.id !== grade.id)})}
                            className="ml-4 p-2 text-main/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4">
                    {!isAddingGrade ? (
                      <button onClick={() => { if (selectedSubject!.weightCategories.length === 0) return alert("Configura los pesos primero."); setIsAddingGrade(true); }} className="w-full py-5 bg-main text-surface border-[3px] border-main font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3">AÑADIR EXAMEN <Plus size={20} /></button>
                    ) : (
                      <div className="bg-main/5 border-2 border-main p-4 space-y-3">
                        <input autoFocus type="text" value={newGradeName} onChange={e => setNewGradeName(e.target.value)} placeholder="NOMBRE EXAMEN" className="w-full bg-surface border-2 border-main p-3 text-[10px] font-black uppercase outline-none" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="number" step="0.1" value={newGradeScore} onChange={e => setNewGradeScore(e.target.value)} placeholder="NOTA" className="w-full bg-surface border-2 border-main p-3 text-[10px] font-black" />
                          <select value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)} className="w-full bg-surface border-2 border-main p-3 text-[10px] font-black uppercase">
                            <option value="">CATEGORÍA</option>
                            {selectedSubject?.weightCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name} ({cat.weight}%)</option>)}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {
                            const score = parseFloat(newGradeScore);
                            if (!newGradeName || isNaN(score) || !selectedCategoryId) return;
                            handleUpdateSubject({...selectedSubject, grades: [...selectedSubject.grades, { id: crypto.randomUUID(), name: newGradeName.toUpperCase(), score, categoryId: selectedCategoryId, date: new Date().toISOString() }]});
                            setIsAddingGrade(false); setNewGradeName(''); setNewGradeScore(''); setSelectedCategoryId('');
                          }} className="flex-1 bg-primary text-white py-3 text-[10px] font-black uppercase">GUARDAR</button>
                          <button onClick={() => setIsAddingGrade(false)} className="bg-surface border-2 border-main px-6 text-[10px] font-black uppercase">X</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
