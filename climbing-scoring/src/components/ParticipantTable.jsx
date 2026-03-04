
//
// import React, { useState } from 'react';
//
// function ParticipantTable({ participants, results, getTotals }) {
//     const [sortBy, setSortBy] = useState('tops');
//     const [filterAttempts, setFilterAttempts] = useState(0);
//     const [genderFilter, setGenderFilter] = useState('all');
//
//     const sortedParticipants = [...participants].sort((a, b) => {
//         const totalsA = getTotals(results[a.id]);
//         const totalsB = getTotals(results[b.id]);
//         const zonesA = totalsA.zone1 + totalsA.zone2;
//         const zonesB = totalsB.zone1 + totalsB.zone2;
//         const attemptsZoneA = totalsA.attempts_zone1 + totalsA.attempts_zone2;
//         const attemptsZoneB = totalsB.attempts_zone1 + totalsB.attempts_zone2;
//
//         if (sortBy === 'tops') {
//             return totalsB.tops - totalsA.tops || zonesB - zonesA || totalsA.attempts_top - totalsB.attempts_top || attemptsZoneA - attemptsZoneB;
//         }
//         if (sortBy === 'zone1') return totalsB.zone1 - totalsA.zone1;
//         if (sortBy === 'zone2') return totalsB.zone2 - totalsA.zone2;
//         // Добавьте другие случаи сортировки по необходимости
//         return 0;
//     }).filter(p => {
//         const totals = getTotals(results[p.id]);
//         const totalAttempts = totals.attempts_top + totals.attempts_zone1 + totals.attempts_zone2;
//         const genderMatch = genderFilter === 'all' || p.gender === genderFilter;
//         return totalAttempts >= filterAttempts && genderMatch;
//     });
//
//     return (
//         <div>
//             <select onChange={e => setSortBy(e.target.value)}>
//                 <option value="tops">Sort by Tops</option>
//                 <option value="zone1">Sort by Zone1</option>
//                 <option value="zone2">Sort by Zone2</option>
//                 {/* Добавьте больше опций */}
//             </select>
//             <input type="number" placeholder="Min Attempts" onChange={e => setFilterAttempts(+e.target.value)} />
//             <select onChange={e => setGenderFilter(e.target.value)}>
//                 <option value="all">All Genders</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//             </select>
//             <table>
//                 <thead>
//                 <tr>
//                     <th>Name</th>
//                     <th>Total Tops</th>
//                     <th>Total Zone1</th>
//                     <th>Total Zone2</th>
//                     <th>Total Attempts Top</th>
//                     <th>Total Attempts Zone1</th>
//                     <th>Total Attempts Zone2</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {sortedParticipants.map(p => {
//                     const totals = getTotals(results[p.id]);
//                     return (
//                         <tr key={p.id}>
//                             <td>{p.first_name} {p.last_name}</td>
//                             <td>{totals.tops}</td>
//                             <td>{totals.zone1}</td>
//                             <td>{totals.zone2}</td>
//                             <td>{totals.attempts_top}</td>
//                             <td>{totals.attempts_zone1}</td>
//                             <td>{totals.attempts_zone2}</td>
//                         </tr>
//                     );
//                 })}
//                 </tbody>
//             </table>
//         </div>
//     );
// }
//
// export default ParticipantTable;
// src/components/ParticipantTable.jsx (обновлённый с фильтром по group, но поскольку фильтр в App, таблица просто отображает currentParticipants)

// import React, { useState } from 'react';
//
// function ParticipantTable({ participants, results, getTotals }) {
//     const [sortBy, setSortBy] = useState('tops');
//     const [filterAttempts, setFilterAttempts] = useState(0);
//     const [genderFilter, setGenderFilter] = useState('all');
//
//     const sortedParticipants = [...participants].sort((a, b) => {
//         const totalsA = getTotals(results[a.id]);
//         const totalsB = getTotals(results[b.id]);
//         const zonesA = totalsA.zone1 + totalsA.zone2;
//         const zonesB = totalsB.zone1 + totalsB.zone2;
//         const attemptsZoneA = totalsA.attempts_zone1 + totalsA.attempts_zone2;
//         const attemptsZoneB = totalsB.attempts_zone1 + totalsB.attempts_zone2;
//
//         if (sortBy === 'tops') {
//             return totalsB.tops - totalsA.tops || zonesB - zonesA || totalsA.attempts_top - totalsB.attempts_top || attemptsZoneA - attemptsZoneB;
//         }
//         if (sortBy === 'zone1') return totalsB.zone1 - totalsA.zone1;
//         if (sortBy === 'zone2') return totalsB.zone2 - totalsA.zone2;
//         // Добавьте другие случаи сортировки по необходимости
//         return 0;
//     }).filter(p => {
//         const totals = getTotals(results[p.id]);
//         const totalAttempts = totals.attempts_top + totals.attempts_zone1 + totals.attempts_zone2;
//         const genderMatch = genderFilter === 'all' || p.gender === genderFilter;
//         return totalAttempts >= filterAttempts && genderMatch;
//     });
//
//     return (
//         <div>
//             <select onChange={e => setSortBy(e.target.value)}>
//                 <option value="tops">Sort by Tops</option>
//                 <option value="zone1">Sort by Zone1</option>
//                 <option value="zone2">Sort by Zone2</option>
//                 {/* Добавьте больше опций */}
//             </select>
//             <input type="number" placeholder="Min Attempts" onChange={e => setFilterAttempts(+e.target.value)} />
//             <select onChange={e => setGenderFilter(e.target.value)}>
//                 <option value="all">All Genders</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//             </select>
//             <table>
//                 <thead>
//                 <tr>
//                     <th>Name</th>
//                     <th>Group</th> {/* Новый столбец для group */}
//                     <th>Total Tops</th>
//                     <th>Total Zone1</th>
//                     <th>Total Zone2</th>
//                     <th>Total Attempts Top</th>
//                     <th>Total Attempts Zone1</th>
//                     <th>Total Attempts Zone2</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {sortedParticipants.map(p => {
//                     const totals = getTotals(results[p.id]);
//                     return (
//                         <tr key={p.id}>
//                             <td>{p.first_name} {p.last_name}</td>
//                             <td>{p.group}</td>
//                             <td>{totals.tops}</td>
//                             <td>{totals.zone1}</td>
//                             <td>{totals.zone2}</td>
//                             <td>{totals.attempts_top}</td>
//                             <td>{totals.attempts_zone1}</td>
//                             <td>{totals.attempts_zone2}</td>
//                         </tr>
//                     );
//                 })}
//                 </tbody>
//             </table>
//         </div>
//     );
// }
//
// export default ParticipantTable;
import React, { useState, useMemo } from 'react';

function ParticipantTable({ participants, results, getTotals }) {
    const [sortBy, setSortBy] = useState('tops');
    const [filterAttempts, setFilterAttempts] = useState(0);
    const [genderFilter, setGenderFilter] = useState('all');

    // Функция сравнения в зависимости от выбранного критерия
    const getCompareFunction = (criteria) => {
        return (a, b) => {
            const totalsA = getTotals(results[a.id]);
            const totalsB = getTotals(results[b.id]);

            if (criteria === 'tops') {
                // Сортировка по топам, затем zone2, zone1, попытки
                if (totalsB.tops !== totalsA.tops) return totalsB.tops - totalsA.tops;
                if (totalsB.zone2 !== totalsA.zone2) return totalsB.zone2 - totalsA.zone2;
                if (totalsB.zone1 !== totalsA.zone1) return totalsB.zone1 - totalsA.zone1;
                if (totalsA.attempts_top !== totalsB.attempts_top) return totalsA.attempts_top - totalsB.attempts_top;
                if (totalsA.attempts_zone2 !== totalsB.attempts_zone2) return totalsA.attempts_zone2 - totalsB.attempts_zone2;
                return totalsA.attempts_zone1 - totalsB.attempts_zone1;
            }
            if (criteria === 'zone2') return totalsB.zone2 - totalsA.zone2;
            if (criteria === 'zone1') return totalsB.zone1 - totalsA.zone1;
            return 0;
        };
    };

    const sortedParticipants = useMemo(() => {
        return [...participants]
            .sort(getCompareFunction(sortBy))
            .filter(p => {
                const totals = getTotals(results[p.id]);
                // Фильтруем по сумме всех попыток
                const totalAttempts = totals.attempts_top + totals.attempts_zone1 + totals.attempts_zone2;
                const genderMatch = genderFilter === 'all' || p.gender === genderFilter;
                return totalAttempts >= filterAttempts && genderMatch;
            });
    }, [participants, results, sortBy, filterAttempts, genderFilter, getTotals]);

    return (
        <div style={{ marginTop: '30px' }}>
            <h2>Таблица результатов</h2>

            <div style={{ marginBottom: '15px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                    <label>Сортировать по: </label>
                    <select onChange={e => setSortBy(e.target.value)} value={sortBy}>
                        <option value="tops">Топам (приоритет)</option>
                        <option value="zone2">Zone2</option>
                        <option value="zone1">Zone1</option>
                    </select>
                </div>
                <div>
                    <label>Мин. попыток: </label>
                    <input
                        type="number"
                        min="0"
                        value={filterAttempts}
                        onChange={e => setFilterAttempts(+e.target.value)}
                        style={{ width: '80px' }}
                    />
                </div>
                <div>
                    <label>Пол: </label>
                    <select onChange={e => setGenderFilter(e.target.value)} value={genderFilter}>
                        <option value="all">Все</option>
                        <option value="male">Мужчины</option>
                        <option value="female">Женщины</option>
                    </select>
                </div>
            </div>

            {sortedParticipants.length === 0 ? (
                <p style={{ color: '#666' }}>Нет участников, соответствующих выбранным фильтрам.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
                        <thead style={{ backgroundColor: 'black' }}>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Имя</th>
                            <th style={{ textAlign: 'left' }}>Группа</th>
                            <th style={{ textAlign: 'center' }}>Топы</th>
                            <th style={{ textAlign: 'center' }}>Zone2</th>
                            <th style={{ textAlign: 'center' }}>Zone1</th>
                            <th style={{ textAlign: 'center' }}>Попытки Top</th>
                            <th style={{ textAlign: 'center' }}>Попытки Zone2</th>
                            <th style={{ textAlign: 'center' }}>Попытки Zone1</th>
                            <th style={{ textAlign: 'center' }}>Всего попыток</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedParticipants.map((p, index) => {
                            const totals = getTotals(results[p.id]);
                            const totalAttempts = totals.attempts_top + totals.attempts_zone2 + totals.attempts_zone1;

                            return (
                                <tr key={p.id} style={{ backgroundColor: index % 2 === 0 ? 'black' : 'black' }}>
                                    <td style={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>
                                        {index < 3 && '🥇'} {p.first_name} {p.last_name}
                                    </td>
                                    <td>{p.group}</td>
                                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#dc2626' }}>{totals.tops}</td>
                                    <td style={{ textAlign: 'center' }}>{totals.zone2}</td>
                                    <td style={{ textAlign: 'center' }}>{totals.zone1}</td>
                                    <td style={{ textAlign: 'center' }}>{totals.attempts_top}</td>
                                    <td style={{ textAlign: 'center' }}>{totals.attempts_zone2}</td>
                                    <td style={{ textAlign: 'center' }}>{totals.attempts_zone1}</td>
                                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{totalAttempts}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ParticipantTable;