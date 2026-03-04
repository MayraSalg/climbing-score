// src/components/ResultForm.js
// import React, { useState, useMemo } from 'react';
//
// function ResultForm({ participants, onSubmit, searchTerm, setSearchTerm }) {
//     const [selectedId, setSelectedId] = useState('');
//     const [tops, setTops] = useState(0);
//     const [zone1, setZone1] = useState(0);
//     const [zone2, setZone2] = useState(0);
//     const [attempts_top, setAttemptsTop] = useState(0);
//     const [attempts_zone1, setAttemptsZone1] = useState(0);
//     const [attempts_zone2, setAttemptsZone2] = useState(0);
//
//     const filteredParticipants = useMemo(() => {
//         return participants.filter(p =>
//             `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [participants, searchTerm]);
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!selectedId) return alert('Выберите участника');
//         onSubmit(selectedId, { tops, zone1, zone2, attempts_top, attempts_zone1, attempts_zone2 });
//         // Сброс
//         setSelectedId('');
//         setTops(0);
//         setZone1(0);
//         setZone2(0);
//         setAttemptsTop(0);
//         setAttemptsZone1(0);
//         setAttemptsZone2(0);
//     };
//
//     return (
//         <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
//             <input
//                 type="text"
//                 placeholder="Поиск по ФИО"
//                 value={searchTerm}
//                 onChange={e => setSearchTerm(e.target.value)}
//                 style={{ padding: '8px', marginRight: '10px', width: '200px' }}
//             />
//             <select
//                 value={selectedId}
//                 onChange={e => setSelectedId(e.target.value)}
//                 style={{ padding: '8px', marginRight: '10px', width: '300px' }}
//             >
//                 <option value="">Выберите участника</option>
//                 {filteredParticipants.map(p => (
//                     <option key={p.id} value={p.id}>
//                         {p.first_name} {p.last_name} (ID: {p.id}, Группа: {p.group})
//                     </option>
//                 ))}
//             </select>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="tops" style={{ marginBottom: '4px', fontSize: '14px' }}>Tops</label>
//                 <input id="tops" type="number" value={tops} onChange={e => setTops(+e.target.value)} style={{ width: '60px', padding: '8px' }} />
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="zone1" style={{ marginBottom: '4px', fontSize: '14px' }}>Zone1</label>
//                 <input id="zone1" type="number" value={zone1} onChange={e => setZone1(+e.target.value)} style={{ width: '60px', padding: '8px' }} />
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="zone2" style={{ marginBottom: '4px', fontSize: '14px' }}>Zone2</label>
//                 <input id="zone2" type="number" value={zone2} onChange={e => setZone2(+e.target.value)} style={{ width: '60px', padding: '8px' }} />
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="attempts_top" style={{ marginBottom: '4px', fontSize: '14px' }}>Попытки Top</label>
//                 <input id="attempts_top" type="number" value={attempts_top} onChange={e => setAttemptsTop(+e.target.value)} style={{ width: '80px', padding: '8px' }} />
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="attempts_zone1" style={{ marginBottom: '4px', fontSize: '14px' }}>Попытки Zone1</label>
//                 <input id="attempts_zone1" type="number" value={attempts_zone1} onChange={e => setAttemptsZone1(+e.target.value)} style={{ width: '80px', padding: '8px' }} />
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="attempts_zone2" style={{ marginBottom: '4px', fontSize: '14px' }}>Попытки Zone2</label>
//                 <input id="attempts_zone2" type="number" value={attempts_zone2} onChange={e => setAttemptsZone2(+e.target.value)} style={{ width: '80px', padding: '8px' }} />
//             </div>
//             <button type="submit" style={{ padding: '8px 16px' }}>Сохранить</button>
//         </form>
//     );
// }
//
// export default ResultForm;
// src/components/ResultForm.jsx (полностью обновлённый с вводом per-route)

// import React, { useState, useMemo } from 'react';
//
// function ResultForm({ participants, onSubmit, searchTerm, setSearchTerm }) {
//     const [selectedId, setSelectedId] = useState('');
//     const [routeIndex, setRouteIndex] = useState(0); // 0-7 для трасс 1-8
//     const [top, setTop] = useState(0); // singular, per route
//     const [zone1, setZone1] = useState(0);
//     const [zone2, setZone2] = useState(0);
//     const [attempts_top, setAttemptsTop] = useState(0);
//     const [attempts_zone1, setAttemptsZone1] = useState(0);
//     const [attempts_zone2, setAttemptsZone2] = useState(0);
//
//     const filteredParticipants = useMemo(() => {
//         return participants.filter(p =>
//             `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [participants, searchTerm]);
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!selectedId) return alert('Выберите участника');
//         onSubmit(selectedId, routeIndex, { top, zone1, zone2, attempts_top, attempts_zone1, attempts_zone2 });
//         // Сброс формы (кроме selectedId и routeIndex, чтобы удобно вносить следующую трассу)
//         setTop(0);
//         setZone1(0);
//         setZone2(0);
//         setAttemptsTop(0);
//         setAttemptsZone1(0);
//         setAttemptsZone2(0);
//     };
//
//     return (
//         <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '10px' }}>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="search" style={{ marginBottom: '4px', fontSize: '14px' }}>Поиск по ФИО</label>
//                 <input
//                     id="search"
//                     type="text"
//                     placeholder="Поиск по ФИО"
//                     value={searchTerm}
//                     onChange={e => setSearchTerm(e.target.value)}
//                     style={{ padding: '8px', width: '200px' }}
//                 />
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="participant" style={{ marginBottom: '4px', fontSize: '14px' }}>Участник</label>
//                 <select
//                     id="participant"
//                     value={selectedId}
//                     onChange={e => setSelectedId(e.target.value)}
//                     style={{ padding: '8px', width: '300px' }}
//                 >
//                     <option value="">Выберите участника</option>
//                     {filteredParticipants.map(p => (
//                         <option key={p.id} value={p.id}>
//                             {p.first_name} {p.last_name} (ID: {p.id}, Группа: {p.group})
//                         </option>
//                     ))}
//                 </select>
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="route" style={{ marginBottom: '4px', fontSize: '14px' }}>Трасса</label>
//                 <select
//                     id="route"
//                     value={routeIndex}
//                     onChange={e => setRouteIndex(+e.target.value)}
//                     style={{ padding: '8px', width: '100px' }}
//                 >
//                     {Array.from({ length: 8 }, (_, i) => (
//                         <option key={i} value={i}>Трасса {i + 1}</option>
//                     ))}
//                 </select>
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="top" style={{ marginBottom: '4px', fontSize: '14px' }}>Top</label>
//                 <input id="top" type="number" value={top} onChange={e => setTop(+e.target.value)} style={{ width: '60px', padding: '8px' }} />
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="zone1" style={{ marginBottom: '4px', fontSize: '14px' }}>Zone1</label>
//                 <input id="zone1" type="number" value={zone1} onChange={e => setZone1(+e.target.value)} style={{ width: '60px', padding: '8px' }} />
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="zone2" style={{ marginBottom: '4px', fontSize: '14px' }}>Zone2</label>
//                 <input id="zone2" type="number" value={zone2} onChange={e => setZone2(+e.target.value)} style={{ width: '60px', padding: '8px' }} />
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="attempts_top" style={{ marginBottom: '4px', fontSize: '14px' }}>Попытки Top</label>
//                 <input id="attempts_top" type="number" value={attempts_top} onChange={e => setAttemptsTop(+e.target.value)} style={{ width: '80px', padding: '8px' }} />
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="attempts_zone1" style={{ marginBottom: '4px', fontSize: '14px' }}>Попытки Zone1</label>
//                 <input id="attempts_zone1" type="number" value={attempts_zone1} onChange={e => setAttemptsZone1(+e.target.value)} style={{ width: '80px', padding: '8px' }} />
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <label htmlFor="attempts_zone2" style={{ marginBottom: '4px', fontSize: '14px' }}>Попытки Zone2</label>
//                 <input id="attempts_zone2" type="number" value={attempts_zone2} onChange={e => setAttemptsZone2(+e.target.value)} style={{ width: '80px', padding: '8px' }} />
//             </div>
//             <button type="submit" style={{ padding: '8px 16px', alignSelf: 'flex-end' }}>Сохранить</button>
//         </form>
//     );
// }
//
// export default ResultForm;
import React, { useState, useMemo } from 'react';

function ResultForm({ participants, onSubmit, searchTerm, setSearchTerm }) {
    const [selectedId, setSelectedId] = useState('');
    const [routeIndex, setRouteIndex] = useState(0);
    const [top, setTop] = useState(0);
    const [zone1, setZone1] = useState(0);
    const [zone2, setZone2] = useState(0);
    const [attempts_top, setAttemptsTop] = useState(0);
    const [attempts_zone1, setAttemptsZone1] = useState(0);
    const [attempts_zone2, setAttemptsZone2] = useState(0);
    const [error, setError] = useState('');

    const filteredParticipants = useMemo(() => {
        return participants.filter(p =>
            `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [participants, searchTerm]);

    const validateAttempts = () => {
        if (attempts_top > 6 || attempts_zone1 > 6 || attempts_zone2 > 6) {
            setError('Количество попыток не может превышать 6');
            return false;
        }
        // Дополнительно: можно проверять, что если top=0, то attempts_top должно быть 0?
        // Но по логике, если топ не взят, попытки на топ не вводятся. Оставим на усмотрение судьи.
        setError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedId) {
            alert('Выберите участника');
            return;
        }
        if (!validateAttempts()) return;

        onSubmit(selectedId, routeIndex, {
            top: Math.min(top, 1), // гарантируем 0 или 1
            zone1: Math.min(zone1, 1),
            zone2: Math.min(zone2, 1),
            attempts_top,
            attempts_zone1,
            attempts_zone2
        });

        // Сброс полей (кроме участника и трассы)
        setTop(0);
        setZone1(0);
        setZone2(0);
        setAttemptsTop(0);
        setAttemptsZone1(0);
        setAttemptsZone2(0);
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '10px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="route" style={{ marginBottom: '4px', fontSize: '14px' }}>Трасса</label>
                <select
                    id="route"
                    value={routeIndex}
                    onChange={e => setRouteIndex(+e.target.value)}
                    style={{ padding: '8px', width: '100px' }}
                >
                    {Array.from({ length: 8 }, (_, i) => (
                        <option key={i} value={i}>Трасса {i + 1}</option>
                    ))}
                </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="top" style={{ marginBottom: '4px', fontSize: '14px' }}>Top (0/1)</label>
                <input id="top" type="number" min="0" max="1" value={top} onChange={e => setTop(Math.min(1, +e.target.value))} style={{ width: '60px', padding: '8px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="zone2" style={{ marginBottom: '4px', fontSize: '14px' }}>Zone2 (0/1)</label>
                <input id="zone2" type="number" min="0" max="1" value={zone2} onChange={e => setZone2(Math.min(1, +e.target.value))} style={{ width: '60px', padding: '8px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="zone1" style={{ marginBottom: '4px', fontSize: '14px' }}>Zone1 (0/1)</label>
                <input id="zone1" type="number" min="0" max="1" value={zone1} onChange={e => setZone1(Math.min(1, +e.target.value))} style={{ width: '60px', padding: '8px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="attempts_top" style={{ marginBottom: '4px', fontSize: '14px' }}>Попытки Top</label>
                <input id="attempts_top" type="number" min="0" max="6" value={attempts_top} onChange={e => setAttemptsTop(+e.target.value)} style={{ width: '80px', padding: '8px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="attempts_zone2" style={{ marginBottom: '4px', fontSize: '14px' }}>Попытки Zone2</label>
                <input id="attempts_zone2" type="number" min="0" max="6" value={attempts_zone2} onChange={e => setAttemptsZone2(+e.target.value)} style={{ width: '80px', padding: '8px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="attempts_zone1" style={{ marginBottom: '4px', fontSize: '14px' }}>Попытки Zone1</label>
                <input id="attempts_zone1" type="number" min="0" max="6" value={attempts_zone1} onChange={e => setAttemptsZone1(+e.target.value)} style={{ width: '80px', padding: '8px' }} />
            </div>
            {error && <div style={{ color: 'red', width: '100%' }}>{error}</div>}
            <button type="submit" style={{ padding: '8px 16px', alignSelf: 'flex-end' }}>Сохранить</button>
        </form>
    );
}

export default ResultForm;