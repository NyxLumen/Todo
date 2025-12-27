import state from "./state.js";

const KEY = "todo-state";

function save() {
	localStorage.setItem(KEY, JSON.stringify(state));
}

function load() {
	const raw = localStorage.getItem(KEY);
	if (raw) Object.assign(state, JSON.parse(raw));
}

export default { save, load };
