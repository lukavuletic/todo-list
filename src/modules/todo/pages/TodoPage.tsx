import React, { useEffect, useState } from 'react';

import { Category } from 'modules/category/components';
import { TodoItem, TodoCreate } from 'modules/todo/components';

import { ITodo } from 'interfaces/todo';
import { ICoreClient } from 'interfaces/core';

interface Props {
    coreClient: ICoreClient;
}

export const TodoPage: React.FC<Props> = ({
    coreClient,
}) => {
    const [isCreateFormShown, setStateToggleCreateFormShown] = useState<boolean>(false);
    const [todos, setStateTodos] = useState<ITodo[]>([]);
    const [categories, setStateCategories] = useState<ITodo['category'][]>([]);
    const [selectedCategories, setStateSelectedCategories] = useState<ITodo['category'][]>([]);

    useEffect(() => {
        const getTodos = async (isInitial: boolean = false): Promise<ITodo[]> => {
            try {
                const res: ITodo[] = await coreClient.post(
                    `{ 
                        todos { 
                            todoID
                            task
                            category 
                        } 
                    }`
                ).then(r => r.json()).then(data => data.data.todos);

                const categories: ITodo["category"][] = res.map(({ category }: { category: ITodo["category"] }) => category);
                setStateCategories([...new Set(categories)]);

                if (isInitial) {
                    setStateCategories(categories);
                }

                return res;
            } catch (err) {
                console.log(err);
                throw new Error('failed to get todos');
            }
        }

        const onInitialize = async (): Promise<void> => {
            const todosRes: ITodo[] = await getTodos(true);
            const categories: ITodo["category"][] = todosRes.map(({ category }: { category: ITodo["category"] }) => category);

            setStateTodos(todosRes);

            const uniqueCategories: ITodo['category'][] = [...new Set(categories)]
            setStateCategories(uniqueCategories);
            setStateSelectedCategories(uniqueCategories);
        }

        onInitialize();
    }, [coreClient]);

    useEffect(() => {
        const onTodosChange = (): void => {
            const categories: ITodo["category"][] = todos.map(({ category }: { category: ITodo["category"] }) => category);
            const uniqueCategories: ITodo['category'][] = [...new Set(categories)]
            setStateCategories(uniqueCategories);
        }

        onTodosChange();
    }, [todos]);

    const deleteTodo = async (id: ITodo['todoID']): Promise<void> => {
        try {
            await coreClient.post(
                `mutation {
                    deleteTodo(todoID:${id})
                }`
            );

            setStateTodos(todos.filter(({ todoID }) => todoID !== id));
        } catch (err) {
            console.log(err);
            throw new Error('failed to delete the todo');
        }
    };

    const onTodoItemTaskInputChange = (todoID: number, value: ITodo["task"]): void => {
        const todoItemIdx: number = todos.findIndex((todo: ITodo) => todo.todoID === todoID);
        const todosSlice: ITodo[] = todos.slice();
        todosSlice[todoItemIdx].task = value;

        setStateTodos(todosSlice);
    };

    const onTodoItemTaskInputSave = async (todoID: ITodo["todoID"]): Promise<void> => {
        try {
            const todoItem: ITodo = todos.find((todo: ITodo) => todo.todoID === todoID)!;

            await coreClient.post(
                `mutation {
                    updateTodo(todoID: ${todoID}, task: "${todoItem.task}", category: "${todoItem.category}") {
                    task
                    }
                }`
            );
        } catch (err) {
            console.log(err);
            throw new Error('failed to update the todo');
        }
    };

    const setSelectedCategory = (category: ITodo["category"]): void => {
        const ctgIdxInSelCtgs: number = selectedCategories.findIndex((c: ITodo["category"]) => category === c);
        if (ctgIdxInSelCtgs === -1) {
            setStateSelectedCategories([...selectedCategories, category]);
        } else {
            setStateSelectedCategories(selectedCategories.filter((c: ITodo["category"]) => c !== category));
        }
    };

    return (
        <React.Fragment>
            <header>Todo list</header>
            <button type="button" onClick={() => setStateToggleCreateFormShown(!isCreateFormShown)}>
                {isCreateFormShown ? '-' : '+'}
            </button>
            {isCreateFormShown &&
                <TodoCreate
                    coreClient={coreClient}
                    state={{ categories, selectedCategories, todos }}
                    actions={{ setStateTodos, setStateSelectedCategories }}
                />
            }
            <br />
            <div className="categories-wrapper">
                {categories.length > 0 && categories.sort((a, b) => a.localeCompare(b))
                    .map((category: string, idx: number) => {
                        return (
                            <div key={idx} className={`category${selectedCategories.includes(category) ? '-selected' : ''}`}>
                                <Category
                                    category={category}
                                    onSelect={setSelectedCategory}
                                />
                            </div>
                        )
                    })
                }
            </div>
            <br />
            <div className="todo-wrapper">
                {todos.length > 0 && todos.filter((todo: ITodo) => selectedCategories.includes(todo.category))
                    .sort((a, b) => a.category.localeCompare(b.category))
                    .map((todo: ITodo) => {
                        return (
                            <div key={todo.todoID}>
                                <TodoItem
                                    todo={todo}
                                    onDelete={deleteTodo}
                                    onTodoItemTaskInputChange={onTodoItemTaskInputChange}
                                    onSave={onTodoItemTaskInputSave}
                                />
                            </div>
                        )
                    })
                }
            </div>
        </React.Fragment>
    )
}