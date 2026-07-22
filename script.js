// Get Elements
const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Add Task
addTaskBtn.addEventListener("click", () => {

    if(taskInput.value.trim() === ""){
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        title: taskInput.value,
        date: dueDate.value,
        priority: priority.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value="";
    dueDate.value="";
    priority.value="Low";

});

// Save to LocalStorage
function saveTasks(){

    localStorage.setItem("tasks",JSON.stringify(tasks));

    displayTasks();

}

// Display Tasks
function displayTasks(){

    taskList.innerHTML="";

    let filteredTasks = tasks;

    if(currentFilter==="active"){
        filteredTasks = tasks.filter(task=>!task.completed);
    }

    if(currentFilter==="completed"){
        filteredTasks = tasks.filter(task=>task.completed);
    }

    const search = searchTask.value.toLowerCase();

    filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(search)
    );

    filteredTasks.forEach(task=>{

        const div=document.createElement("div");

        div.className="task";

        if(task.completed){
            div.classList.add("completed");
        }

        div.innerHTML=`

        <div class="task-info">

            <h3>${task.title}</h3>

            <p>📅 ${task.date || "No Date"}</p>

            <p>⭐ ${task.priority}</p>

        </div>

        <div class="actions">

            <button class="complete-btn" onclick="toggleTask(${task.id})">

                ✔

            </button>

            <button class="edit-btn" onclick="editTask(${task.id})">

                ✏

            </button>

            <button class="delete-btn" onclick="deleteTask(${task.id})">

                🗑

            </button>

        </div>

        `;

        taskList.appendChild(div);

    });

    updateStats();

}

// Toggle Complete
function toggleTask(id){

    tasks=tasks.map(task=>{

        if(task.id===id){

            task.completed=!task.completed;

        }

        return task;

    });

    saveTasks();

}

// Delete Task
function deleteTask(id){

    if(confirm("Delete this task?")){

        tasks=tasks.filter(task=>task.id!==id);

        saveTasks();

    }

}

// Edit Task
function editTask(id){

    const task=tasks.find(task=>task.id===id);

    const newTitle=prompt("Edit Task",task.title);

    if(newTitle!==null && newTitle.trim()!==""){

        task.title=newTitle;

        saveTasks();

    }

}

// Statistics
function updateStats(){

    totalTasks.textContent=tasks.length;

    activeTasks.textContent=tasks.filter(task=>!task.completed).length;

    completedTasks.textContent=tasks.filter(task=>task.completed).length;

}

// Search
searchTask.addEventListener("keyup",displayTasks);

// Filter
document.querySelectorAll(".filter-btn").forEach(button=>{

    button.addEventListener("click",()=>{

        document.querySelectorAll(".filter-btn").forEach(btn=>btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter=button.dataset.filter;

        displayTasks();

    });

});

// Load Tasks
displayTasks();