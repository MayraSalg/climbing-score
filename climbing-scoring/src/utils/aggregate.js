export function aggregateResultsForParticipant(results, pid) {
    const rows = results.filter(r => r.participantId === pid)
    let totalTops = 0, totalTopAtt = 0, totalZones = 0, totalZoneAtt = 0
    rows.forEach(x => {
        if (Number(x.top)) { totalTops += 1; totalTopAtt += Number(x.topAtt || 0) }
        if (Number(x.zone1)) { totalZones += 1; totalZoneAtt += Number(x.zone1Att || 0) }
        if (Number(x.zone2)) { totalZones += 1; totalZoneAtt += Number(x.zone2Att || 0) }
    })
    return { totalTops, totalTopAtt, totalZones, totalZoneAtt }
}

export function compareRank(aStats, bStats) {
    if (bStats.totalTops !== aStats.totalTops) return bStats.totalTops - aStats.totalTops
    if (aStats.totalTopAtt !== bStats.totalTopAtt) return aStats.totalTopAtt - bStats.totalTopAtt
    if (bStats.totalZones !== aStats.totalZones) return bStats.totalZones - aStats.totalZones
    if (aStats.totalZoneAtt !== bStats.totalZoneAtt) return aStats.totalZoneAtt - bStats.totalZoneAtt
    return 0
}

export function scoreFromStats(s) { return s.totalTops * 1000 + s.totalZones * 10 - (s.totalTopAtt + s.totalZoneAtt) }