import React from 'react';

import { ITodo } from '../interfaces';

interface Props {
    todo: ITodo;
    onDelete: (todoID: ITodo["todoID"]) => void;
    onSave: (todoID: ITodo["todoID"]) => Promise<void>;
    onTodoItemTaskInputChange: (todoID: ITodo["todoID"], value: ITodo["task"]) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, onDelete, onTodoItemTaskInputChange, onSave }) => {
    return (
        <div className="todo-item">
            <input
                className="todo-task"
                type="text"
                value={todo.task}
                onChange={(e: { target: HTMLInputElement }) => onTodoItemTaskInputChange(todo.todoID, e.target.value)}
            />
            <div className="todo-category">
                {todo.category}
            </div>
            <button type="button" onClick={() => onSave(todo.todoID)}>SAVE</button>
            <button type="button" onClick={() => onDelete(todo.todoID)}>X</button>
        </div>
    )
}