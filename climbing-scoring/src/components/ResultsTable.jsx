import React from 'react'

export default function ResultsTable({ list, onExport }) {
    return (
        <div>
            <div style={{ marginBottom:8 }}><button onClick={()=>onExport(list)}>Экспорт в Excel (отфильтровано)</button></div>
            <table className="table">
                <thead>
                <tr>
                    <th>Место</th>
                    <th>ФИО</th>
                    <th>Команда</th>
                    <th>Группа</th>
                    <th>Сет</th>
                    <th>Tops</th>
                    <th>Попытки Top</th>
                    <th>Zones</th>
                    <th>Попытки Zone</th>
                    <th>Score</th>
                </tr>
                </thead>
                <tbody>
                {list.map((p, idx)=> (
                    <tr key={p.id} className={idx<6? 'top6' : ''}>
                        <td>{idx+1}</td>
                        <td>{p.fio}</td>
                        <td>{p.team}</td>
                        <td>{p.group}</td>
                        <td>{p.set}</td>
                        <td>{p.stats.totalTops}</td>
                        <td>{p.stats.totalTopAtt}</td>
                        <td>{p.stats.totalZones}</td>
                        <td>{p.stats.totalZoneAtt}</td>
                        <td>{(p.stats.totalTops*1000 + p.stats.totalZones*10 - (p.stats.totalTopAtt + p.stats.totalZoneAtt))}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}