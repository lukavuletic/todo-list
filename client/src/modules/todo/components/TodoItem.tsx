import React from 'react';

import { ITodo } from 'interfaces/todo';

interface Props {
    todo: ITodo;
    onDelete: (todoID: ITodo["todoID"]) => void;
    onSave: (todoID: ITodo["todoID"]) => Promise<void>;
    onTodoItemTaskInputChange: (todoID: ITodo["todoID"], value: ITodo["task"]) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, onDelete, onTodoItemTaskInputChange, onSave }) => {
    return (
        <div className="inputField">
            <div className="todo-category">
                {todo.category}
            </div>
            <br />
            <input
                type="text"
                value={todo.task}
                onChange={(e: { target: HTMLInputElement }) => onTodoItemTaskInputChange(todo.todoID, e.target.value)}
            />
            <button type="button" onClick={() => onSave(todo.todoID)}>OK</button>
            <button type="button" onClick={() => onDelete(todo.todoID)}>X</button>
        </div>
    )
}