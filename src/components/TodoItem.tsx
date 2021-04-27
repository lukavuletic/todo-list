import React from 'react';

import { ITodo } from '../interfaces';

interface Props {
    todo: ITodo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
    return (
        <React.Fragment>
            <div>
                {todo.task}
            </div>
            <div>
                {todo.category}
            </div>
        </React.Fragment>
    )
}