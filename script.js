let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");

addTaskBtn.addEventListener("click", addTask);

function addTask() {
    const title = document.getElementById("taskTitle").value;
    const date = document.getElementById("taskDate").value;

    if (title === "") {
        alert("Task title cannot be empty!");
        return;
    }

    if (date === "") {
        alert("Please select a deadline!");
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        date: date,
        completed: false,
        overdue: false
    };

    tasks.push(task);
    checkOverdue();
    saveTasks();
    displayTasks();

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDate").value = "";
}

function displayTasks(filteredTasks = tasks) {
    taskList.innerHTML = "";

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        if (task.completed) li.classList.add("completed");
        if (task.overdue) li.style.backgroundColor = "rgba(255,0,0,0.2)"; // مستقیم رنگ قرمز بدون کلاس

        li.innerHTML = `
            <span>${task.title} (${task.date})</span>
            <div>
                <button class="btn btn-success btn-sm me-2" onclick="toggleTask(${task.id})">✔</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">✖</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    checkOverdue();
    saveTasks();
    displayTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    checkOverdue();
    saveTasks();
    displayTasks();
}

function filterTasks(status) {
    if (status === "all") displayTasks();
    else if (status === "completed") displayTasks(tasks.filter(t => t.completed));
    else if (status === "pending") displayTasks(tasks.filter(t => !t.completed));
    else if (status === "overdue") displayTasks(tasks.filter(t => t.overdue));
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function checkOverdue() {
    const today = new Date().toISOString().split("T")[0];
    tasks.forEach(task => {
        if (!task.completed && task.date < today) task.overdue = true;
        else task.overdue = false;
    });
}

// نمایش اولیه
checkOverdue();
displayTasks();
