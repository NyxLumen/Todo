export default class Todo {
	constructor({
		title,
		description = "",
		dueDate = null,
		priority = "normal",
	}) {
		this.id = crypto.randomUUID();
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.priority = priority;
		this.completed = false;
		this.createdAt = Date.now();
	}
}
