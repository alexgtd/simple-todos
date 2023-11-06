import Todo from '../model';

class TodoListPresenter {
    #todos: Todo[];
    #view;
    #todosDataSource;

    constructor(view: any, todosDataSource: any) {
        this.#view = view;
        this.#todosDataSource = todosDataSource;
        this.#todos = this.#todosDataSource.getAll();

        this.#view.addEventListener('onCreate', (e: { text: string; }) => this.#create(e.text));
        this.#view.addEventListener('onRemove', (e: { todo: Todo; }) => this.#delete(e.todo));
        this.#view.addEventListener('onUpdate', (e: { todo: Todo; }) => this.#update(e.todo));
        
        this.#show();
    }

    #show() {
        this.#view.showTodos(this.#todos);
    }

    #create(todoText: string) {
        const newTodo = new Todo({ text: todoText });
        this.#todos.push(newTodo);
        this.#todosDataSource.updateAll(this.#todos);
        this.#show();
    }

    #delete(todo: Todo) {
        const i = this.#todos.findIndex((t) => t.id === todo.id);
        if (i === -1) {
            throw new Error(`Couldn't find todo item with id: ${todo.id}`);
        }
        this.#todos.splice(i, 1);
        this.#todosDataSource.updateAll(this.#todos);
        this.#show();
    }

    #update(todo: Todo) {
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
