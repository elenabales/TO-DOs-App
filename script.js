document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const todoList = document.getElementById("todo-tasks");
  const doneList = document.getElementById("done-tasks");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const clearSearchButton = document.getElementById("clear-search");
  const searchedTasksList = document.getElementById("searched-tasks");

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;
    addTask(title, description);
    taskForm.reset();
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim().toLowerCase();
    searchTasks(searchTerm);
  });

  clearSearchButton.addEventListener("click", () => {
    clearSearch();
  });

  function addTask(title, description) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.classList.add("task-checkbox");
    taskItem.appendChild(taskCheckbox);

    const taskText = document.createElement("span");
    taskText.textContent = `${title}: ${description}`;
    taskItem.appendChild(taskText);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-task");
    taskItem.appendChild(deleteButton);

    todoList.insertBefore(taskItem, todoList.firstChild);

    taskCheckbox.addEventListener("change", () => {
      if (taskCheckbox.checked) {
        doneList.insertBefore(taskItem, doneList.firstChild);
        taskText.style.textDecoration = "line-through";
      } else {
        todoList.insertBefore(taskItem, todoList.firstChild);
        taskText.style.textDecoration = "none";
      }
      updateLocalStorage();
    });

    deleteButton.addEventListener("click", () => {
      taskItem.remove();
      updateLocalStorage();
    });

    updateLocalStorage();
  }

  function searchTasks(searchTerm) {
    searchedTasksList.innerHTML = "";

    const allTasks = document.querySelectorAll(".task-item");
    allTasks.forEach((taskItem) => {
      const taskText = taskItem.querySelector("span").textContent.toLowerCase();
      if (taskText.includes(searchTerm)) {
        searchedTasksList.appendChild(taskItem.cloneNode(true));
      }
    });
  }

  function clearSearch() {
    searchedTasksList.innerHTML = "";
    searchInput.value = "";
  }

  function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll(".task-item").forEach((taskItem) => {
      const task = {
        title: taskItem.querySelector("span").textContent.split(":")[0].trim(),
        description: taskItem
          .querySelector("span")
          .textContent.split(":")[1]
          .trim(),
        completed: taskItem.querySelector(".task-checkbox").checked,
      };
      tasks.push(task);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    addTask(task.title, task.description);
    if (task.completed) {
      const lastAddedTask = todoList.firstChild;
      lastAddedTask.querySelector(".task-checkbox").checked = true;
      doneList.insertBefore(lastAddedTask, doneList.firstChild);
      lastAddedTask.querySelector("span").style.textDecoration = "line-through";
    }
  });
});
