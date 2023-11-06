import Todo from "./model";

const todosDataSource = {

    updateAll(todos: Todo[]) {
        localStorage.setItem('todos', JSON.stringify(todos));
    },

    getAll(): Todo[] {
        const localTodos = localStorage.getItem('todos');
        if (!localTodos)
            return [];

        return JSON.parse(localTodos);
    }
};

export default todosDataSource;