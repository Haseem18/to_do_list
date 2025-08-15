const toDoForm = document.querySelector("form");
const userTaskContainer = document.querySelector(".user_task_container");
const taskBar = document.querySelector(".task_bar img");
const inputElement = document.querySelector("input");

const tasksList = [];

const recognition = new SpeechRecognition();
recognition.lang = 'en-US'; 
recognition.continuous = false;
recognition.interimResults = false; 

taskBar.addEventListener("click", () => {
    recognition.start();
    inputElement.value = "Listening...";
})

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputElement.value = transcript;
    inputElement.focus();
};

recognition.onerror = (event) => {
    output.textContent = "Error: " + event.error;
};

const warnMessage = (msg) => {
    if (document.querySelector(".warn_msg")) return;

    const warnElement = document.createElement("p");
    warnElement.classList.add("warn_msg");
    warnElement.textContent = msg;
    
    setTimeout(() => {
        warnElement.remove();
    }, 3000);

    toDoForm.insertAdjacentElement("beforebegin", warnElement);
}

const renderTask = (task) => {
    tasksList.push(task);

    const userTaskElm = document.createElement("li");
    userTaskElm.classList.add("user_task");

    const taskElement = document.createElement("p");
    taskElement.classList.add("task");
    taskElement.textContent = task;

    const btnsElement = document.createElement("div");
    btnsElement.classList.add("btns");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit_btn");
    editBtn.textContent = "Edit";
    userTaskElm.append(taskElement);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete_btn");
    deleteBtn.textContent = "Delete";

    btnsElement.append(editBtn, deleteBtn)

    userTaskElm.appendChild(btnsElement)
    userTaskContainer.appendChild(userTaskElm);

    inputElement.value = "";
}

const saveEdittedTask = (element, taskText) => {
    const oldTextIndex = tasksList.indexOf(oldText);
    tasksList[oldTextIndex]  = taskText.textContent;

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit_btn");
    editBtn.textContent = "Edit";

    taskText.removeAttribute("contenteditable");
    taskText.classList.remove("edit");

    console.log(element.parentElement);
    console.log(element.parentElement.firstElementChild)
    
    element.parentElement.replaceChild(editBtn, element.parentElement.firstElementChild)
}

const getTask = (event) => {
    event.preventDefault();

    const data = new FormData(toDoForm);
    const { task } = Object.fromEntries(data.entries());

    const inpuTask = task.trim().toLowerCase();
    if (!inpuTask) {
        warnMessage("Do not leave task empty");
        return;
    }

    const isDuplicateTask = tasksList.some((userTask) => userTask.toLowerCase() === task.toLowerCase());
    
    if (isDuplicateTask) {
        warnMessage("Do not add duplicate task")
        return;
    }
    
    renderTask(task.trim());
}

toDoForm.addEventListener("submit", getTask);

let oldText = "";

userTaskContainer.addEventListener("click", (event) => {
    const element = event.target;
    const taskText = element.parentElement.parentElement.firstElementChild;
    
    if (element.tagName === "BUTTON") {
        if (element.classList.contains("delete_btn")) {
            const teaskIndex = tasksList.indexOf(taskText.textContent);
            tasksList.splice(teaskIndex, 1);
            element.parentElement.parentElement.remove();
            return;
        }

        if (element.classList.contains("edit_btn")) {
            taskText.setAttribute("contenteditable", "true");
            taskText.classList.add("edit");
            const range = document.createRange();
            const selection = window.getSelection();

            range.selectNodeContents(taskText);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
            
            taskText.focus();
            
            const saveBtn = document.createElement("button");
            saveBtn.classList.add("save_btn");
            saveBtn.textContent = "Save";

            oldText = taskText.textContent;
            console.log(oldText);
            
            
            element.parentElement.replaceChild(saveBtn, element.parentElement.firstElementChild)
            return;
        }

        if (element.classList.contains("save_btn")) {
            saveEdittedTask(element, taskText);
        }
    }

    if (element.classList.contains("task")) {
        element.addEventListener("keydown", (event) => {    
            if (event.key === "Enter") {
                const oldTextIndex = tasksList.indexOf(oldText);                
                if (oldTextIndex >= 0) {
                    tasksList[oldTextIndex]  = element.textContent;
                }
                
                const editBtn = document.createElement("button");
                editBtn.classList.add("edit_btn");
                editBtn.textContent = "Edit";

                element.removeAttribute("contenteditable");
                element.classList.remove("edit");
                
                element.nextElementSibling.replaceChild(editBtn, element.nextElementSibling.firstElementChild)
            }
        })
    }
})