import Todo from "../models/Todo.js";
import projectManager from "./projectManager.js";

function addTodo(data) {
	const project = projectManager.getActiveProject();
	const todo = new Todo(data);
	project.todos.push(todo);
	return todo;
}

function findTodo(id) {
	return projectManager
		.getProjects()
		.flatMap((p) => p.todos)
		.find((t) => t.id === id);
}

function toggleTodo(id) {
	const todo = findTodo(id);
	if (!todo) return;
	todo.completed = !todo.completed;
}

function updateTodo(id, data) {
	const todo = findTodo(id);
	if (!todo) return;
	Object.assign(todo, data);
}

function deleteTodo(id) {
	projectManager.getProjects().forEach((p) => {
		p.todos = p.todos.filter((t) => t.id !== id);
	});
}

function getAllTodos() {
	return projectManager.getProjects().flatMap((p) => p.todos);
}

function getTodayTodos() {
	const today = new Date().toDateString();
	return getAllTodos().filter(
		(t) => t.dueDate && new Date(t.dueDate).toDateString() === today
	);
}

function getWeekTodos() {
	const now = new Date();
	const end = new Date();
	end.setDate(now.getDate() + 7);

	return getAllTodos().filter((t) => {
		if (!t.dueDate) return false;
		const d = new Date(t.dueDate);
		return d >= now && d <= end;
	});
}

function getHighPriorityTodos() {
	return getAllTodos().filter((t) => t.priority === "high");
}

export default {
	addTodo,
	toggleTodo,
	updateTodo,
	deleteTodo,
	getAllTodos,
	getTodayTodos,
	getWeekTodos,
	getHighPriorityTodos,
};
