class Todo {
    constructor({ id, text, isDone, date }) {
        this.id = id ?? Number(Date.now().toString().slice(-10));
        this.text = text ?? '';
        this.isDone = isDone ?? false;
        this.date = date ?? new Date().toString();
    }
}

export default Todo;
