import React, { FormEvent } from 'react';

interface Props {
    onSubmit: (e: FormEvent) => Promise<void>;
    onTaskInputChange: (value: string) => void;
    onCategoryInputChange: (value: string) => void;
    taskInputValue: string;
    categoryInputValue: string;
}

export const TodoCreate: React.FC<Props> = ({ onSubmit, onTaskInputChange, onCategoryInputChange, taskInputValue, categoryInputValue }) => {
    return (
        <form onSubmit={onSubmit}>
            <label htmlFor="task">Task name: </label>
            <input id="task" type="text" name="task" value={taskInputValue} onChange={(e: { target: HTMLInputElement }) => onTaskInputChange(e.target.value)} />
            < br/>
            <label htmlFor="category">Category name: </label>
            <input id="category" type="text" name="category" value={categoryInputValue} onChange={(e: { target: HTMLInputElement }) => onCategoryInputChange(e.target.value)} />
            < br/>
            <button type="submit">CREATE</button>
        </form>
    )
}