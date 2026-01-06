import { useState, useMemo, useEffect } from 'react';
import { SearchEngine } from './utils/searchLogic'; // Import the logic class

export default function App() {
  const [query, setQuery] = useState('');
  const [nLimit, setNLimit] = useState(2);
  const [inputValue, setInputValue] = useState('');
  const [dataset, setDataset] = useState<string[]>(["gros", "gras", "graisse", "agressif", "go", "ros", "gro"]);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleAddTerm = () => {
    const rawValue = inputValue.trim();
    if (!rawValue) return;

    // Using externalized logic
    if (SearchEngine.containsNonAlphanumeric(rawValue)) {
      setAlert(`Note: "${rawValue}" contains non-alphanumeric characters. It was sanitized.`);
    }

    const cleanTerm = SearchEngine.sanitize(rawValue);
    
    if (cleanTerm) {
      if (!dataset.includes(cleanTerm)) {
        setDataset(prev => [...prev, cleanTerm]);
        setInputValue('');
      } else {
        setAlert("This term already exists in the list.");
      }
    } else {
      setAlert("Error: The term is invalid (no alphanumeric characters found).");
    }
  };

  const results = useMemo(() => 
    SearchEngine.getDetailedSuggestions(query, dataset, nLimit), 
    [query, dataset, nLimit]
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#fd4301]/20">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#fd4301] rounded-2xl flex items-center justify-center shadow-lg shadow-[#fd4301]/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                <path d="M8.25 10.875a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z" />
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.565 10.565 8.25 8.25 0 00-10.565-10.565z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">LexiMatch</h1>
              <p className="text-[12px] font-bold text-[#fd4301] uppercase tracking-[0.4em] mt-2">Similarity Engine</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <img 
              src="https://cdn-images.welcometothejungle.com/jMB1l0UNhF284fbO-Y_lXjhyR3_D43q_pH2NZVg7s0E/rs:auto:400::/q:85/czM6Ly93dHRqLXByb2R1Y3Rpb24vdXBsb2Fkcy9vcmdhbml6YXRpb24vbG9nby82NDg1LzE1ODQ2MS9iMmZlNDlhNy05NDRmLTRkODYtYjJjMS0xMDRmYTFjZmJmY2QucG5n" 
              alt="Company Logo" 
              className="h-24 w-auto object-contain"
            />
          </div>
        </div>
      </header>

      {alert && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white border-b-4 border-amber-500 shadow-2xl p-4 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="text-2xl">⚠️</span>
          <p className="text-sm font-semibold text-slate-700">{alert}</p>
          <button onClick={() => setAlert(null)} className="ml-4 text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      <div className="p-4 md:p-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-[#fd4301] text-white w-7 h-7 rounded-lg flex items-center justify-center text-sm">1</span>
                Dataset Management
              </h2>
              
              <div className="flex gap-3 mb-2">
                <input
                  type="text"
                  className={`flex-1 p-3 border-2 rounded-xl outline-none transition-all ${SearchEngine.containsNonAlphanumeric(inputValue) ? 'border-amber-200 bg-amber-50' : 'border-slate-100 focus:border-[#fd4301]'}`}
                  placeholder="Add term (e.g. Café!)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTerm()}
                />
                <button 
                  onClick={handleAddTerm}
                  className="bg-[#fd4301] hover:brightness-110 text-white px-6 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-orange-100"
                >
                  +
                </button>
              </div>
              {SearchEngine.containsNonAlphanumeric(inputValue) && (
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tighter mb-4 animate-pulse">
                  Non-alphanumeric detected: will be cleaned
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-6">
                {dataset.map((term, index) => (
                  <div key={index} className="flex items-center gap-2 bg-slate-100 pl-3 pr-2 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                    <span className="text-sm font-mono text-slate-600 lowercase tracking-tighter">{term}</span>
                    <button onClick={() => setDataset(dataset.filter(t => t !== term))} className="text-slate-300 hover:text-red-500 p-0.5">✕</button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Algorithm Config</h2>
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-bold text-slate-700">Max Suggestions (N)</label>
                  <span className="text-3xl font-black text-[#fd4301] leading-none">{nLimit}</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  value={nLimit} 
                  onChange={(e) => setNLimit(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#fd4301]"
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-7 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
            <header className="mb-10">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Similarity Search</h1>
              <p className="text-slate-400 mt-1">Based on character replacement cost.</p>
            </header>
            
            <div className="relative mb-10">
              <input
                type="text"
                className="w-full p-6 pl-14 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#fd4301] focus:ring-8 focus:ring-orange-500/5 outline-none transition-all text-xl font-medium"
                placeholder="Start typing a term..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl grayscale">🔎</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calculated Results</h3>
                <div className="h-px flex-1 mx-4 bg-slate-100"></div>
              </div>

              {results.length > 0 ? (
                results.map((res, i) => (
                  <div key={i} className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-orange-200 hover:shadow-md transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm group-hover:bg-[#fd4301] transition-colors">
                        {i + 1}
                      </div>
                      <div>
                        <span className="text-xl font-bold text-slate-800 uppercase tracking-tight leading-none">{res.term}</span>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Similarity Match</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-black px-4 py-2 rounded-xl inline-block ${res.score === 0 ? 'bg-green-100 text-green-600' : 'bg-orange-50 text-[#fd4301]'}`}>
                        {res.score} {res.score === 1 ? 'DIFFÉRENCE' : 'DIFFÉRENCES'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">
                    {query ? "No suggestions found for this term." : "Begin typing above to see results."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}