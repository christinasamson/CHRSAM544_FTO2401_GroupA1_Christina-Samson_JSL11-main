// TASK: import helper functions from utils
import { getTasks, createNewTask, patchTask, deleteTask } from './utils/taskFunctions.js'; // Or: import { getTasks, createNewTask, patchTask, deleteTask } from './utils/taskFunctions.js';
// TASK: import initialData
import { initialData } from './initialData.js';


/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage

localStorage.clear()
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSidebar', true); // Corrected key name and set boolean value
  } else {
    console.log('Data already exists in localStorage');
  }
}

initializeData();


// TASK: Get elements from the DOM
const elements = {
  headerBoardName: document.getElementById('header-board-name'),
  hideSideBarBtn: document.getElementById('hide-side-bar-btn'),
  showSideBarBtn: document.getElementById('show-side-bar-btn'),
  themeSwitch: document.getElementById('switch'),
  createNewTaskBtn: document.getElementById('add-new-task-btn'),
  modalWindow: document.getElementById('new-task-modal-window'),
  editTaskModal: document.querySelector('.edit-task-modal-window'),
  cancelEditBtn: document.getElementById('cancel-edit-btn'),
  cancelAddTaskBtn: document.getElementById('cancel-add-task-btn'),
  filterDiv: document.getElementById('filterDiv'),

  
  createTaskBtn: document.getElementById("create-task-btn"),
  columnDivs: document.querySelectorAll('.column-div')

};

let activeBoard = "";

// Extracts unique board names from tasks
// TASK: FIX BUGS

function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    activeBoard = JSON.parse(localStorage.getItem("activeBoard")) || boards[0];
    elements.headerBoardName.textContent = activeBoard;
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs

function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", () => { 
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board; 
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
      styleActiveBoard(activeBoard);
    });
    boardsContainer.appendChild(boardElement);
  });
}



//Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs

function filterAndDisplayTasksByBoard(boardName) {
  const filteredTasks = getTasks().filter(task => task.board === boardName);

  elements.columnDivs.forEach(column => {
    const status = column.dataset.status;
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status === status).forEach(task => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.dataset.taskId = task.id;
      taskElement.addEventListener("click", () => openEditTaskModal(task));

      tasksContainer.appendChild(taskElement);
    });
  });
}
  

function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll('.board-btn').forEach(btn => { 
    if (btn.textContent === boardName) {
      btn.classList.add('active'); 
    } else {
      btn.classList.remove('active'); 
    }
  });
}



function addTaskToUI(task) {
  const column = document.querySelector(`.column-div[data-status="${task.status}"]`);
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('.tasks-container');
  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement('div');
  taskElement.className = 'task-div';
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);
  
  tasksContainer.appendChild(taskElement);
}




function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener('click', () => toggleModal(false, elements.editTaskModal)); 
};


  // Cancel adding new task event listener*
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it*
  elements.filterDiv.addEventListener('click', (event) => {
    if (event.target === elements.filterDiv) {
      toggleModal(false);
      elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
    }
  });
  

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener('click', () => toggleSidebar(false));
  elements.showSideBarBtn.addEventListener('click', () => toggleSidebar(true));


  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });
  
  elements.modalWindow.addEventListener('submit', (event) => {
    addTask(event);
  });
  
  

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? 'block' : 'none'; 
}


/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); 

  //Assign user input to the task object
  function addTask(event) {
    event.preventDefault(); 
  
    // Get task details from the form
    const title = document.getElementById('title-input').value;
    const description = document.getElementById('desc-input').value;
    const status = document.getElementById('select-status').value;
  
    // Create task object with user input
    const task = {
      title: title,
      description: description,
      status: status
    };
    
    // Create new task element
    const newTask = createNewTask(task);
    
    // Add the new task element to the UI
    if (newTask) {
      addTaskToUI(newTask);
      toggleModal(false);
      elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
      event.target.reset(); // Reset the form
      refreshTasksUI();
    }
  }
}


function toggleSidebar(show) {
   const sidebarElement = document.getElementById('side-bar-div');


  if (show) {
    sidebarElement.style.display = 'block';
    elements.showSideBarBtn.style.display = "none";
    //sidebarElement.appendChild(svgElement);
  } else {
    sidebarElement.style.display = 'none';
    elements.showSideBarBtn.style.display = "block";
    // sidebarElement.removeChild(svgElement);
  }

  localStorage.setItem('showSideBar', show);
}



function toggleTheme() {
  document.body.classList.toggle('light-theme');
  localStorage.setItem('light-theme', document.body.classList.contains('light-theme') ? 'enabled' : 'disabled');
}



function openEditTaskModal(task) {
  // Set task details in modal inputs
  elements.editTaskTitleInput.value = task.title;
  elements.editTaskDueDateInput.value = task.dueDate;
  elements.editTaskPriorityInput.value = task.priority;
  elements.editTaskDescriptionTextArea.value = task.description;

  // Get button elements from the task modal
  const saveChangesBtn = elements.editTaskModal.querySelector('#save-task-changes-btn');
  const deleteTaskBtn = elements.editTaskModal.querySelector('#delete-task-btn');

  // Call saveTaskChanges upon click of Save Changes button
  saveChangesBtn.onclick = () => saveTaskChanges(task._id);

  // Delete task using a helper function and close the task modal
  deleteTaskBtn.onclick = () => {
    deleteTask(task._id);
    toggleModal(false, elements.editTaskModal);
  };

  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId) {
  // Get new user inputs
  

  // Create an object with the updated task details


  // Update task using a hlper functoin
 

  // Close the modal and refresh the UI to reflect the changes

  refreshTasksUI();
}



document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});f

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}