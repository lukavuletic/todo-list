import React, { FormEvent } from 'react';
import { ITodo } from 'interfaces';

interface Props {
    onSubmit: (e: FormEvent) => Promise<void>;
    onTaskInputChange: (value: ITodo["task"]) => void;
    onCategoryInputChange: (value: ITodo["category"]) => void;
    taskInputValue: ITodo["task"];
    categoryInputValue: ITodo["category"];
}

export const TodoCreate: React.FC<Props> = ({ onSubmit, onTaskInputChange, onCategoryInputChange, taskInputValue, categoryInputValue }) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="inputField">
                <label htmlFor="task">Task name: </label>
                <br />
                <input id="task" type="text" name="task" value={taskInputValue} onChange={(e: { target: HTMLInputElement }) => onTaskInputChange(e.target.value)} />
            </div>
            <div className="inputField">
                <label htmlFor="category">Category name: </label>
                <input id="category" type="text" name="category" value={categoryInputValue} onChange={(e: { target: HTMLInputElement }) => onCategoryInputChange(e.target.value)} />
            </div>
            < br />
            < br />
            <button type="submit">OK</button>
        </form>
    )
}