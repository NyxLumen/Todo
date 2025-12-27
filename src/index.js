import "./style.css";
import dom from "./dom.js";
import state from "./state.js";

state.projects = [
	{
		id: crypto.randomUUID(),
		name: "Personal",
		todos: [
			{
				id: crypto.randomUUID(),
				title: "Morning routine",
				description: "Wake, water, stretch, 10 pushups",
				priority: "normal",
				completed: false,
				dueDate: new Date().toISOString(),
			},
			{
				id: crypto.randomUUID(),
				title: "Read 10 pages",
				description: "Atomic Habits / Deep Work",
				priority: "low",
				completed: false,
				dueDate: new Date().toISOString(),
			},
		],
	},
	{
		id: crypto.randomUUID(),
		name: "Build & Code",
		todos: [
			{
				id: crypto.randomUUID(),
				title: "Finish ToDo UI",
				description: "Polish cards & sidebar",
				priority: "high",
				completed: false,
				dueDate: new Date().toISOString(),
			},
		],
	},
];

state.activeProjectId = state.projects[0].id;
state.viewMode = "project";
state.activeView = "all";

dom.render();
