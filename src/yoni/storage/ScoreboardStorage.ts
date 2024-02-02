export class ScoreboardStorage {
    getIdIndex(identifier: string): number {
        let normalizedIdentifier = "§§" + identifier;
        let result = ScoreboardStorage.#indexObjective.getScore(normalizedIdentifier);
        
        if (result !== undefined){
            return result;
        }
        
        result = ScoreboardStorage.#indexObjective.getScore("curIndex") ?? 0;
        
        ScoreboardStorage.#indexObjective.addScore("curIndex", 1);
        
        ScoreboardStorage.#indexObjective.setScore(normalizedIdentifier, result);
        
        return result;
    }
}