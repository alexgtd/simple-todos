import '../scss/styles.scss';

import TodoListPresenter from './todoList/todoListPresenter';
import TodoListView from './todoList/todoListView';
import todosDataSource from './todosDataSource';

function main() {
    const todoListView = new TodoListView();
    new TodoListPresenter(todoListView, todosDataSource);
}

main();
