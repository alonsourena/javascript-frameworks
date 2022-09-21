const taskInput = document.querySelector(".task-input input");
const clearAll = document.querySelector(".clear-btn");
const taskBox = document.querySelector(".task-box")

let editId;
let isEditTask = false;
let tasks = JSON.parse(localStorage.getItem("todo-list"));

function showTodo() {

    let liTag = "";

    if (tasks) {

        tasks.forEach((todo, id) => {

            let completed = todo.status == "completed" ? "checked" : "";

            liTag += `<li class="task">
                        <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                            <p class="${completed}">${todo.name}</p>
                        </label>
                        <div>
                            <button onclick='deleteTask(${id})'>Delete</button>
                        </div>
                    </li>`;

        });
    }

    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}

showTodo();

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        tasks[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        tasks[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(tasks))
}

function deleteTask(deleteId) {
    isEditTask = false;
    tasks.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(tasks));
    showTodo();
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    tasks.splice(0, tasks.length);
    localStorage.setItem("todo-list", JSON.stringify(tasks));
    showTodo()
});

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) {
            tasks = !tasks ? [] : tasks;
            let taskInfo = { name: userTask, status: "pending" };
            tasks.push(taskInfo);
        } else {
            isEditTask = false;
            tasks[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(tasks));
        showTodo();
    }
});