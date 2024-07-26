// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;

}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const dueDate = dayjs(task.dueDate).format('YYYY-MM-DD');
    const today = dayjs();
    let colorClass = '';

    if (dayjs(task.dueDate).isBefore(today, 'day')) {
        colorClass = 'bg-danger text-white';
    } else if (dayjs(task.dueDate).diff(today, 'day') <= 3) {
        colorClass = 'bg-warning text-dark';
    }

    return `
        <div id="task-${task.id}" class="card task-card ${colorClass}" draggable="true">
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <p class="card-text"><small class="text-muted">Due: ${dueDate}</small></p>
                <button class="btn btn-danger btn-sm delete-task">Delete</button>
            </div>
        </div>
    `;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    if (taskList) {
        taskList.forEach(task => {
            const cardHtml = createTaskCard(task);
            switch (task.status) {
                case 'To Do':
                    $('#todo-cards').append(cardHtml);
                    break;
                case 'In Progress':
                    $('#in-progress-cards').append(cardHtml);
                    break;
                case 'Done':
                    $('#done-cards').append(cardHtml);
                    break;
            }
        });

        // Make task cards draggable
        $('.task-card').draggable({
            helper: 'clone',
            revert: 'invalid'
        });
    }

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const title = $('#task-title').val();
    const description = $('#task-description').val();
    const dueDate = $('#task-due-date').val();
    const status = 'To Do';

    const newTask = {
        id: generateTaskId(),
        title,
        description,
        dueDate,
        status
    };

    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
    $('#formModal').modal('hide');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(event.target).closest('.task-card').attr('id').split('-')[1];
    taskList = taskList.filter(task => task.id != taskId);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.helper.attr('id').split('-')[1];
    const newStatus = $(event.target).closest('.lane').attr('id').replace('-', ' ');

    taskList.forEach(task => {
        if (task.id == taskId) {
            task.status = newStatus;
        }
    });

    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // Initialize task list and IDs
    taskList = taskList || [];
    nextId = nextId || 1;
    renderTaskList();

    // Event listener for adding tasks
    $('#save-task').click(handleAddTask);

    // Event listener for deleting tasks
    $(document).on('click', '.delete-task', handleDeleteTask);

    // Make lanes droppable
    $('.lane').droppable({
        accept: '.task-card',
        drop: handleDrop
    });

    // Initialize date picker
    $('#task-due-date').datepicker({
        dateFormat: 'yy-mm-dd'
    });
});
