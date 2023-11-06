class Todo {
    id: number;
    text: string;
    isDone: boolean;
    date: string;

    constructor(todo?: { id?: number, text?: string, isDone?: boolean, date?: string }) {
        this.id = todo?.id ?? Number(Date.now().toString().slice(-10));
        this.text = todo?.text ?? '';
        this.isDone = todo?.isDone ?? false;
        this.date = todo?.date ?? new Date().toString();
    }
}

export default Todo;
