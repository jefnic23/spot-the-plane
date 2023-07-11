export function getGameState() {
    // create empty game state object
    let defaultGameState = {
        'completionTime': 0,
        'status': 'not_started', 
        'rgb': [],
        'data': [],
        'images': [],
        'day': 0
    };
    // check to see if game state object exists in local storage
    let storedGameState = localStorage.getItem('game_state');
    // return stored game state if it exists, otherwise return default game state
    return storedGameState ? JSON.parse(storedGameState) : defaultGameState;
}

export function setGameState(gameState) {
    return localStorage.setItem('game_state', JSON.stringify(gameState));
}

export function resetGameState(data, images, day) {
    return {
        'completionTime': '',
        'status': 'in_progress', 
        'rgb': [],
        'data': data,
        'images': images,
        'day': day
    }
}

export function getStatistics() {
    // create empty statistics object
    let defaultStatistics = {
        'daysPlayed': 0, 
        'totalGameTime': 0, 
        'avgTime': 0, 
        'bestTime': null, 
        'lastPlayed': 'Never'
    };
    // check to see if statistics object exists in local storage
    let storedStatistics = localStorage.getItem('statistics');
    // return stored statistics if it exists, otherwise return default statistics
    // older versions might need another condition: !JSON.parse(storedStatistics).avgTimePerQuestion
    return storedStatistics ? JSON.parse(storedStatistics) : defaultStatistics;
}

export function setStatistics(statistics) {
    return localStorage.setItem('statistics', JSON.stringify(statistics));
}
