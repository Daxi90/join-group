/**
 * Asynchronously loads contacts from the API into the "contacts" variable.
 * Uses the function "getItem" to retrieve contacts as a JSON string and then parses it.
 * @async
 * @function
 * @throws {Error} Throws an error if fetching contacts from the API fails.
 * @return {Promise<void>}
 */
async function loadContactsFromAPI() {
    try {
        const APIcontacts = JSON.parse(await getItem('contacts'));
        contacts = APIcontacts;
    } catch (error) {
        console.error("An error occurred while loading contacts: ", error);
        throw new Error("Failed to load contacts.");
    }
}


/**
 * Asynchronously loads and renders the contacts tab.
 * Fetches contacts using the "getItem" function, parses the JSON string, 
 * and then calls "renderContactsTab" to display the contacts.
 * @async
 * @function
 * @throws {Error} Throws an error if fetching or parsing contacts fails.
 * @return {Promise<void>}
 */
async function loadContactsTab() {
    try {
        let contacts = await getItem('contacts');  // Fetches contacts from API
        contacts = JSON.parse(contacts);
        renderContactsTab(contacts);
    } catch (error) {
        console.error("An error occurred while loading the contacts tab: ", error);
        throw new Error("Failed to load contacts tab.");
    }
}


/**
 * Asynchronously loads tasks from the API into the "tasks" variable.
 * Uses the function "getItem" to retrieve tasks as a JSON string and then parses it.
 * @async
 * @function
 * @throws {Error} Throws an error if fetching or parsing tasks fails.
 * @return {Promise<Array>} Returns a promise that resolves with the array of tasks.
 */
async function loadTasksFromAPI() {
    try {
        let APItasks = JSON.parse(await getItem('tasks'));
        tasks = APItasks;
        return tasks;
    } catch (error) {
        console.error("An error occurred while loading tasks: ", error);
        throw new Error("Failed to load tasks.");
    }
}