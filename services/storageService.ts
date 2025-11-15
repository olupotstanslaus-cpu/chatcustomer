// A regex to match ISO 8601 date strings
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

/**
 * A reviver function for JSON.parse to convert ISO date strings back into Date objects.
 * @param key The current key being parsed.
 * @param value The current value for the key.
 * @returns The original value, or a new Date object if the value is a valid ISO date string.
 */
function dateReviver(key: string, value: any): any {
    if (typeof value === 'string' && isoDateRegex.test(value)) {
        return new Date(value);
    }
    return value;
}

/**
 * Loads state from localStorage and parses it as JSON.
 * @param key The key to retrieve from localStorage.
 * @returns The parsed state, or undefined if the key is not found or an error occurs.
 */
export const loadState = <T>(key: string): T | undefined => {
    try {
        const serializedState = localStorage.getItem(key);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState, dateReviver);
    } catch (err) {
        console.error("Could not load state from localStorage", err);
        return undefined;
    }
};

/**
 * Saves state to localStorage after serializing it to a JSON string.
 * @param key The key to save the state under in localStorage.
 * @param state The state to save.
 */
export const saveState = <T>(key: string, state: T): void => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(key, serializedState);
    } catch (err) {
        console.error("Could not save state to localStorage", err);
    }
};
