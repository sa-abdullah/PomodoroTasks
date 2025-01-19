const counterOptionButtons = document.querySelectorAll(".counter_option");
const podomoroCount = document.getElementById("podomoro");
const shortBreakCount = document.getElementById("short_break");
const longBreakCount = document.getElementById("long_break");
const timeCounter = document.getElementById("time_counter");
const startButton = document.getElementById("start_button");

const nextButton = document.getElementById("next_button");
const roundsNumber = document.getElementById("round_count_num")

let timerInterval = null
let isPaused = true

let taskData = []
let taskDataHasVal = false

// MAIN COUNTER FUNCTION. 
const timerFuncContainer = () => {

    const timeFormat = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    const countUpdate = () => {
        timeCounter.innerHTML = timeFormat(timeSetInSec)
    }
    
    let timeSet = parseFloat(timeCounter.innerHTML.trim())
    let timeSetInSecTotal = timeSet * 60;
    let timeSetInSec = timeSetInSecTotal
    timerInterval = null
    let isPaused = true
    let startTime = 0
    let timeLeft = timeSetInSecTotal

    const startCount = () => {

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null
        }

        if (isPaused) {
            // Resuming the timer
            startTime = Date.now();
            timeSetInSec = timeLeft;
        }


        timerInterval = setInterval(() => {
            if (timeSetInSec > 0) {
                timeSetInSec--
                countUpdate();
                startButton.innerHTML = "PAUSE"
                isPaused = false
                

            } else {
                clearInterval(timerInterval)
                timerInterval = null
                startButton.innerHTML = "START"
                isPaused = true

                if (timeSetInSec === 0 ) {
                    moveToNextTask()
                } 
                
            }
            
        }, 1000) 
        
    }

    const pauseTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            timeLeft -= elapsed;
            startButton.innerHTML = "START";
            isPaused = true;
        }
    }
    

    startButton.addEventListener("click", () => {

        if (isPaused) {
            startCount();
            nextButton.classList.add("show_next_button");

        } else {
            pauseTimer();
        }
    })
}

let countround = 1



// console.log(renderPomo())
const moveToNextTask = () => {

    if (podomoroCount.dataset.clicked === "true") {            
        tabChangeResetTimer(shortBreakCount)
        updateCurrentPomo()

        if  (countround === 4) {
            tabChangeResetTimer(longBreakCount)
        }

        setTimeout(() => {
            alert("Time to take a rest");
          }, 500)
        
        
    } else if (shortBreakCount.dataset.clicked === "true") {
        tabChangeResetTimer(podomoroCount)
        countround++
        roundsNumber.innerHTML = countround

        setTimeout(() => {
            alert("Time to get back to work")
          }, 500)
        
        

    } else if (longBreakCount.dataset.clicked === "true") { 
        tabChangeResetTimer(podomoroCount)
        countround++
        roundsNumber.innerHTML = countround

        setTimeout(() => {
            alert("Time to get back to work")
          }, 500)
    }

    changeTab()
    timerFuncContainer()
}


nextButton.addEventListener("click", () => {
    moveToNextTask()
})


const tabChangeResetTimer = (clickedTab) => {
    podomoroCount.dataset.clicked = "false";
    shortBreakCount.dataset.clicked = "false";
    longBreakCount.dataset.clicked = "false";
    clickedTab.dataset.clicked = "true" 
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = true
}

const changeTab = () => {
    const updateTab = (time, activeTab, otherTabs) => {
        timeCounter.innerHTML = time; 
        activeTab.classList.add("currentCountTab");
        otherTabs.forEach((tab) => tab.classList.remove("currentCountTab"));
    }

    const roundsTaskText = document.getElementById("round_task_text");

    if (podomoroCount.dataset.clicked === "true") {
        updateTab("25:00", podomoroCount, [shortBreakCount, longBreakCount])
        roundsTaskText.innerHTML = "Time to focus!"
        startButton.innerHTML = "START"
        nextButton.classList.remove("show_next_button")
    }
    
    else if (shortBreakCount.dataset.clicked === "true") {
        updateTab("5:00", shortBreakCount, [podomoroCount, longBreakCount])
        roundsTaskText.innerHTML = "Time for a break" 
        startButton.innerHTML = "START"
        nextButton.classList.remove("show_next_button")
    }

    else if (longBreakCount.dataset.clicked === "true") {
        updateTab("15:00", longBreakCount, [shortBreakCount, podomoroCount])
        roundsTaskText.innerHTML = "Time for a break"
        startButton.innerHTML = "START"
        nextButton.classList.remove("show_next_button")
    }

    return
}




podomoroCount.addEventListener("click", () => {
    tabChangeResetTimer(podomoroCount)
    changeTab()
    timerFuncContainer()

})

shortBreakCount.addEventListener("click", () => {
    tabChangeResetTimer(shortBreakCount)
    changeTab()
    timerFuncContainer()
})

longBreakCount.addEventListener("click", () => {
    tabChangeResetTimer(longBreakCount)
    changeTab()
    timerFuncContainer()
});

tabChangeResetTimer(podomoroCount)
changeTab();
timerFuncContainer();





// TASKS TAB FUNCTION 

const addTaskBtn = document.getElementById("add_task")
const tasksTab = document.getElementById("tasks_tab")
const closeTab = document.getElementById("close_tasks_tab")
const saveTasks = document.getElementById("save_tasks")
const deleteTasks = document.getElementById("delete_tasks_tab")

const addNote = document.getElementById("add_note");
const addNoteBtn = document.getElementById("add_note_btn")

const taskTitle = document.getElementById("task_title")
const estPomodoros = document.getElementById("est_pomodoros")

const addedTasksContainer = document.getElementById("added_tasks_container")

let currentTask = {}


addTaskBtn.addEventListener("click", () => {
    tasksTab.classList.remove("hide_tasks_tab")
    // const addedTasks = document.querySelectorAll(".added_tasks")
    // addedTasks.forEach(task => task.classList.remove("clicked"))
})

let isClicked = false

const saveAndUpdateTask = () => {

    const addedTasks = document.querySelectorAll(".added_tasks")

    const taskArrIndex = taskData.findIndex((item) => item.id === currentTask.id)
    console.log(currentTask.id)
    const taskObj = {
        id: `${taskTitle.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
        titleVal: taskTitle.value.trim(),
        pomodoroVal: estPomodoros.value ? estPomodoros.value : 1, 
        noteVal: addNote.value.trim(),
        
    }


    console.log(taskObj)

    if (taskArrIndex === -1) {
        taskData.unshift(taskObj)
        
    } else {
        taskData[taskArrIndex] = taskObj
    }
    console.log(taskData)

    // localStorage.setItem("data", JSON.stringify(taskData))
    addTaskContainerFunc()
    reset()

    totalTaskTimeFunc(taskData).addToTotalPomo()

    taskDataHasVal = taskData.length > 0 ? true : false
    console.log(taskDataHasVal)
}



const removeTaskAfterAdd = () => {
    addedTasksContainer.querySelectorAll("ul").forEach((ul) => ul.remove());
}


const addTaskContainerFunc = () => {

    removeTaskAfterAdd()

    taskData.forEach(({id, titleVal, pomodoroVal, noteVal,}) => {
        
        const addedTaskUl = document.createElement("ul")
        const taskItem = document.createElement("li");
        taskItem.className = "added_tasks"
        taskItem.id = id
        
        const taskItemTitle = document.createElement("div")
        taskItemTitle.id = "added_title_container"

        const titleIcon = document.createElement("i")
        titleIcon.className= "fa fa-check-circle" 
        
        const titleText = document.createElement("p")
        titleText.textContent = titleVal


        const taskEstContainer = document.createElement("div")
        taskEstContainer.id = "added_est_container"
        taskEstContainer.innerHTML = (`
            <p><span id="current_pomo">0</span>/<span>${pomodoroVal ? pomodoroVal : "1"}</span></p>
            <button id="return_to_task_btn" onclick="editTask(this)"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></button>
            `)
        
        addedTaskUl.appendChild(taskItem)
        taskItem.appendChild(taskItemTitle)
        taskItem.appendChild(taskEstContainer)

        taskItemTitle.appendChild(titleIcon)
        taskItemTitle.appendChild(titleText)

        addedTasksContainer.appendChild(addedTaskUl)

        isTaskDone()
    })

    
    const addedTasks = document.querySelectorAll(".added_tasks")


    addedTasks.forEach((task) => {
        task.style.display = "flex";

        task.addEventListener("click", () => {
            // Remove the .clicked class from all other tasks
            addedTasks.forEach((otherTask) => {
                otherTask.classList.remove("clicked");
                otherTask.style.backgroundColor = ""; // Reset background color
            });

            // Toggle the .clicked class on the clicked task
            if (task.classList.contains("clicked")) {
                task.classList.remove("clicked");
                task.style.backgroundColor = ""; // Remove highlight
            } else {
                task.classList.add("clicked");
                task.style.backgroundColor = "lightblue"; // Highlight clicked task
            }
        });
    });

    

    
    // addedTasks.forEach((task) => {
    //     task.style.display = "flex"

    //     if (addedTasks.length === 1) {
    //         isClicked = true 
    //         task.style.backgroundColor = "lightblue"
    //     } else {

    //         task.addEventListener("click", () => {
    //             if (isClicked) {
    //                 task.style.backgroundColor = "lightblue"
    
    //             } else {
    //                 task.style.backgroundColor = ""

    //             }
    //         })

    //         task.addEventListener("click", () => {
    //             addedTasks.forEach((otherTask) => {
    //                 if (task && (otherTask !== task)) {
    //                     otherTask.style.backgroundColor = "";
    //                 }
    //             })
    //             let notClicked = !isClicked

    //             let getClicked = isClicked;
    //             isClicked = notClicked;
    //             notClicked = getClicked;
    //         })
    
    //         isClicked = !isClicked
    
    //     }
        
    // })

}



saveTasks.addEventListener("click", () => {
    let taskTitleVal = taskTitle.value.trim()
    if (taskTitleVal !== "") {
        tasksTab.classList.toggle("hide_tasks_tab")
        saveAndUpdateTask()
        totalTaskTime.style.display = "flex"
    }
        
})


closeTab.addEventListener("click", (e) => {

    let titleVal = taskTitle.value.trim()
    const addedTasks = document.querySelectorAll(".added_tasks")
    addedTasks.forEach((task) => task.style.display = "flex")

    if (!isEditing || !titleVal.trim() === "") {
        let confirmCloseTab = confirm("The input data will be lost. Are you sure you want to close it?")

        if (confirmCloseTab) {
            tasksTab.classList.toggle("hide_tasks_tab")
            reset()
        }


    } else {

        tasksTab.classList.toggle("hide_tasks_tab")
    }
     
    isEditing = true
    reset()
})

addNoteBtn.addEventListener("click", () => {
    addNote.style.display = "block"
})

let isEditing = false
const editTask = (buttonEl) => {

    tasksTab.classList.toggle("hide_tasks_tab")
    deleteTasks.style.display = "block"


    const grandParent = buttonEl.parentElement.parentElement;

    const taskId = grandParent.id
    const taskArrIndex = taskData.findIndex((item) => item.id === taskId)
    grandParent.style.display = "none"

    if (taskArrIndex === -1) {
        return
    }    

    currentTask = taskData[taskArrIndex]
    console.log(currentTask)
    taskTitle.value = currentTask.titleVal
    estPomodoros.value = currentTask.pomodoroVal
    addNote.value = currentTask.noteVal
    isEditing = true 
    grandParent.classList.add("clicked")


    deleteTasks.onclick = () => taskDelete(taskId);


}


const taskDelete = (taskId) => {
    const taskArrIndex = taskData.findIndex((item) => item.id === taskId)
    if (taskArrIndex === -1) {
        return
    }

    taskData.splice(taskArrIndex, 1)
    const taskToDelete = document.getElementById(taskId)

    if (taskToDelete) {
        taskToDelete.remove()
        totalTaskTimeFunc(taskData).removeFromTotalPomo(taskId)
        totalTaskTimeFunc(taskData).addToTotalPomo()

    }

    reset()
    tasksTab.classList.add("hide_tasks_tab");
    deleteTasks.style.display = "none"


}




const reset = () => {
    taskTitle.value = "";
    estPomodoros.value = "";
    addNote.value = ""
    currentTask = {}
}



const taskForm = document.getElementById("task_form");
taskForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveAndUpdateTask()
})

let taskIsDone = false 

const isTaskDone = () => {
    // const checkTaskBtn = document.querySelector("#added_title_container i")
    // const taskTitle = document.querySelector("#added_title_container p")

    const addedTasks = document.querySelectorAll(".added_tasks")
    // let current = btn.closest(".added_tasks").contains(".clicked")
    addedTasks.forEach((task) => {
        const checkTaskBtn = task.querySelector("#added_title_container i")
        const taskTitle = task.querySelector("#added_title_container p")

        checkTaskBtn.addEventListener("click", () => {
            if (taskIsDone) {
                taskTitle.style.textDecoration = "none"
            } else {
                taskTitle.style.textDecoration = "line-through"
            }

            taskIsDone = !taskIsDone
        })
    })

    // checkTaskBtn.addEventListener("click", () => {
    //     checkTaskBtn.closest(".added_tasks").contains(".clicked")

    //     if (taskIsDone) {
    //         taskTitle.style.textDecoration = "none"
    //     } else {
    //         taskTitle.style.textDecoration = "line-through" 
    //     }

    //     taskIsDone = !taskIsDone
    // })
}






const totalTaskTime = document.getElementById("total_task_time")

let totalPomo 
const totalTaskTimeFunc = (taskData) => {
    // currentPomo = 0
    // finishTime = 0
    // estTime = 0

    const addToTotalPomo = () => {
        totalPomo = 0
        taskData.forEach((task) => {
            totalPomo += Number(task.pomodoroVal)
            console.log(totalPomo)
        })

        const totalPomoDisplay = document.getElementById("totalP");
        
        totalPomoDisplay.textContent = totalPomo; 
        return totalPomo
    }

    const removeFromTotalPomo = (taskId) => {
        taskData.forEach((task) => {
            
            if ((task.id === taskId) && !isNaN(totalPomo)) {
                totalPomo -= Number(pomoToRemove.pomodoroVal)
                totalPomoDisplay.textContent = totalPomo;
                
            } else {
                totalPomo
            }
            return totalPomo
        }) 

    }

    if (taskData.length === 0) {
        totalTaskTime.style.display = "none"
    }

    return {
        addToTotalPomo,
        removeFromTotalPomo,
    };

}


// let currentPomo = 10

console.log(taskData)
const updateCurrentPomo = () => {
    const addedTasks = document.querySelectorAll(".added_tasks")
    let currentPomo = 0

        addedTasks.forEach((task) => {
            if(task.classList.contains("clicked")) {
                currentPomo++
                const currentPomoElement = task.querySelector("#added_est_container p #current_pomo") 
                let currPomoValue = Number(currentPomoElement.textContent)
                currPomoValue += currentPomo 
                console.log(typeof currPomoValue) 

                currentPomoElement.innerHTML =  currPomoValue  
            }
            
        }) 
        console.log(currentPomo)
        console.log(typeof currentPomo)
        const currentPomoElement = document.querySelector("#current_pomo");

        
    return 
};



console.log(updateCurrentPomo())




// const updateCurrentPomo = () => {

//     currentPomoVal.innerHTML = currentPomo
//     return currentPomoVal
// }


































// SETTINGS TAB FUNCTION 

const openSettingBtn = document.getElementById("setting")
const settingTab = document.getElementById("setting_tab")
const closeSettingBtn = document.getElementById("close_setting")

openSettingBtn.addEventListener("click", () => {
    settingTab.showModal()
})

closeSettingBtn.addEventListener("click", () => {
    settingTab.close()
})


const settingFunc = () => {
    
}






