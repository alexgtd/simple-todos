const todosDataSource = {

    updateAll(todos) {
        localStorage.setItem('todos', JSON.stringify(todos));
    },

    getAll() {
        const localTodos = localStorage.getItem('todos');
        if (!localTodos)
            return;

        return JSON.parse(localTodos);
    }
};

export default todosDataSource;