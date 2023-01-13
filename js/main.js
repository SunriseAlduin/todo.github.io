//Поиск элементов страницы
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks.forEach(function (task) {
        renderTask(task);
    });
}


checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);


function addTask(event) {
    //отменяем отправку формы
    event.preventDefault();

    //достаём текст из поля ввода
    const taskText = taskInput.value;

    //Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false, 
    };

    //Добавляем задачу в массив с задачами
    tasks.push(newTask);

    //Добавляю задачу в хранилище браузера LocalStorage
    saveToLocalStorage();

    renderTask(newTask);

    //Очищаем поле ввода и ставим в него фокус
    taskInput.value = '';
    taskInput.focus();
    checkEmptyList();
}

function deleteTask(event) {

    //Проверяем, что клик был не по кнопке delete
    if (event.target.dataset.action !== 'delete') return;

    //Проверяем что клик был по кнопке delete
    const parentNode = event.target.closest('.list-group-item');

    //Определяем id задачи
    const id = Number(parentNode.id);

    //Находим индекс задачи в массиве
    const index = tasks.findIndex(function (task) {
        return task.id === id;
    });

    //Удаляем задачу из массива с задачами
    tasks.splice(index, 1);

    saveToLocalStorage();

    parentNode.remove();
    checkEmptyList();
}

function doneTask(event) {

    if(event.target.dataset.action !== 'done') return;

    //Проверяем что клик был по кнопке задача выполнена
    const parentNode = event.target.closest('.list-group-item');
    const taskTitle = parentNode.querySelector('.task-title');

    //Определяем id Задачи
    const id = Number(parentNode.id);

    const task = tasks.find(function(task) {
        if (task.id === id) {
            return true;
        }
    });

    task.done = !task.done;

    saveToLocalStorage();

    taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                                        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                        <div class="empty-list__title">Список дел пуст</div>
                                    </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);                            
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    //Формируем CSS класс
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    //Формируем разметку для новой задачи
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                          <span class="${cssClass}">${task.text}</span>
                          <div class="task-item__buttons">
                              <button type="button" data-action="done" class="btn-action">
                                  <img src="./img/tick.svg" alt="Done" width="18" height="18">
                              </button>
                              <button type="button" data-action="delete" class="btn-action">
                                  <img src="./img/cross.svg" alt="Done" width="18" height="18">
                              </button>
                          </div>
                      </li>`;

    //Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}