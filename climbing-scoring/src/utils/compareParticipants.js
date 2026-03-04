/**
 * ОБНОВЛЕННЫЕ УТИЛИТЫ С НОВОЙ СТРУКТУРОЙ
 *
 * Изменения:
 * - zone1, zone2, top теперь хранят количество попыток
 * - Попытки = само значение поля
 * - Валидация: zone1 + zone2 + top ≤ 6 на одну трассу
 */

/**
 * Вычисляет итоговые показатели по всем трассам
 *
 * НОВАЯ СТРУКТУРА:
 * - tops = сумма всех top
 * - zone1 = сумма всех zone1
 * - zone2 = сумма всех zone2
 * - attempts_top = сумма всех top (то же самое)
 * - attempts_zone1 = сумма всех zone1 (то же самое)
 * - attempts_zone2 = сумма всех zone2 (то же самое)
 */
export const getTotals = (res) => {
    if (!res || !res.routes) {
        return {
            tops: 0,
            zone1: 0,
            zone2: 0,
            attempts_top: 0,
            attempts_zone1: 0,
            attempts_zone2: 0
        };
    }

    return res.routes.reduce((acc, route) => {
        const routeTop = route?.top || 0;
        const routeZone1 = route?.zone1 || 0;
        const routeZone2 = route?.zone2 || 0;

        return {
            tops: acc.tops + routeTop,
            zone1: acc.zone1 + routeZone1,
            zone2: acc.zone2 + routeZone2,
            // Попытки теперь = сами значения (так как каждое значение = кол-во попыток)
            attempts_top: acc.attempts_top + routeTop,
            attempts_zone1: acc.attempts_zone1 + routeZone1,
            attempts_zone2: acc.attempts_zone2 + routeZone2,
        };
    }, {
        tops: 0,
        zone1: 0,
        zone2: 0,
        attempts_top: 0,
        attempts_zone1: 0,
        attempts_zone2: 0
    });
};

/**
 * Валидирует данные одной трассы
 * Правило: zone1 + zone2 + top ≤ 6
 */
export const validateRouteData = (routeData) => {
    const total = (routeData.zone1 || 0) + (routeData.zone2 || 0) + (routeData.top || 0);
    return total <= 6;
};

/**
 * Определяет пол по имени (эвристика)
 */
export const determineGender = (firstName) => {
    if (!firstName) return 'male';

    const name = firstName.toLowerCase();
    const femaleNames = [
        'мария', 'анастасия', 'александра', 'вероника', 'василиса',
        'екатерина', 'елена', 'ольга', 'виктория', 'татьяна',
        'наталья', 'софья', 'светлана', 'марина', 'галина',
        'людмила', 'маргарита', 'раиса', 'юлия', 'полина',
        'дарья', 'инна', 'валерия', 'снежана', 'кристина'
    ];

    for (const femaleName of femaleNames) {
        if (name.includes(femaleName)) {
            return 'female';
        }
    }

    if (name.endsWith('а') || name.endsWith('я')) {
        const maleEndings = ['слав'];
        const isMale = maleEndings.some(ending => name.includes(ending));
        if (!isMale) {
            return 'female';
        }
    }

    return 'male';
};

/**
 * Сравнивает двух участников по стандартной иерархии (для сортировки)
 */
export const compareParticipants = (resA, resB) => {
    const totalsA = getTotals(resA);
    const totalsB = getTotals(resB);

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

/**
 * Мигрирует старые данные в новый формат
 *
 * СТАРОЕ: { top: 1, zone1: 1, zone2: 1, attempts_top: 2, attempts_zone1: 3, attempts_zone2: 4 }
 * НОВОЕ: { top: 2, zone1: 3, zone2: 4 }
 *
 * (берём значения попыток как новые значения)
 */
export const migrateOldData = (oldResults) => {
    const newResults = {};

    Object.keys(oldResults).forEach(participantId => {
        const oldParticipantData = oldResults[participantId];

        if (!oldParticipantData.routes) {
            // Совсем старый формат (до routes)
            newResults[participantId] = {
                routes: Array(8).fill({})
            };
            return;
        }

        // Проверяем, нужна ли миграция (если есть attempts_ поля)
        const needsMigration = oldParticipantData.routes.some(route =>
            route && (route.attempts_top !== undefined || route.attempts_zone1 !== undefined || route.attempts_zone2 !== undefined)
        );

        if (!needsMigration) {
            // Уже в новом формате
            newResults[participantId] = oldParticipantData;
            return;
        }

        // Мигрируем: берём attempts как новые значения
        newResults[participantId] = {
            routes: oldParticipantData.routes.map(route => {
                if (!route) return {};
                return {
                    top: route.attempts_top || 0,
                    zone1: route.attempts_zone1 || 0,
                    zone2: route.attempts_zone2 || 0,
                };
            })
        };
    });

    return newResults;
};