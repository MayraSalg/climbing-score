

// import React from 'react';
//
// function Leaderboard({ participants, results, getTotals }) {
//     const genders = ['male', 'female'];
//
//     return (
//         <div>
//             {genders.map(gender => {
//                 const sorted = [...participants].filter(p => p.gender === gender).sort((a, b) => {
//                     const totalsA = getTotals(results[a.id]);
//                     const totalsB = getTotals(results[b.id]);
//                     const zonesA = totalsA.zone1 + totalsA.zone2;
//                     const zonesB = totalsB.zone1 + totalsB.zone2;
//                     const attemptsZoneA = totalsA.attempts_zone1 + totalsA.attempts_zone2;
//                     const attemptsZoneB = totalsB.attempts_zone1 + totalsB.attempts_zone2;
//                     return totalsB.tops - totalsA.tops || zonesB - zonesA || totalsA.attempts_top - totalsB.attempts_top || attemptsZoneA - attemptsZoneB;
//                 }).slice(0, 6);
//
//                 return (
//                     <div key={gender}>
//                         <h2>Top 6 {gender.charAt(0).toUpperCase() + gender.slice(1)}</h2>
//                         <ul>
//                             {sorted.map((p, index) => {
//                                 const totals = getTotals(results[p.id]);
//                                 return <li key={p.id} style={{ backgroundColor: index < 6 ? '#ffd700' : 'transparent' }}>{index + 1}. {p.first_name} {p.last_name} - Tops: {totals.tops}</li>;
//                             })}
//                         </ul>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }
//
// export default Leaderboard;
// src/components/Leaderboard.jsx (обновлённый с разделением по group, затем по gender)

// import React from 'react';
//
// function Leaderboard({ participants, results, getTotals }) {
//     const groups = ['Общий зачет', 'Спортсмены']; // Hardcode, так как только эти две
//     const genders = ['male', 'female'];
//
//     return (
//         <div>
//             {groups.map(group => (
//                 <div key={group}>
//                     <h2>Лидеры: {group}</h2>
//                     {genders.map(gender => {
//                         const filtered = participants.filter(p => p.group === group && p.gender === gender);
//                         const sorted = [...filtered].sort((a, b) => {
//                             const totalsA = getTotals(results[a.id]);
//                             const totalsB = getTotals(results[b.id]);
//                             const zonesA = totalsA.zone1 + totalsA.zone2;
//                             const zonesB = totalsB.zone1 + totalsB.zone2;
//                             const attemptsZoneA = totalsA.attempts_zone1 + totalsA.attempts_zone2;
//                             const attemptsZoneB = totalsB.attempts_zone1 + totalsB.attempts_zone2;
//                             return totalsB.tops - totalsA.tops || zonesB - zonesA || totalsA.attempts_top - totalsB.attempts_top || attemptsZoneA - attemptsZoneB;
//                         }).slice(0, 6);
//
//                         return (
//                             <div key={`${group}-${gender}`}>
//                                 <h3>Top 6 {gender.charAt(0).toUpperCase() + gender.slice(1)} в {group}</h3>
//                                 <ul>
//                                     {sorted.map((p, index) => {
//                                         const totals = getTotals(results[p.id]);
//                                         return <li key={p.id} style={{ backgroundColor: index < 6 ? '#ffd700' : 'transparent' }}>{index + 1}. {p.first_name} {p.last_name} - Tops: {totals.tops}</li>;
//                                     })}
//                                 </ul>
//                             </div>
//                         );
//                     })}
//                 </div>
//             ))}
//         </div>
//     );
// }
//
// export default Leaderboard;
import React from 'react';

function Leaderboard({ participants, results, getTotals }) {
    // Получаем уникальные группы из participants
    const groups = [...new Set(participants.map(p => p.group))].filter(Boolean);
    const genders = ['male', 'female'];

    // Функция сравнения с учётом иерархии зон
    const compareParticipants = (a, b) => {
        const totalsA = getTotals(results[a.id]);
        const totalsB = getTotals(results[b.id]);

        // 1. Количество топов (больше — лучше)
        if (totalsB.tops !== totalsA.tops) return totalsB.tops - totalsA.tops;

        // 2. Количество zone2 (больше — лучше)
        if (totalsB.zone2 !== totalsA.zone2) return totalsB.zone2 - totalsA.zone2;

        // 3. Количество zone1 (больше — лучше)
        if (totalsB.zone1 !== totalsA.zone1) return totalsB.zone1 - totalsA.zone1;

        // 4. Сумма попыток на топы (меньше — лучше)
        if (totalsA.attempts_top !== totalsB.attempts_top) return totalsA.attempts_top - totalsB.attempts_top;

        // 5. Сумма попыток на zone2 (меньше — лучше)
        if (totalsA.attempts_zone2 !== totalsB.attempts_zone2) return totalsA.attempts_zone2 - totalsB.attempts_zone2;

        // 6. Сумма попыток на zone1 (меньше — лучше)
        return totalsA.attempts_zone1 - totalsB.attempts_zone1;
    };

    return (
        <div>
            {groups.map(group => (
                <div key={group}>
                    <h2>Лидеры: {group}</h2>
                    {genders.map(gender => {
                        const filtered = participants.filter(p => p.group === group && p.gender === gender);
                        const sorted = [...filtered].sort(compareParticipants).slice(0, 6);

                        if (sorted.length === 0) return null;

                        return (
                            <div key={`${group}-${gender}`}>
                                <h3>Топ-6 {gender === 'male' ? 'Мужчины' : 'Женщины'}</h3>
                                <ol style={{ listStyle: 'none', padding: 0 }}>
                                    {sorted.map((p, index) => {
                                        const totals = getTotals(results[p.id]);
                                        return (
                                            <li key={p.id} style={{
                                                backgroundColor: index < 3 ? '#ffd700' : index < 6 ? '#c0c0c0' : 'transparent',
                                                margin: '4px 0', padding: '4px 8px'
                                            }}>
                                                <strong>{index + 1}. {p.first_name} {p.last_name}</strong> — Топы: {totals.tops}, Zone2: {totals.zone2}, Zone1: {totals.zone1} (Попытки: Топ {totals.attempts_top}, Z2 {totals.attempts_zone2}, Z1 {totals.attempts_zone1})
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export default Leaderboard;