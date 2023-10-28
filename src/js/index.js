import '../scss/styles.scss';

const todoTextForm = document.getElementById('todo-add-form__textarea');
const todoAddForm = document.getElementById('todo-add-form');
const todoList = document.getElementById('todo-list');

function createTodoEditForm() {
    let html = `
    <form name="todoEditForm" class="p-0 list-group-item">
        <div class="py-2 bg-body-secondary d-flex justify-content-between">
            <div class="ms-2">
                <button class="todo-edit-form__save-btn btn btn-success">Save</button>
                <button class="todo-edit-form__close-btn btn btn-secondary">Don't save</button>
            </div>
            <button class="todo-edit-form__remove-btn me-2 btn btn-danger">Delete</button>
        </div>
        <textarea rows="5" class="border border-0 form-control"></textarea>
    </form>
    `;
    const fragment = document.createRange().createContextualFragment(html);
    return fragment.firstElementChild;
}

function createTodoItem(todo) {
    let text = todo.isDone ? `<s>${todo.text}</s>` : todo.text;
    let html = `
        <a href="#" data-id="${todo.id}" class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col d-flex flex-column justify-content-between">
                    <p class="todo-item__text mb-1">${text}</p>
                    <small>${todo.date}</small>
                </div>

                <div class="col-auto d-flex flex-column align-items-end justify-content-between">
                    <button type="submit" class="todo-item__edit-btn mb-1 btn btn-primary">Edit</button>
                    <button type="submit" class="todo-item__done-btn btn btn-success">Done</button>
                </div>
            </div>
        </a>`;

    const todoItem = document.createRange().createContextualFragment(html).firstElementChild;
    todoItem.querySelector('.todo-item__edit-btn').addEventListener('click', onEditBtnClick);
    const doneBtn = todoItem.querySelector('.todo-item__done-btn');
    doneBtn.addEventListener('click', onDoneBtnClick);

    if (todo.isDone) {
        todoItem.classList.add('list-group-item-dark');
        doneBtn.textContent = 'Not Done';
        doneBtn.classList.replace('btn-success', 'btn-secondary');
    }

    return todoItem;
}

let todos = [];

function getTodoFromListItem(item) {
    const id = Number(item.dataset.id);
    const todo = todos.find(todo => todo.id == id);
    return todo;
}

function onDoneBtnClick(e) {
    e.preventDefault();
    const srcItem = e.target.closest('[data-id]');

    const todo = getTodoFromListItem(srcItem);
    todo.isDone = todo.isDone ? false : true;
    updateTodos();
    const newItem = createTodoItem(todo);
    srcItem.replaceWith(newItem);
}

function onRemoveBtnClick(e) {
    const containerElement = e.target.closest('[data-id]');
    const id = Number(containerElement.dataset.id);
    const i = todos.findIndex((todo) => todo.id === id);
    if (i === -1) {
        throw new Error(`Couldn't find todo item with id: ${id}`);
    }
    todos.splice(i, 1);
    containerElement.remove();
    updateTodos();
}

function onEditBtnClick(e) {
    e.preventDefault();
    const srcItem = e.target.closest('[data-id]');

    const todo = getTodoFromListItem(srcItem);
    const editForm = createTodoEditForm();
    editForm.dataset.id = srcItem.dataset.id;
    const formTextArea = editForm.querySelector('textarea');
    formTextArea.value = todo.text;

    editForm.querySelector('.todo-edit-form__save-btn').addEventListener('click', (e) => {
        e.preventDefault();
        todo.text = formTextArea.value;
        updateTodos();
        const newItem = createTodoItem(todo);
        editForm.replaceWith(newItem);
    });
    editForm.querySelector('.todo-edit-form__close-btn').addEventListener('click', (e) => {
        e.preventDefault();
        editForm.replaceWith(srcItem);
    });
    editForm.querySelector('.todo-edit-form__remove-btn').addEventListener('click', (e) => {
        e.preventDefault();
        onRemoveBtnClick(e);
    });

    srcItem.replaceWith(editForm);
}

function onAddBtnClick(e) {
    e.preventDefault();
    if (!todoTextForm.value.trim()) return;

    const newTodo = {
        id: Number(Date.now().toString().slice(-10)),
        text: todoTextForm.value,
        isDone: false,
        date: new Date().toString(),
    };
    todos.push(newTodo);
    updateTodos();

    addToTodoListHTML(newTodo);

    todoAddForm.reset();
}

function updateTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addToTodoListHTML(todo) {
    const item = createTodoItem(todo);
    todoList.prepend(item);
}

function getTodos() {
    const localTodos = localStorage.getItem('todos');
    if (!localTodos)
        return;

    todos = JSON.parse(localTodos);
    todos.forEach(todo => {
        addToTodoListHTML(todo);
    });
}

todoAddForm.addEventListener('submit', onAddBtnClick);
getTodos();
