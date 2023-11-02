import Todo from '../model';

class TodoListPresenter {
    #todos;
    #view;
    #todosDataSource;

    constructor(view, todosDataSource) {
        this.#view = view;
        this.#todosDataSource = todosDataSource;
        this.#todos = this.#todosDataSource.getAll() ?? [];

        this.#view.addEventListener('onCreate', (e) => this.#create(e.text));
        this.#view.addEventListener('onRemove', (e) => this.#delete(e.todo));
        this.#view.addEventListener('onUpdate', (e) => this.#update(e.todo));
        
        this.#show();
    }

    #show() {
        this.#view.showTodos(this.#todos);
    }

    #create(todoText) {
        const newTodo = new Todo({ text: todoText });
        this.#todos.push(newTodo);
        this.#todosDataSource.updateAll(this.#todos);
        this.#show();
    }

    #delete(todo) {
        const i = this.#todos.findIndex((t) => t.id === todo.id);
        if (i === -1) {
            throw new Error(`Couldn't find todo item with id: ${todo.id}`);
        }
        this.#todos.splice(i, 1);
        this.#todosDataSource.updateAll(this.#todos);
        this.#show();
    }

    #update(todo) {
        const i = this.#todos.findIndex((t) => t.id === todo.id);
        if (i === -1) {
            throw new Error(`Couldn't find todo item with id: ${todo.id}`);
        }
        this.#todos.splice(i, 1, todo);
        this.#todosDataSource.updateAll(this.#todos);
        this.#show();
    }
}

export default TodoListPresenter;
