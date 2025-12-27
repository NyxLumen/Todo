import state from "../state.js";
import Project from "../models/Project.js";

function createProject(name) {
	const project = new Project(name);
	state.projects.push(project);

	if (!state.activeProjectId) {
		state.activeProjectId = project.id;
	}

	return project;
}

function getProjects() {
	return state.projects;
}

function getActiveProject() {
	return state.projects.find((p) => p.id === state.activeProjectId);
}

function setActiveProject(id) {
	state.activeProjectId = id;
}

export default {
	createProject,
	getProjects,
	getActiveProject,
	setActiveProject,
};
