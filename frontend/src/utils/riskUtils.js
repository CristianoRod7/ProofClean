export function getRiskLevel(score=0){ if(score<=30)return 'LOW'; if(score<=60)return 'MEDIUM'; if(score<=80)return 'HIGH'; return 'CRITICAL'; }
export function getRiskLabel(score=0){ return ({LOW:'낮음',MEDIUM:'주의',HIGH:'높음',CRITICAL:'매우 높음'})[getRiskLevel(score)]; }
export function getRiskBadgeClass(score=0){ return score>80?'badge-red':score>60?'badge-yellow':score>30?'badge-blue':'badge-green'; }
