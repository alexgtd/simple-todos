import Todo from '../model';

class TodoListView extends EventTarget {
    #todoList = document.getElementById('todo-list');
    #editButtons = document.querySelector('.todo-list__edit-buttons');
    #selectedNumber = document.querySelector('.todo-list__selected-number');
    #selectedTodoListRemoveBtn = document.querySelector('.selected-todo-list__remove-btn');
    #selectedTodoListDoneBtn = document.querySelector('.selected-todo-list__done-btn');

    #todoTextForm = document.getElementById('todo-add-form__textarea');
    #todoAddForm = document.getElementById('todo-add-form');

    #todos = [];

    constructor() {
        super();
        this.#todoAddForm.addEventListener('submit', this.#onAddBtnClick.bind(this));

        this.#selectedTodoListDoneBtn.addEventListener('click', () => {
            Array.from(this.#todoList.querySelectorAll('[data-id]'))
                .filter((el) => el.classList.contains('active'))
                .forEach((el) => this.#setTodoAsDone(el));
            this.#editButtons.classList.add('invisible');
        });

        this.#selectedTodoListRemoveBtn.addEventListener('click', () => {
            Array.from(this.#todoList.querySelectorAll('[data-id]'))
                .filter((el) => el.classList.contains('active'))
                .forEach((el) => this.#removeTodo(el));
            this.#editButtons.classList.add('invisible');
        });

    }

    #createTodoItem(todo) {
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
        todoItem.addEventListener('click', this.#onTodoItemClick.bind(this));
        todoItem.querySelector('.todo-item__edit-btn').addEventListener('click', this.#onEditBtnClick.bind(this));
        const doneBtn = todoItem.querySelector('.todo-item__done-btn');
        doneBtn.addEventListener('click', this.#onDoneBtnClick.bind(this));

        if (todo.isDone) {
            todoItem.classList.add('list-group-item-dark');
            doneBtn.textContent = 'Not Done';
            doneBtn.classList.replace('btn-success', 'btn-secondary');
        }

        return todoItem;
    }

    /**
     * 
     * @param {Event} e 
     */
    #onTodoItemClick(e) {
        e.preventDefault();

        e.currentTarget.classList.toggle('active');
        const selectedItems = Array.from(this.#todoList.querySelectorAll('[data-id]'))
            .filter((el) => el.classList.contains('active'));

        this.#editButtons.classList.toggle('invisible', !(selectedItems.length > 1));
        this.#selectedNumber.textContent = selectedItems.length;
    }

    #addToTodoListHTML(todo) {
        const item = this.#createTodoItem(todo);
        this.#todoList.prepend(item);
    }

    #createTodoEditForm() {
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

    #getTodoFromListItem(item) {
        const id = Number(item.dataset.id);
        const todo = this.#todos.find(todo => todo.id == id);
        return todo;
    }

    /**
     * @param {HTMLElement} todoItemHTMLContainer 
     */
    #setTodoAsDone(todoItemHTMLContainer) {
        const srcItem = todoItemHTMLContainer.closest('[data-id]');
        const srcTodo = this.#getTodoFromListItem(srcItem);

        const event = new Event('onUpdate');
        event.todo = new Todo({ ...srcTodo, isDone: !srcTodo.isDone });
        this.dispatchEvent(event);
    }

    /**
     * @param {Event} e 
     */
    #onDoneBtnClick(e) {
        e.preventDefault();
        this.#setTodoAsDone(e.currentTarget);
    }

    /**
     * @param {HTMLElement} todoItemHTMLContainer 
     */
    #removeTodo(todoItemHTMLContainer) {
        const containerElement = todoItemHTMLContainer.closest('[data-id]');
        const id = Number(containerElement.dataset.id);
        const i = this.#todos.findIndex((todo) => todo.id === id);
        if (i === -1) {
            throw new Error(`Couldn't find todo item with id: ${id}`);
        }

        const event = new Event('onRemove');
        event.todo = this.#getTodoFromListItem(containerElement);
        this.dispatchEvent(event);
    }

    /**
     * @param {Event} e 
     */
    #onEditBtnClick(e) {
        e.preventDefault();
        const srcItem = e.target.closest('[data-id]');

        const srcTodo = this.#getTodoFromListItem(srcItem);
        const editForm = this.#createTodoEditForm();
        editForm.dataset.id = srcItem.dataset.id;
        const formTextArea = editForm.querySelector('textarea');
        formTextArea.value = srcTodo.text;

        editForm.querySelector('.todo-edit-form__save-btn').addEventListener('click', (e) => {
            e.preventDefault();
            const event = new Event('onUpdate');
            event.todo = new Todo({ ...srcTodo, text: formTextArea.value });
            this.dispatchEvent(event);
        });
        editForm.querySelector('.todo-edit-form__close-btn').addEventListener('click', (e) => {
            e.preventDefault();
            editForm.replaceWith(srcItem);
        });
        editForm.querySelector('.todo-edit-form__remove-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.#removeTodo(e.currentTarget);
        });

        srcItem.replaceWith(editForm);
    }

    #onAddBtnClick(e) {
        e.preventDefault();
        if (!this.#todoTextForm.value.trim()) return;

        const event = new Event('onCreate');
        event.text = this.#todoTextForm.value;
        this.dispatchEvent(event);
        this.#todoAddForm.reset();
    }

    showTodos(todos) {
        this.#todoList.querySelectorAll('[data-id]')
            .forEach((el) => el.remove());
        this.#todos = todos;
        todos.forEach(todo => {
            this.#addToTodoListHTML(todo);
        });
    }
}

export default TodoListView;
