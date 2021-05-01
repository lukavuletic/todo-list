import React, { FormEvent, useState } from 'react';

import { ITodo } from 'interfaces/todo';
import { ICoreClient } from 'interfaces/core';

interface Props {
    coreClient: ICoreClient;
    state: {
        categories: ITodo['category'][],
        selectedCategories: ITodo['category'][],
        todos: ITodo[],
    };
    actions: {
        setStateTodos: React.Dispatch<React.SetStateAction<ITodo[]>>
        setStateSelectedCategories: React.Dispatch<React.SetStateAction<ITodo['category'][]>>
    }
}

export const TodoCreate: React.FC<Props> = ({
    coreClient,
    state: {
        categories,
        selectedCategories,
        todos,
    },
    actions: {
        setStateTodos,
        setStateSelectedCategories,
    },
}) => {
    const [taskInputValue, setStateTaskInputValue] = useState<ITodo["task"]>('');
    const [categoryInputValue, setStateCategoryInputValue] = useState<ITodo["category"]>('');

    const onTaskInputChange = (value: ITodo["task"]): void => {
        setStateTaskInputValue(value);
    }

    const onCategoryInputChange = (value: ITodo["category"]): void => {
        setStateCategoryInputValue(value);
    }

    const createTodo = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        try {
            const createdItem: ITodo = await coreClient.post(
                `mutation {
                    createTodo(task: "${taskInputValue}", category: "${categoryInputValue}" ) {
                        todoID
                        task
                        category
                    }
                }`
            ).then(r => r.json()).then(data => data.data.createTodo);

            setStateTodos([...todos, createdItem]);
            // if label is newly created, select it by defualt
            if (!categories.includes(categoryInputValue)) {
                setStateSelectedCategories([...selectedCategories, categoryInputValue]);
            }
            setStateTaskInputValue('');
            setStateCategoryInputValue('');
        } catch (err) {
            console.log(err);
            throw new Error('failed to create the todo');
        }
    }

    return (
        <form onSubmit={createTodo}>
            <div className="inputField">
                <label htmlFor="task">Task name: </label>
                <input id="task" type="text" name="task" value={taskInputValue} onChange={(e: { target: HTMLInputElement }) => onTaskInputChange(e.target.value)} />
            </div>
            <div className="inputField">
                <label htmlFor="category">Category name: </label>
                <input id="category" type="text" name="category" value={categoryInputValue} onChange={(e: { target: HTMLInputElement }) => onCategoryInputChange(e.target.value)} />
            </div>
            <button type="submit">OK</button>
        </form>
    )
}