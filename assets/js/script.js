const taskTitleInput = document.getElementById('task-title');
const dueDateInput = document.getElementById('due-date');
const taskDescInput = document.getElementById('task-desc');
const addTaskButton = document.getElementById('add-task-btn');
const closeModalBtns = document.querySelectorAll('.close');
const modal = document.getElementById('formModal');
const todoCards = document.getElementById('todo-cards');
const ipCards = document.getElementById('in-progress-cards');
const doneCards = document.getElementById('done-cards');

$('#due-date').datepicker({
    changeMonth: true,
    changeYear: true,
});

closeModalBtns.forEach(function(closeBtn) { 
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        modalBackdrop.parentNode.removeChild(modalBackdrop);
    });
});

let savedTasks = [];

const storedTasks = localStorage.getItem('tasks'); 

if (storedTasks) {
  savedTasks = JSON.parse(storedTasks); 
}

function createTaskCard(task) {
    if (task && task.title) {
        let bgColorClass = '';
        const daysDifference = dayjs(task.dueDate, 'MMM DD, YYYY').diff(dayjs(), 'day');

        if (daysDifference < 0) {
            bgColorClass = 'bg-danger';
        } else if (daysDifference <= 1) {
            bgColorClass = 'bg-warning';
        } else {
            bgColorClass = 'bg-white';
        }

        const formattedDueDate = dayjs(task.dueDate).format('MMM DD, YYYY'); 

        const card = $(`
            <div class="fullCard card mb-3 ${bgColorClass}">
                <div class="card-header d-flex justify-content-between">
                    <span>${task.title}</span>
                    <button class="btn-delete btn btn-sm btn-danger">Delete</button>
                </div>
                <div class="card-body">
                    <p>Due Date: ${formattedDueDate}</p>
                    <p>Description: ${task.description}</p>
                </div>
            </div>
            `);
            
            card.appendTo(todoCards);
        }
    }
    
function saveSortOrder() {
        const todoOrder = todoSortable.toArray();
        const ipOrder = ipSortable.toArray();
        const doneOrder = doneSortable.toArray();
        const sortOrders = {
            todoOrder: todoOrder,
            ipOrder: ipOrder,
            doneOrder: doneOrder
        };
        localStorage.setItem('sortOrders', JSON.stringify(sortOrders));
}
    
function applySavedSortOrder() {
        const savedSortOrders = JSON.parse(localStorage.getItem('sortOrders'));
        if (savedSortOrders) {
            todoSortable.sort(savedSortOrders.todoOrder);
            ipSortable.sort(savedSortOrders.ipOrder);
            doneSortable.sort(savedSortOrders.doneOrder);
        }
}
const todoSortable = Sortable.create(todoCards, {
    animation: 150,
    group: "shared",
    ghostClass: "sortable-ghost",
    onSort: function (evt) {
        saveSortOrder();
    }
});

const ipSortable = Sortable.create(ipCards, {
    animation: 150,
    group: "shared",
    ghostClass: "sortable-ghost",
    onSort: function (evt) {
        saveSortOrder();
    }
});

const doneSortable = Sortable.create(doneCards, {
    animation: 150,
    group: "shared",
    ghostClass: "sortable-ghost",
    onSort: function (evt) {
        saveSortOrder();
    }
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-delete')) {
      const taskCard = event.target.closest('.card');
      
      taskCard.remove();
  
      const taskIndex = [...todoCards.querySelectorAll('.card')].indexOf(taskCard);
      savedTasks.splice(taskIndex, 1);
      localStorage.setItem('tasks', JSON.stringify(savedTasks));
    }
});
addTaskButton.addEventListener('click', function() {
    const taskTitle = taskTitleInput.value.trim();
    const dueDateValue = dueDateInput.value.trim();
    const dueDate = dayjs(dueDateValue, 'YYYY-MM-DD'); 
    const taskDesc = taskDescInput.value.trim();


  if (taskTitle && dueDate.isValid() && taskDesc) {
    const newTask = {
        title: taskTitle,
        dueDate: dueDate.format('MMM DD, YYYY'),
        description: taskDesc,
    };
    
    savedTasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(savedTasks));

    createTaskCard(newTask);

    taskTitleInput.value = '';
    dueDateInput.value = '';
    taskDescInput.value = '';
     
    $('#formModal').modal('hide');
  }
});
document.addEventListener('DOMContentLoaded', function() {
    applySavedSortOrder();
    savedTasks.forEach(function(task) {
        createTaskCard(task);
    });
});