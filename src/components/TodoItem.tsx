import React from 'react';

import { ITodo } from '../interfaces';

interface Props {
    todo: ITodo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
    return (
        <div className="todo-item">
            <div className="todo-task">
                {todo.task}
            </div>
            <div className="todo-category">
                {todo.category}
            </div>
        </div>
    )
}