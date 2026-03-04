// import React, { useState, useMemo } from 'react';
//
// function ParticipantResultsEditor({ participants, results, onSubmit, searchTerm, setSearchTerm }) {
//     const [selectedId, setSelectedId] = useState('');
//
//     const filteredParticipants = useMemo(() => {
//         return participants.filter(p =>
//             `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [participants, searchTerm]);
//
//     const selectedParticipant = participants.find(p => p.id === selectedId);
//     const participantResults = results[selectedId] || { routes: Array(8).fill({}) };
//
//     // Вспомогательная функция для получения данных конкретной трассы
//     const getRouteData = (routeIndex) => {
//         const route = participantResults.routes[routeIndex] || {};
//         return {
//             top: route.top || 0,
//             zone1: route.zone1 || 0,
//             zone2: route.zone2 || 0,
//             attempts_top: route.attempts_top || 0,
//             attempts_zone1: route.attempts_zone1 || 0,
//             attempts_zone2: route.attempts_zone2 || 0,
//         };
//     };
//
//     // Обработчик изменения поля
//     const handleFieldChange = (routeIndex, field, value) => {
//         if (!selectedId) return;
//
//         // Проверка для attempts: не больше 6
//         if (field.startsWith('attempts_') && value > 6) {
//             alert('Количество попыток не может превышать 6');
//             return;
//         }
//         // Для zone/top ограничиваем 0 или 1
//         if ((field === 'top' || field === 'zone1' || field === 'zone2') && (value < 0 || value > 1)) {
//             return;
//         }
//
//         const currentRoute = getRouteData(routeIndex);
//         const newRouteData = { ...currentRoute, [field]: value };
//         onSubmit(selectedId, routeIndex, newRouteData);
//     };
//
//     // Вычисление итогов по всем трассам
//     const totals = useMemo(() => {
//         if (!selectedId) return null;
//         return participantResults.routes.reduce((acc, route) => {
//             route = route || {};
//             return {
//                 tops: acc.tops + (route.top || 0),
//                 zone1: acc.zone1 + (route.zone1 || 0),
//                 zone2: acc.zone2 + (route.zone2 || 0),
//                 attempts_top: acc.attempts_top + (route.attempts_top || 0),
//                 attempts_zone1: acc.attempts_zone1 + (route.attempts_zone1 || 0),
//                 attempts_zone2: acc.attempts_zone2 + (route.attempts_zone2 || 0),
//             };
//         }, { tops: 0, zone1: 0, zone2: 0, attempts_top: 0, attempts_zone1: 0, attempts_zone2: 0 });
//     }, [selectedId, participantResults]);
//
//     return (
//         <div style={{ marginBottom: '20px' }}>
//             <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '20px' }}>
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                     <label htmlFor="search" style={{ marginBottom: '4px', fontSize: '14px' }}>Поиск по ФИО</label>
//                     <input
//                         id="search"
//                         type="text"
//                         placeholder="Поиск по ФИО"
//                         value={searchTerm}
//                         onChange={e => setSearchTerm(e.target.value)}
//                         style={{ padding: '8px', width: '200px' }}
//                     />
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                     <label htmlFor="participant" style={{ marginBottom: '4px', fontSize: '14px' }}>Участник</label>
//                     <select
//                         id="participant"
//                         value={selectedId}
//                         onChange={e => setSelectedId(e.target.value)}
//                         style={{ padding: '8px', width: '300px' }}
//                     >
//                         <option value="">Выберите участника</option>
//                         {filteredParticipants.map(p => (
//                             <option key={p.id} value={p.id}>
//                                 {p.first_name} {p.last_name} (ID: {p.id}, Группа: {p.group})
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>
//
//             {selectedParticipant && (
//                 <div>
//                     <h3>Результаты: {selectedParticipant.first_name} {selectedParticipant.last_name}</h3>
//                     <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
//                         <thead>
//                         <tr>
//                             <th>Трасса</th>
//                             <th>Zone1 (0/1)</th>
//                             <th>Zone2 (0/1)</th>
//                             <th>Top (0/1)</th>
//                             <th>Попытки Zone1</th>
//                             <th>Попытки Zone2</th>
//                             <th>Попытки Top</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {Array.from({ length: 8 }, (_, i) => {
//                             const routeData = getRouteData(i);
//                             return (
//                                 <tr key={i}>
//                                     <td>Трасса {i + 1}</td>
//                                     <td>
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             max="1"
//                                             value={routeData.zone1}
//                                             onChange={e => handleFieldChange(i, 'zone1', parseInt(e.target.value) || 0)}
//                                             style={{ width: '60px' }}
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             max="1"
//                                             value={routeData.zone2}
//                                             onChange={e => handleFieldChange(i, 'zone2', parseInt(e.target.value) || 0)}
//                                             style={{ width: '60px' }}
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             max="1"
//                                             value={routeData.top}
//                                             onChange={e => handleFieldChange(i, 'top', parseInt(e.target.value) || 0)}
//                                             style={{ width: '60px' }}
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             max="6"
//                                             value={routeData.attempts_zone1}
//                                             onChange={e => handleFieldChange(i, 'attempts_zone1', parseInt(e.target.value) || 0)}
//                                             style={{ width: '80px' }}
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             max="6"
//                                             value={routeData.attempts_zone2}
//                                             onChange={e => handleFieldChange(i, 'attempts_zone2', parseInt(e.target.value) || 0)}
//                                             style={{ width: '80px' }}
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             max="6"
//                                             value={routeData.attempts_top}
//                                             onChange={e => handleFieldChange(i, 'attempts_top', parseInt(e.target.value) || 0)}
//                                             style={{ width: '80px' }}
//                                         />
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                         </tbody>
//                         <tfoot>
//                         <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
//                             <td>Итого</td>
//                             <td>{totals?.zone1 || 0}</td>
//                             <td>{totals?.zone2 || 0}</td>
//                             <td>{totals?.tops || 0}</td>
//                             <td>{totals?.attempts_zone1 || 0}</td>
//                             <td>{totals?.attempts_zone2 || 0}</td>
//                             <td>{totals?.attempts_top || 0}</td>
//                         </tr>
//                         </tfoot>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// export default ParticipantResultsEditor;
import React, { useState, useMemo } from 'react';
import { getTotals, validateRouteData } from '../utils/compareParticipants.js';

function ParticipantResultsEditor({ allParticipants, currentSetParticipants, results, onSubmit, searchTerm, setSearchTerm }) {
    const [selectedId, setSelectedId] = useState('');
    const [validationError, setValidationError] = useState('');
    const [saveStatus, setSaveStatus] = useState(''); // ✅ Статус сохранения

    const filteredParticipants = useMemo(() => {
        return currentSetParticipants.filter(p =>
            `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [currentSetParticipants, searchTerm]);

    const selectedParticipant = useMemo(() => {
        if (!selectedId) return null;
        const numId = parseInt(selectedId);
        return allParticipants.find(p => p.id === numId);
    }, [selectedId, allParticipants]);

    const participantResults = useMemo(() => {
        // ✅ ИСПРАВЛЕНИЕ: используем selectedId как есть (это строка из select)
        // localStorage хранит с ключом как строка: results["377"], а не results[377]
        return results[selectedId] || { routes: Array(8).fill({}) };
    }, [selectedId, results]);

    const getRouteData = (routeIndex) => {
        const route = participantResults.routes[routeIndex] || {};
        return {
            top: route.top || 0,
            zone1: route.zone1 || 0,
            zone2: route.zone2 || 0,
        };
    };

    const handleFieldChange = (routeIndex, field, value) => {
        if (!selectedId) return;

        if (value < 0) return;

        const currentRoute = getRouteData(routeIndex);
        const newRouteData = { ...currentRoute, [field]: value };

        if (!validateRouteData(newRouteData)) {
            const sum = newRouteData.top + newRouteData.zone1 + newRouteData.zone2;
            setValidationError(`❌ Сумма попыток на трассе не должна превышать 6! Текущая сумма: ${sum}`);
            return;
        }

        setValidationError('');

        // ✅ ИСПРАВЛЕНИЕ: передаем selectedId как СТРОКА (как он приходит из select)
        // Это гарантирует, что ключ в localStorage будет строкой везде
        onSubmit(selectedId, routeIndex, newRouteData);

        // ✅ НОВОЕ: показываем статус сохранения
        setSaveStatus('✅ Сохранено');
        setTimeout(() => setSaveStatus(''), 2000);
    };

    const totals = useMemo(() => {
        if (!selectedId) return null;
        return getTotals(participantResults);
    }, [selectedId, participantResults]);

    const getRouteSum = (routeIndex) => {
        const route = getRouteData(routeIndex);
        return route.top + route.zone1 + route.zone2;
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            {/* Поиск и выбор */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="search" style={{ marginBottom: '4px', fontSize: '14px' }}>Поиск по ФИО</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Поиск по ФИО"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ padding: '8px', width: '200px' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="participant" style={{ marginBottom: '4px', fontSize: '14px' }}>Участник</label>
                    <select
                        id="participant"
                        value={selectedId}
                        onChange={e => setSelectedId(e.target.value)}
                        style={{ padding: '8px', width: '300px' }}
                    >
                        <option value="">Выберите участника</option>
                        {filteredParticipants.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.first_name} {p.last_name} (ID: {p.id}, Группа: {p.group})
                            </option>
                        ))}
                    </select>
                </div>
                {/* ✅ НОВОЕ: статус сохранения */}
                {saveStatus && (
                    <div style={{ color: '#059669', fontWeight: 'bold', fontSize: '14px' }}>
                        {saveStatus}
                    </div>
                )}
            </div>

            {/* Таблица */}
            {selectedParticipant && (
                <div>
                    <h3>Результаты: {selectedParticipant.first_name} {selectedParticipant.last_name}</h3>

                    {validationError && (
                        <div style={{
                            padding: '12px',
                            marginBottom: '15px',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fca5a5',
                            borderRadius: '6px',
                            color: '#dc2626'
                        }}>
                            {validationError}
                        </div>
                    )}

                    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#f3f4f6' }}>
                            <th style={{ textAlign: 'left', fontWeight: 'bold' }}>Трасса</th>
                            <th style={{ textAlign: 'center', fontWeight: 'bold' }}>Zone1</th>
                            <th style={{ textAlign: 'center', fontWeight: 'bold' }}>Zone2</th>
                            <th style={{ textAlign: 'center', fontWeight: 'bold' }}>Top</th>
                            <th style={{ textAlign: 'center', fontWeight: 'bold' }}>Сумма</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Array.from({ length: 8 }, (_, i) => {
                            const routeData = getRouteData(i);
                            const routeSum = getRouteSum(i);
                            const isValid = routeSum <= 6;

                            return (
                                <tr key={i} style={{
                                    backgroundColor: !isValid ? '#fef2f2' : (i % 2 === 0 ? '#f9fafb' : 'white')
                                }}>
                                    <td style={{ fontWeight: 'bold' }}>Трасса {i + 1}</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            value={routeData.zone1}
                                            onChange={e => handleFieldChange(i, 'zone1', parseInt(e.target.value) || 0)}
                                            style={{
                                                width: '70px',
                                                padding: '6px',
                                                textAlign: 'center',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            value={routeData.zone2}
                                            onChange={e => handleFieldChange(i, 'zone2', parseInt(e.target.value) || 0)}
                                            style={{
                                                width: '70px',
                                                padding: '6px',
                                                textAlign: 'center',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            value={routeData.top}
                                            onChange={e => handleFieldChange(i, 'top', parseInt(e.target.value) || 0)}
                                            style={{
                                                width: '70px',
                                                padding: '6px',
                                                textAlign: 'center',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </td>
                                    <td style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: isValid ? '#065f46' : '#dc2626'
                                    }}>
                                        {routeSum} {!isValid && '❌'}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                        <tfoot>
                        <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                            <td>Итого</td>
                            <td style={{ textAlign: 'center' }}>{totals?.zone1 || 0}</td>
                            <td style={{ textAlign: 'center' }}>{totals?.zone2 || 0}</td>
                            <td style={{ textAlign: 'center' }}>{totals?.tops || 0}</td>
                            <td style={{ textAlign: 'center' }}>{(totals?.zone1 || 0) + (totals?.zone2 || 0) + (totals?.tops || 0)}</td>
                        </tr>
                        </tfoot>
                    </table>

                    <div style={{
                        marginTop: '15px',
                        padding: '12px',
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #0284c7',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#0c4a6e'
                    }}>
                        <strong>📌 Справка:</strong> Каждая трасса — максимум 6 попыток.
                        Сумма Zone1 + Zone2 + Top на одну трассу ≤ 6.
                        Данные автоматически сохраняются в localStorage.
                    </div>
                </div>
            )}

            {!selectedParticipant && selectedId && (
                <p style={{ color: 'red' }}>❌ Участник не найден. Это может быть баг - проверьте консоль браузера (F12).</p>
            )}
        </div>
    );
}

export default ParticipantResultsEditor;