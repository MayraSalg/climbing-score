
// src/App.jsx (полностью обновлённый с поддержкой 8 трасс)
//
// import React, { useState, useEffect, useMemo } from 'react';
// import * as XLSX from 'xlsx';
// import { PARTICIPANTS as initialParticipants } from "./assets/participants.js"; // Убедитесь, что путь правильный
// import ResultForm from './components/ResultForm';
// import ParticipantTable from './components/ParticipantTable';
// import Leaderboard from './components/Leaderboard';
//
// function App() {
//     const [participants, setParticipants] = useState([]);
//     const [results, setResults] = useState({});
//     const [currentSet, setCurrentSet] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//
//     // Helper для суммирования по трассам
//     const getTotals = (res) => {
//         if (!res || !res.routes) return { tops: 0, zone1: 0, zone2: 0, attempts_top: 0, attempts_zone1: 0, attempts_zone2: 0 };
//         return res.routes.reduce((acc, route) => ({
//             tops: acc.tops + (route.top || 0),
//             zone1: acc.zone1 + (route.zone1 || 0),
//             zone2: acc.zone2 + (route.zone2 || 0),
//             attempts_top: acc.attempts_top + (route.attempts_top || 0),
//             attempts_zone1: acc.attempts_zone1 + (route.attempts_zone1 || 0),
//             attempts_zone2: acc.attempts_zone2 + (route.attempts_zone2 || 0),
//         }), { tops: 0, zone1: 0, zone2: 0, attempts_top: 0, attempts_zone1: 0, attempts_zone2: 0 });
//     };
//
//     // Загрузка с улучшенной обработкой localStorage и миграцией старых данных
//     useEffect(() => {
//         const savedParticipants = localStorage.getItem('participants');
//         const savedResults = localStorage.getItem('results');
//
//         let loadedParticipants = initialParticipants; // Всегда fallback на initial
//
//         if (savedParticipants) {
//             try {
//                 const parsed = JSON.parse(savedParticipants);
//                 if (Array.isArray(parsed) && parsed.length > 0) {
//                     loadedParticipants = parsed;
//                 } else {
//                     console.warn('Saved participants empty or invalid, using initial.');
//                 }
//             } catch (e) {
//                 console.error('Error parsing saved participants:', e);
//             }
//         }
//
//         // Сохраняем initial, если ничего не было или invalid
//         if (!savedParticipants || loadedParticipants === initialParticipants) {
//             localStorage.setItem('participants', JSON.stringify(initialParticipants));
//         }
//
//         // Добавляем gender, если отсутствует
//         loadedParticipants = loadedParticipants.map(p => {
//             if (!p.gender) {
//                 // Улучшенный хак: проверяем типичные женские окончания/имена
//                 const name = p.first_name.toLowerCase();
//                 p.gender = (name.endsWith('а') || name.endsWith('я') || name.includes('мария') || name.includes('анастасия') || name.includes('александра') || name.includes('вероника') || name.includes('василиса')) ? 'female' : 'male';
//             }
//             return p;
//         });
//
//         setParticipants(loadedParticipants);
//
//         const sets = [...new Set(loadedParticipants.map(p => p.set))].filter(Boolean); // Фильтр на пустые
//         setCurrentSet(sets[0] || ''); // Устанавливаем первый сет
//
//         if (savedResults) {
//             try {
//                 let parsedResults = JSON.parse(savedResults);
//                 // Миграция старых данных: Если нет routes, поместим старые аггрегаты в route[0]
//                 Object.keys(parsedResults).forEach(id => {
//                     const res = parsedResults[id];
//                     if (!res.routes) {
//                         parsedResults[id] = {
//                             routes: Array(8).fill({}).map((_, i) => i === 0 ? {
//                                 top: res.tops || 0,
//                                 zone1: res.zone1 || 0,
//                                 zone2: res.zone2 || 0,
//                                 attempts_top: res.attempts_top || 0,
//                                 attempts_zone1: res.attempts_zone1 || 0,
//                                 attempts_zone2: res.attempts_zone2 || 0,
//                             } : {})
//                         };
//                     }
//                 });
//                 setResults(parsedResults);
//             } catch (e) {
//                 console.error('Error parsing saved results:', e);
//             }
//         }
//     }, []);
//
//     // Сохранение результатов
//     useEffect(() => {
//         localStorage.setItem('results', JSON.stringify(results));
//     }, [results]);
//
//     const uniqueSets = useMemo(() => [...new Set(participants.map(p => p.set))].filter(Boolean), [participants]);
//
//     const currentParticipants = useMemo(() => {
//         return participants.filter(p => p.set === currentSet);
//     }, [participants, currentSet]);
//
//     const handleResultSubmit = (id, routeIndex, newRouteData) => {
//         setResults(prev => {
//             const participantRes = prev[id] || { routes: Array(8).fill({}) };
//             const updatedRoutes = [...participantRes.routes];
//             updatedRoutes[routeIndex] = { ...updatedRoutes[routeIndex], ...newRouteData };
//             return { ...prev, [id]: { routes: updatedRoutes } };
//         });
//     };
//
//     const exportToExcel = () => {
//         const data = participants.map(p => {
//             const r = results[p.id] || { routes: [] };
//             const totals = getTotals(r);
//             return {
//                 ID: p.id,
//                 ФИО: `${p.first_name} ${p.last_name}`.trim(),
//                 Группа: p.group,
//                 Команда: p.team,
//                 Сет: p.set,
//                 Пол: p.gender === 'male' ? 'М' : 'Ж',
//                 TotalTops: totals.tops,
//                 TotalZone1: totals.zone1,
//                 TotalZone2: totals.zone2,
//                 TotalAttemptsTop: totals.attempts_top,
//                 TotalAttemptsZone1: totals.attempts_zone1,
//                 TotalAttemptsZone2: totals.attempts_zone2,
//                 TotalZones: totals.zone1 + totals.zone2,
//                 TotalAttemptsZones: totals.attempts_zone1 + totals.attempts_zone2,
//             };
//         });
//
//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Результаты');
//         XLSX.writeFile(wb, 'climbing_results.xlsx');
//     };
//
//     // Кнопка для сброса localStorage (для дебага)
//     const resetLocalStorage = () => {
//         localStorage.clear();
//         window.location.reload();
//     };
//
//     return (
//         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//             <h1>Скалолазание — Подсчёт результатов</h1>
//             <button onClick={exportToExcel} style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}>
//                 Экспорт в Excel (все сеты)
//             </button>
//             <button onClick={resetLocalStorage} style={{ padding: '10px 20px', fontSize: '16px', background: '#f44336', color: 'white' }}>
//                 Сброс localStorage (если проблемы)
//             </button>
//
//             {/* Табы по сетам */}
//             <div style={{ margin: '20px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
//                 {uniqueSets.length > 0 ? (
//                     uniqueSets.map(set => (
//                         <button
//                             key={set}
//                             onClick={() => setCurrentSet(set)}
//                             style={{
//                                 padding: '10px 16px',
//                                 background: currentSet === set ? '#1976d2' : '#e0e0e0',
//                                 color: currentSet === set ? 'white' : 'black',
//                                 border: 'none',
//                                 borderRadius: '6px',
//                                 cursor: 'pointer',
//                                 fontWeight: currentSet === set ? 'bold' : 'normal',
//                             }}
//                         >
//                             {set}
//                         </button>
//                     ))
//                 ) : (
//                     <p>Нет доступных сетов. Проверьте данные участников или сбросьте localStorage.</p>
//                 )}
//             </div>
//
//             {/* Форма ввода */}
//             {currentSet && currentParticipants.length > 0 && (
//                 <ResultForm
//                     participants={currentParticipants}
//                     searchTerm={searchTerm}
//                     setSearchTerm={setSearchTerm}
//                     onSubmit={handleResultSubmit}
//                 />
//             )}
//
//             {currentSet && currentParticipants.length > 0 ? (
//                 <>
//                     <ParticipantTable
//                         participants={currentParticipants}
//                         results={results}
//                         currentSet={currentSet}
//                         getTotals={getTotals}
//                     />
//                     <Leaderboard
//                         participants={currentParticipants}
//                         results={results}
//                         getTotals={getTotals}
//                     />
//                 </>
//             ) : (
//                 <p>Выберите сет или добавьте участников. Если проблема persists, используйте кнопку сброса.</p>
//             )}
//         </div>
//     );
// }
//
// export default App;
// src/App.jsx (обновлённый с поддержкой фильтра по group)

// import React, { useState, useEffect, useMemo } from 'react';
// import * as XLSX from 'xlsx';
// import { PARTICIPANTS as initialParticipants } from "./assets/participants.js"; // Убедитесь, что путь правильный
// import ResultForm from './components/ResultForm';
// import ParticipantTable from './components/ParticipantTable';
// import Leaderboard from './components/Leaderboard';
//
// function App() {
//     const [participants, setParticipants] = useState([]);
//     const [results, setResults] = useState({});
//     const [currentSet, setCurrentSet] = useState('');
//     const [currentGroup, setCurrentGroup] = useState('all'); // Новый state для фильтра по group: 'all', 'Общий зачет', 'Спортсмены'
//     const [searchTerm, setSearchTerm] = useState('');
//
//     // Helper для суммирования по трассам
//     const getTotals = (res) => {
//         if (!res || !res.routes) return { tops: 0, zone1: 0, zone2: 0, attempts_top: 0, attempts_zone1: 0, attempts_zone2: 0 };
//         return res.routes.reduce((acc, route) => ({
//             tops: acc.tops + (route.top || 0),
//             zone1: acc.zone1 + (route.zone1 || 0),
//             zone2: acc.zone2 + (route.zone2 || 0),
//             attempts_top: acc.attempts_top + (route.attempts_top || 0),
//             attempts_zone1: acc.attempts_zone1 + (route.attempts_zone1 || 0),
//             attempts_zone2: acc.attempts_zone2 + (route.attempts_zone2 || 0),
//         }), { tops: 0, zone1: 0, zone2: 0, attempts_top: 0, attempts_zone1: 0, attempts_zone2: 0 });
//     };
//
//     // Загрузка с улучшенной обработкой localStorage и миграцией старых данных
//     useEffect(() => {
//         const savedParticipants = localStorage.getItem('participants');
//         const savedResults = localStorage.getItem('results');
//
//         let loadedParticipants = initialParticipants; // Всегда fallback на initial
//
//         if (savedParticipants) {
//             try {
//                 const parsed = JSON.parse(savedParticipants);
//                 if (Array.isArray(parsed) && parsed.length > 0) {
//                     loadedParticipants = parsed;
//                 } else {
//                     console.warn('Saved participants empty or invalid, using initial.');
//                 }
//             } catch (e) {
//                 console.error('Error parsing saved participants:', e);
//             }
//         }
//
//         // Сохраняем initial, если ничего не было или invalid
//         if (!savedParticipants || loadedParticipants === initialParticipants) {
//             localStorage.setItem('participants', JSON.stringify(initialParticipants));
//         }
//
//         // Добавляем gender, если отсутствует
//         loadedParticipants = loadedParticipants.map(p => {
//             if (!p.gender) {
//                 // Улучшенный хак: проверяем типичные женские окончания/имена
//                 const name = p.first_name.toLowerCase();
//                 p.gender = (name.endsWith('а') || name.endsWith('я') || name.includes('мария') || name.includes('анастасия') || name.includes('александра') || name.includes('вероника') || name.includes('василиса')) ? 'female' : 'male';
//             }
//             return p;
//         });
//
//         setParticipants(loadedParticipants);
//
//         const sets = [...new Set(loadedParticipants.map(p => p.set))].filter(Boolean); // Фильтр на пустые
//         setCurrentSet(sets[0] || ''); // Устанавливаем первый сет
//
//         if (savedResults) {
//             try {
//                 let parsedResults = JSON.parse(savedResults);
//                 // Миграция старых данных: Если нет routes, поместим старые аггрегаты в route[0]
//                 Object.keys(parsedResults).forEach(id => {
//                     const res = parsedResults[id];
//                     if (!res.routes) {
//                         parsedResults[id] = {
//                             routes: Array(8).fill({}).map((_, i) => i === 0 ? {
//                                 top: res.tops || 0,
//                                 zone1: res.zone1 || 0,
//                                 zone2: res.zone2 || 0,
//                                 attempts_top: res.attempts_top || 0,
//                                 attempts_zone1: res.attempts_zone1 || 0,
//                                 attempts_zone2: res.attempts_zone2 || 0,
//                             } : {})
//                         };
//                     }
//                 });
//                 setResults(parsedResults);
//             } catch (e) {
//                 console.error('Error parsing saved results:', e);
//             }
//         }
//     }, []);
//
//     // Сохранение результатов
//     useEffect(() => {
//         localStorage.setItem('results', JSON.stringify(results));
//     }, [results]);
//
//     const uniqueSets = useMemo(() => [...new Set(participants.map(p => p.set))].filter(Boolean), [participants]);
//
//     const currentParticipants = useMemo(() => {
//         let filtered = participants.filter(p => p.set === currentSet);
//         if (currentGroup !== 'all') {
//             filtered = filtered.filter(p => p.group === currentGroup);
//         }
//         return filtered;
//     }, [participants, currentSet, currentGroup]);
//
//     const handleResultSubmit = (id, routeIndex, newRouteData) => {
//         setResults(prev => {
//             const participantRes = prev[id] || { routes: Array(8).fill({}) };
//             const updatedRoutes = [...participantRes.routes];
//             updatedRoutes[routeIndex] = { ...updatedRoutes[routeIndex], ...newRouteData };
//             return { ...prev, [id]: { routes: updatedRoutes } };
//         });
//     };
//
//     const exportToExcel = () => {
//         const data = participants.map(p => {
//             const r = results[p.id] || { routes: [] };
//             const totals = getTotals(r);
//             return {
//                 ID: p.id,
//                 ФИО: `${p.first_name} ${p.last_name}`.trim(),
//                 Группа: p.group,
//                 Команда: p.team,
//                 Сет: p.set,
//                 Пол: p.gender === 'male' ? 'М' : 'Ж',
//                 TotalTops: totals.tops,
//                 TotalZone1: totals.zone1,
//                 TotalZone2: totals.zone2,
//                 TotalAttemptsTop: totals.attempts_top,
//                 TotalAttemptsZone1: totals.attempts_zone1,
//                 TotalAttemptsZone2: totals.attempts_zone2,
//                 TotalZones: totals.zone1 + totals.zone2,
//                 TotalAttemptsZones: totals.attempts_zone1 + totals.attempts_zone2,
//             };
//         });
//
//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Результаты');
//         XLSX.writeFile(wb, 'climbing_results.xlsx');
//     };
//
//     // Кнопка для сброса localStorage (для дебага)
//     const resetLocalStorage = () => {
//         localStorage.clear();
//         window.location.reload();
//     };
//
//     return (
//         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//             <h1>Скалолазание — Подсчёт результатов</h1>
//             <button onClick={exportToExcel} style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}>
//                 Экспорт в Excel (все сеты)
//             </button>
//             <button onClick={resetLocalStorage} style={{ padding: '10px 20px', fontSize: '16px', background: '#f44336', color: 'white' }}>
//                 Сброс localStorage (если проблемы)
//             </button>
//
//             {/* Табы по сетам */}
//             <div style={{ margin: '20px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
//                 {uniqueSets.length > 0 ? (
//                     uniqueSets.map(set => (
//                         <button
//                             key={set}
//                             onClick={() => setCurrentSet(set)}
//                             style={{
//                                 padding: '10px 16px',
//                                 background: currentSet === set ? '#1976d2' : '#e0e0e0',
//                                 color: currentSet === set ? 'white' : 'black',
//                                 border: 'none',
//                                 borderRadius: '6px',
//                                 cursor: 'pointer',
//                                 fontWeight: currentSet === set ? 'bold' : 'normal',
//                             }}
//                         >
//                             {set}
//                         </button>
//                     ))
//                 ) : (
//                     <p>Нет доступных сетов. Проверьте данные участников или сбросьте localStorage.</p>
//                 )}
//             </div>
//
//             {/* Фильтр по group */}
//             {currentSet && (
//                 <div style={{ marginBottom: '20px' }}>
//                     <label>Фильтр по группе: </label>
//                     <select value={currentGroup} onChange={e => setCurrentGroup(e.target.value)}>
//                         <option value="all">Все группы</option>
//                         <option value="Общий зачет">Общий зачет</option>
//                         <option value="Спортсмены">Спортсмены</option>
//                     </select>
//                 </div>
//             )}
//
//             {/* Форма ввода */}
//             {currentSet && currentParticipants.length > 0 && (
//                 <ResultForm
//                     participants={currentParticipants}
//                     searchTerm={searchTerm}
//                     setSearchTerm={setSearchTerm}
//                     onSubmit={handleResultSubmit}
//                 />
//             )}
//
//             {currentSet && currentParticipants.length > 0 ? (
//                 <>
//                     <ParticipantTable
//                         participants={currentParticipants}
//                         results={results}
//                         currentSet={currentSet}
//                         getTotals={getTotals}
//                     />
//                     <Leaderboard
//                         participants={participants.filter(p => p.set === currentSet)} // Передаём всех по сету, чтобы Leaderboard разделил по group внутри
//                         results={results}
//                         getTotals={getTotals}
//                     />
//                 </>
//             ) : (
//                 <p>Выберите сет или добавьте участников. Если проблема persists, используйте кнопку сброса.</p>
//             )}
//         </div>
//     );
// }
//
// export default App;

// import React, { useState, useEffect, useMemo } from 'react';
// import { PARTICIPANTS as initialParticipants } from "./assets/participants.js";
// import ResultForm from './components/ResultForm';
// import ParticipantTable from './components/ParticipantTable';
// import Leaderboard from './components/Leaderboard';
// import * as XLSX from 'xlsx';
// import ParticipantResultsEditor from "./components/ParticipantResultsEditor";
//
// function App() {
//     const [participants, setParticipants] = useState([]);
//     const [results, setResults] = useState({});
//     const [currentSet, setCurrentSet] = useState('');
//     const [currentGroup, setCurrentGroup] = useState('all');
//     const [searchTerm, setSearchTerm] = useState('');
//
//     // Вспомогательная функция для суммирования показателей по трассам
//     const getTotals = (res) => {
//         if (!res || !res.routes) return {
//             tops: 0, zone1: 0, zone2: 0,
//             attempts_top: 0, attempts_zone1: 0, attempts_zone2: 0
//         };
//         return res.routes.reduce((acc, route) => ({
//             tops: acc.tops + (route.top || 0),
//             zone1: acc.zone1 + (route.zone1 || 0),
//             zone2: acc.zone2 + (route.zone2 || 0),
//             attempts_top: acc.attempts_top + (route.attempts_top || 0),
//             attempts_zone1: acc.attempts_zone1 + (route.attempts_zone1 || 0),
//             attempts_zone2: acc.attempts_zone2 + (route.attempts_zone2 || 0),
//         }), { tops: 0, zone1: 0, zone2: 0, attempts_top: 0, attempts_zone1: 0, attempts_zone2: 0 });
//     };
//
//     // Загрузка данных из localStorage
//     useEffect(() => {
//         const savedParticipants = localStorage.getItem('participants');
//         const savedResults = localStorage.getItem('results');
//
//         let loadedParticipants = initialParticipants;
//
//         if (savedParticipants) {
//             try {
//                 const parsed = JSON.parse(savedParticipants);
//                 if (Array.isArray(parsed) && parsed.length > 0) {
//                     loadedParticipants = parsed;
//                 }
//             } catch (e) {
//                 console.error('Error parsing saved participants:', e);
//             }
//         }
//
//         // Добавляем поле gender, если отсутствует
//         loadedParticipants = loadedParticipants.map(p => {
//             if (!p.gender) {
//                 const name = p.first_name.toLowerCase();
//                 p.gender = (name.endsWith('а') || name.endsWith('я') || name.includes('мария') || name.includes('анастасия') || name.includes('александра') || name.includes('вероника') || name.includes('василиса')) ? 'female' : 'male';
//             }
//             return p;
//         });
//
//         setParticipants(loadedParticipants);
//
//         const sets = [...new Set(loadedParticipants.map(p => p.set))].filter(Boolean);
//         setCurrentSet(sets[0] || '');
//
//         if (savedResults) {
//             try {
//                 let parsedResults = JSON.parse(savedResults);
//                 // Миграция старых данных (если нет routes)
//                 Object.keys(parsedResults).forEach(id => {
//                     const res = parsedResults[id];
//                     if (!res.routes) {
//                         parsedResults[id] = {
//                             routes: Array(8).fill({}).map((_, i) => i === 0 ? {
//                                 top: res.tops || 0,
//                                 zone1: res.zone1 || 0,
//                                 zone2: res.zone2 || 0,
//                                 attempts_top: res.attempts_top || 0,
//                                 attempts_zone1: res.attempts_zone1 || 0,
//                                 attempts_zone2: res.attempts_zone2 || 0,
//                             } : {})
//                         };
//                     }
//                 });
//                 setResults(parsedResults);
//             } catch (e) {
//                 console.error('Error parsing saved results:', e);
//             }
//         }
//     }, []);
//
//     // Сохранение результатов в localStorage
//     useEffect(() => {
//         localStorage.setItem('results', JSON.stringify(results));
//     }, [results]);
//
//     const uniqueSets = useMemo(() => [...new Set(participants.map(p => p.set))].filter(Boolean), [participants]);
//
//     const currentParticipants = useMemo(() => {
//         let filtered = participants.filter(p => p.set === currentSet);
//         if (currentGroup !== 'all') {
//             filtered = filtered.filter(p => p.group === currentGroup);
//         }
//         return filtered;
//     }, [participants, currentSet, currentGroup]);
//
//     const handleResultSubmit = (id, routeIndex, newRouteData) => {
//         setResults(prev => {
//             const participantRes = prev[id] || { routes: Array(8).fill({}) };
//             const updatedRoutes = [...participantRes.routes];
//             updatedRoutes[routeIndex] = { ...updatedRoutes[routeIndex], ...newRouteData };
//             return { ...prev, [id]: { routes: updatedRoutes } };
//         });
//     };
//
//     const exportToExcel = () => {
//         const data = participants.map(p => {
//             const r = results[p.id] || { routes: [] };
//             const totals = getTotals(r);
//             return {
//                 ID: p.id,
//                 ФИО: `${p.first_name} ${p.last_name}`.trim(),
//                 Группа: p.group,
//                 Команда: p.team,
//                 Сет: p.set,
//                 Пол: p.gender === 'male' ? 'М' : 'Ж',
//                 Топы: totals.tops,
//                 Zone2: totals.zone2,
//                 Zone1: totals.zone1,
//                 Попытки_топ: totals.attempts_top,
//                 Попытки_zone2: totals.attempts_zone2,
//                 Попытки_zone1: totals.attempts_zone1,
//             };
//         });
//
//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Результаты');
//         XLSX.writeFile(wb, 'climbing_results.xlsx');
//     };
//
//     const resetLocalStorage = () => {
//         localStorage.clear();
//         window.location.reload();
//     };
//
//     return (
//         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//             <h1>Скалолазание — Подсчёт результатов</h1>
//             <button onClick={exportToExcel} style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}>
//                 Экспорт в Excel (все сеты)
//             </button>
//             <button onClick={resetLocalStorage} style={{ padding: '10px 20px', fontSize: '16px', background: '#f44336', color: 'white' }}>
//                 Сброс localStorage (если проблемы)
//             </button>
//
//             {/* Табы по сетам */}
//             <div style={{ margin: '20px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
//                 {uniqueSets.length > 0 ? (
//                     uniqueSets.map(set => (
//                         <button
//                             key={set}
//                             onClick={() => setCurrentSet(set)}
//                             style={{
//                                 padding: '10px 16px',
//                                 background: currentSet === set ? '#1976d2' : '#e0e0e0',
//                                 color: currentSet === set ? 'white' : 'black',
//                                 border: 'none',
//                                 borderRadius: '6px',
//                                 cursor: 'pointer',
//                                 fontWeight: currentSet === set ? 'bold' : 'normal',
//                             }}
//                         >
//                             {set}
//                         </button>
//                     ))
//                 ) : (
//                     <p>Нет доступных сетов. Проверьте данные участников или сбросьте localStorage.</p>
//                 )}
//             </div>
//
//             {/* Фильтр по group */}
//             {currentSet && (
//                 <div style={{ marginBottom: '20px' }}>
//                     <label>Фильтр по группе: </label>
//                     <select value={currentGroup} onChange={e => setCurrentGroup(e.target.value)}>
//                         <option value="all">Все группы</option>
//                         {[...new Set(participants.map(p => p.group))].filter(Boolean).map(group => (
//                             <option key={group} value={group}>{group}</option>
//                         ))}
//                     </select>
//                 </div>
//             )}
//
//             {/* Форма ввода */}
//             {currentSet && currentParticipants.length > 0 && (
//                 <ParticipantResultsEditor
//                     participants={currentParticipants}
//                     results={results}
//                     searchTerm={searchTerm}
//                     setSearchTerm={setSearchTerm}
//                     onSubmit={handleResultSubmit}
//                 />
//             )}
//
//             {currentSet && currentParticipants.length > 0 ? (
//                 <>
//                     <ParticipantTable
//                         participants={currentParticipants}
//                         results={results}
//                         currentSet={currentSet}
//                         getTotals={getTotals}
//                     />
//                     <Leaderboard
//                         participants={participants.filter(p => p.set === currentSet)}
//                         results={results}
//                         getTotals={getTotals}
//                     />
//                 </>
//             ) : (
//                 <p>Выберите сет или добавьте участников. Если проблема persists, используйте кнопку сброса.</p>
//             )}
//         </div>
//     );
// }
//
// export default App;
import React, { useState, useEffect, useMemo } from 'react';
import { PARTICIPANTS as initialParticipants } from "./assets/participants.js";
import ParticipantTable from './components/ParticipantTable';
import Leaderboard from './components/Leaderboard';
import * as XLSX from 'xlsx';
import ParticipantResultsEditor from "./components/ParticipantResultsEditor";
import { getTotals, determineGender, migrateOldData } from './utils/compareParticipants.js';

function App() {
    const [participants, setParticipants] = useState([]);
    const [results, setResults] = useState({});
    const [currentSet, setCurrentSet] = useState('');
    const [currentGroup, setCurrentGroup] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Загрузка данных из localStorage
    useEffect(() => {
        const savedParticipants = localStorage.getItem('participants');
        const savedResults = localStorage.getItem('results');

        let loadedParticipants = initialParticipants;

        if (savedParticipants) {
            try {
                const parsed = JSON.parse(savedParticipants);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    loadedParticipants = parsed;
                }
            } catch (e) {
                console.error('Error parsing saved participants:', e);
            }
        }

        loadedParticipants = loadedParticipants.map(p => {
            if (!p.gender) {
                p.gender = determineGender(p.first_name);
            }
            return p;
        });

        setParticipants(loadedParticipants);

        const sets = [...new Set(loadedParticipants.map(p => p.set))].filter(Boolean);
        setCurrentSet(sets[0] || '');

        if (savedResults) {
            try {
                let parsedResults = JSON.parse(savedResults);

                // ✅ Миграция старых данных
                const needsMigration = Object.values(parsedResults).some(participantData =>
                        participantData.routes && participantData.routes.some(route =>
                            route && (route.attempts_top !== undefined || route.attempts_zone1 !== undefined)
                        )
                );

                if (needsMigration) {
                    console.log('🔄 Миграция данных из старого формата в новый...');
                    parsedResults = migrateOldData(parsedResults);
                }

                // ✅ ИСПРАВЛЕНИЕ: убеждаемся, что все ключи - строки
                // localStorage всегда хранит ключи как строки
                const normalizedResults = {};
                Object.keys(parsedResults).forEach(key => {
                    const stringKey = String(key);
                    normalizedResults[stringKey] = parsedResults[key];
                });

                setResults(normalizedResults);
                console.log('✅ Результаты загружены:', Object.keys(normalizedResults).length, 'участников');
            } catch (e) {
                console.error('Error parsing saved results:', e);
            }
        }

        setIsLoading(false);
    }, []);

    // ✅ ИСПРАВЛЕНИЕ: сохранение в localStorage
    useEffect(() => {
        if (Object.keys(results).length > 0) {
            localStorage.setItem('results', JSON.stringify(results));
            console.log('💾 Данные сохранены в localStorage');
        }
    }, [results]);

    const uniqueSets = useMemo(() => [...new Set(participants.map(p => p.set))].filter(Boolean), [participants]);

    const currentParticipants = useMemo(() => {
        let filtered = participants.filter(p => p.set === currentSet);
        if (currentGroup !== 'all') {
            filtered = filtered.filter(p => p.group === currentGroup);
        }
        return filtered;
    }, [participants, currentSet, currentGroup]);

    const handleSetChange = (newSet) => {
        setCurrentSet(newSet);
        setCurrentGroup('all');
    };

    // ✅ ИСПРАВЛЕНИЕ: handleResultSubmit работает с ID как со СТРОКОЙ
    const handleResultSubmit = (id, routeIndex, newRouteData) => {
        // ✅ ID приходит как строка из select, оставляем как строка
        const stringId = String(id);

        setResults(prev => {
            const participantRes = prev[stringId] || { routes: Array(8).fill({}) };
            const updatedRoutes = [...participantRes.routes];
            updatedRoutes[routeIndex] = { ...updatedRoutes[routeIndex], ...newRouteData };

            return {
                ...prev,
                [stringId]: { routes: updatedRoutes }
            };
        });
    };

    const exportToExcel = () => {
        const data = participants.map(p => {
            const stringId = String(p.id);
            const r = results[stringId] || { routes: [] };
            const totals = getTotals(r);
            return {
                ID: p.id,
                ФИО: `${p.first_name} ${p.last_name}`.trim(),
                Группа: p.group,
                Команда: p.team,
                Сет: p.set,
                Пол: p.gender === 'male' ? 'М' : 'Ж',
                'Топы (всего)': totals.tops,
                'Zone2 (всего)': totals.zone2,
                'Zone1 (всего)': totals.zone1,
                'Попытки Top': totals.attempts_top,
                'Попытки Zone2': totals.attempts_zone2,
                'Попытки Zone1': totals.attempts_zone1,
            };
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Результаты');
        XLSX.writeFile(wb, 'climbing_results.xlsx');
    };

    const resetLocalStorage = () => {
        if (window.confirm('Вы уверены? Все данные будут удалены!')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    if (isLoading) {
        return <div style={{ padding: '20px', textAlign: 'center', fontSize: '16px' }}>Загрузка данных...</div>;
    }

    if (participants.length === 0) {
        return (
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <h1>Скалолазание — Подсчёт результатов</h1>
                <p style={{ color: 'red' }}>Ошибка: Нет данных участников. Проверьте PARTICIPANTS в assets/participants.js</p>
                <button onClick={resetLocalStorage} style={{ padding: '10px 20px', fontSize: '16px', background: '#f44336', color: 'white' }}>
                    Сброс localStorage
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Скалолазание — Подсчёт результатов</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>
                Новая система: zone1, zone2, top (максимум 6 попыток за трассу)
                <br/>
                ✅ Данные автоматически сохраняются в localStorage
            </p>

            <div style={{ marginBottom: '15px' }}>
                <button onClick={exportToExcel} style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    📊 Экспорт в Excel (все сеты)
                </button>
                <button onClick={resetLocalStorage} style={{ padding: '10px 20px', fontSize: '16px', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    🔄 Сброс localStorage
                </button>
            </div>

            {/* Табы по сетам */}
            <div style={{ margin: '20px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {uniqueSets.length > 0 ? (
                    uniqueSets.map(set => (
                        <button
                            key={set}
                            onClick={() => handleSetChange(set)}
                            style={{
                                padding: '10px 16px',
                                background: currentSet === set ? '#1976d2' : '#e0e0e0',
                                color: currentSet === set ? 'white' : 'black',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: currentSet === set ? 'bold' : 'normal',
                            }}
                        >
                            {set}
                        </button>
                    ))
                ) : (
                    <p>Нет доступных сетов. Проверьте данные участников или сбросьте localStorage.</p>
                )}
            </div>

            {/* Фильтр по группе */}
            {currentSet && (
                <div style={{ marginBottom: '20px' }}>
                    <label>Фильтр по группе: </label>
                    <select value={currentGroup} onChange={e => setCurrentGroup(e.target.value)}>
                        <option value="all">Все группы</option>
                        {[...new Set(participants.filter(p => p.set === currentSet).map(p => p.group))].filter(Boolean).map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Форма ввода результатов */}
            {currentSet && (
                <ParticipantResultsEditor
                    allParticipants={participants}
                    currentSetParticipants={currentParticipants}
                    results={results}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSubmit={handleResultSubmit}
                />
            )}

            {/* Таблица и рейтинг */}
            {currentSet && currentParticipants.length > 0 ? (
                <>
                    <ParticipantTable
                        participants={currentParticipants}
                        results={results}
                        currentSet={currentSet}
                        getTotals={getTotals}
                    />
                    <Leaderboard
                        participants={participants.filter(p => p.set === currentSet)}
                        results={results}
                        getTotals={getTotals}
                    />
                </>
            ) : (
                <p>Выберите сет или добавьте участников.</p>
            )}
        </div>
    );
}

export default App;