import React from 'react'

export default function Filters({ sets, groups, activeSetTab, setActiveSetTab, groupFilters, setGroupFilters, genderFilters, setGenderFilters, search, setSearch, sortBy, setSortBy }) {
    const toggle = (arr, setter, v) => setter(arr.includes(v) ? arr.filter(x=>x!==v) : [...arr, v])
    return (
        <div className="filters-row">
            <div style={{ marginBottom: 8 }}>
                <strong>Сеты:</strong>
                {sets.map(s => (
                    <button key={s} onClick={() => setActiveSetTab(s)} style={{ marginLeft: 6, background: s===activeSetTab? '#cde' : 'transparent' }}>{s}</button>
                ))}
            </div>

            <div style={{ marginBottom: 8 }}>
                <strong>Группы:</strong>
                {groups.map(g => (
                    <label key={g} style={{ marginLeft: 8 }}>
                        <input type="checkbox" checked={groupFilters.includes(g)} onChange={() => toggle(groupFilters, setGroupFilters, g)} /> {g}
                    </label>
                ))}
            </div>

            <div style={{ marginBottom: 8 }}>
                <label style={{ marginRight: 8 }}><input type="checkbox" checked={genderFilters.includes('M')} onChange={() => toggle(genderFilters, setGenderFilters, 'M')} /> M</label>
                <label><input type="checkbox" checked={genderFilters.includes('F')} onChange={() => toggle(genderFilters, setGenderFilters, 'F')} /> F</label>
            </div>

            <div style={{ marginBottom: 8 }}>
                <input placeholder="Поиск ФИО/команда" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>

            <div>
                <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                    <option value="rank">Ранг</option>
                    <option value="score">Score</option>
                    <option value="tops">Tops</option>
                    <option value="zones">Zones</option>
                    <option value="topAttemptsAsc">Top attempts ↑</option>
                    <option value="zoneAttemptsAsc">Zone attempts ↑</option>
                </select>
            </div>
        </div>
    )
}