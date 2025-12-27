import state from "./state.js";
import todoManager from "./managers/todoManager.js";
import storage from "./storage.js";
import projectManager from "./managers/projectManager.js";

function render() {
	const app = document.getElementById("app");

	let todos = [];
	let title = "";

	if (state.viewMode === "project") {
		const project = state.projects.find((p) => p.id === state.activeProjectId);

		if (!project) {
			todos = [];
			title = "No Project";
		} else {
			todos = project.todos;
			title = project.name;
		}
	} else {
		if (state.activeView === "all") todos = todoManager.getAllTodos();
		if (state.activeView === "today") todos = todoManager.getTodayTodos();
		if (state.activeView === "week") todos = todoManager.getWeekTodos();
		if (state.activeView === "high") todos = todoManager.getHighPriorityTodos();
		title = state.activeView.toUpperCase();
	}

	app.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <h2>Smart Sort</h2>
        <ul id="smartViews">
          <li data-view="all">All</li>
          <li data-view="today">Today</li>
          <li data-view="week">This Week</li>
          <li data-view="high">High Priority</li>
        </ul>

        <h2>Projects</h2>
        <ul id="projectList">
          ${state.projects
						.map(
							(p) => `
            <li data-id="${p.id}" class="${
								p.id === state.activeProjectId ? "active" : ""
							}">
              <span class="proj-name">${p.name}</span>
              <button class="proj-del">×</button>
            </li>
          `
						)
						.join("")}
        </ul>
        <button id="newProject">+ New Project</button>
      </aside>

      <main class="main">
        <div class="header">
          <h1>${title}</h1>
          <button id="openTaskModal">+ New Task</button>
        </div>

        <div class="card-grid">
          ${todos
						.map(
							(t) => `
            <div class="todo-card ${t.completed ? "done" : ""}" data-id="${
								t.id
							}">
              <div class="card-row top">
                <input type="checkbox" ${
									t.completed ? "checked" : ""
								} data-id="${t.id}">
                <span class="priority ${t.priority}">${t.priority}</span>
              </div>

              <div class="card-row body">
                <h3>${t.title}</h3>
                <p>${t.description || "No description"}</p>
                ${
									t.dueDate
										? `<small>Due: ${new Date(
												t.dueDate
										  ).toLocaleDateString()}</small>`
										: ""
								}
              </div>

              <div class="card-row actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
              </div>
            </div>
          `
						)
						.join("")}
        </div>

        ${modalHTML()}
      </main>
    </div>
  `;

	document.querySelectorAll("#smartViews li").forEach((li) => {
		li.onclick = () => {
			state.viewMode = "smart";
			state.activeView = li.dataset.view;
			render();
		};
	});

	document.querySelectorAll("#projectList li").forEach((li) => {
		li.onclick = () => {
			state.viewMode = "project";
			projectManager.setActiveProject(li.dataset.id);
			storage.save();
			render();
		};
	});

	document.querySelectorAll(".proj-del").forEach((btn) => {
		btn.onclick = (e) => {
			e.stopPropagation();
			const id = btn.parentElement.dataset.id;
			state.projects = state.projects.filter((p) => p.id !== id);
			if (state.activeProjectId === id)
				state.activeProjectId = state.projects[0]?.id || null;
			storage.save();
			render();
		};
	});

	document.getElementById("newProject").onclick = () => {
		showProjectModal();
	};

	document.getElementById("openTaskModal").onclick = () => showTaskModal();

	document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
		cb.onchange = () => {
			todoManager.toggleTodo(cb.dataset.id);
			storage.save();
			render();
		};
	});

	document.querySelectorAll(".delete").forEach((btn) => {
		btn.onclick = (e) => {
			const id = e.target.closest(".todo-card").dataset.id;
			todoManager.deleteTodo(id);
			storage.save();
			render();
		};
	});

	document.querySelectorAll(".edit").forEach((btn) => {
		btn.onclick = (e) => {
			const id = e.target.closest(".todo-card").dataset.id;
			showTaskModal(id);
		};
	});
}

function modalHTML() {
	return `
    <div class="modal hidden" id="appModal">
      <div class="modal-box">
        <h3 id="modalTitle">New Task</h3>

        <div id="taskFields">
          <input id="title" placeholder="Title">
          <input id="desc" placeholder="Description">
          <input type="date" id="dueDate">
          <select id="priority">
            <option value="low">Low</option>
            <option value="normal" selected>Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <div id="projectFields" style="display:none">
          <input id="projectName" placeholder="Project name">
        </div>

        <div class="modal-actions">
          <button id="saveModal">Save</button>
          <button id="closeModal">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function showTaskModal(editId = null) {
	const modal = document.getElementById("appModal");
	const isEdit = !!editId;
	document.getElementById("modalTitle").textContent = isEdit
		? "Edit Task"
		: "New Task";

	document.getElementById("taskFields").style.display = "block";
	document.getElementById("projectFields").style.display = "none";

	if (isEdit) {
		const todo = todoManager.getAllTodos().find((t) => t.id === editId);
		document.getElementById("title").value = todo.title;
		document.getElementById("desc").value = todo.description;
		document.getElementById("priority").value = todo.priority;
		document.getElementById("dueDate").value = todo.dueDate || "";
	}

	modal.classList.remove("hidden");

	document.getElementById("saveModal").onclick = () => {
		const title = document.getElementById("title").value;
		const description = document.getElementById("desc").value;
		const priority = document.getElementById("priority").value;
		const dueDate = document.getElementById("dueDate").value;

		if (!title) return;

		if (isEdit) {
			todoManager.updateTodo(editId, { title, description, priority, dueDate });
		} else {
			todoManager.addTodo({ title, description, priority, dueDate });
		}

		storage.save();
		modal.classList.add("hidden");
		render();
	};

	document.getElementById("closeModal").onclick = () =>
		modal.classList.add("hidden");
}

function showProjectModal() {
	const modal = document.getElementById("appModal");
	document.getElementById("modalTitle").textContent = "New Project";

	document.getElementById("taskFields").style.display = "none";
	document.getElementById("projectFields").style.display = "block";

	modal.classList.remove("hidden");

	document.getElementById("saveModal").onclick = () => {
		const name = document.getElementById("projectName").value;
		if (!name) return;
		projectManager.createProject(name);
		storage.save();
		modal.classList.add("hidden");
		render();
	};

	document.getElementById("closeModal").onclick = () =>
		modal.classList.add("hidden");
}

export default { render };
