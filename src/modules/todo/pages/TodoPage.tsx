import React, { FormEvent, useEffect, useState } from 'react';

import { Category } from 'modules/category/components';
import { TodoItem, TodoCreate } from 'modules/todo/components';

import { ITodo } from 'interfaces/todo';

import { StateFnTypes } from 'types/core';

interface Props {
    coreSetState: (data: any, stateFn: StateFnTypes) => void;
    coreClient: {
        post: (query: string) => Promise<any>,
    };
    state: {
        todos: ITodo[],
        selectedCategories: ITodo['category'][],
        isCreateFormShown: boolean,
        taskInputValue: string,
        categoryInputValue: string,
        categories: ITodo['category'][],
    };
}

export const TodoPage: React.FC<Props> = ({ 
    coreSetState,
    coreClient, 
    state: { 
        todos, 
        selectedCategories, 
        isCreateFormShown,
        taskInputValue,
        categoryInputValue,
        categories,
    } 
}) => {
    useEffect(() => {
        const fetchTodos = async (): Promise<void> => {
            const todosRes: ITodo[] = await getTodos(true);

            coreSetState(todosRes, 'getTodos');
        }

        fetchTodos();
    }, []);

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
            coreSetState([...new Set(categories)], 'setCategories');

            if (isInitial) {
                coreSetState(categories, 'setSelectedCategories');
            }

            return res;
        } catch (err) {
            console.log(err);
            throw new Error('failed to get todos');
        }
    }

    const deleteTodo = async (id: ITodo['todoID']): Promise<void> => {
        try {
            await coreClient.post(
                `mutation {
                    deleteTodo(todoID:${id})
                }`
            );

            coreSetState(todos.filter(({ todoID }) => todoID !== id), 'setTodos');
        } catch (err) {
            console.log(err);
            throw new Error('failed to delete the todo');
        }
    }

    const onTodoItemTaskInputChange = (todoID: number, value: ITodo["task"]): void => {
      const todoItemIdx: number = todos.findIndex((todo: ITodo) => todo.todoID === todoID);
      const todosSlice: ITodo[] = todos.slice();
      todosSlice[todoItemIdx].task = value;
  
      coreSetState(todosSlice, 'setTodos');
    }

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
    }

    const onTaskInputChange = (value: ITodo["task"]): void => {
      coreSetState(value, 'setTaskInputValue');
    }
    
    const onCategoryInputChange = (value: ITodo["category"]): void => {
        coreSetState(value, 'setCategoryInputValue');
    }

    const createTodo = async (e: FormEvent): Promise<void> => {
      e.preventDefault();
  
      try {
        await coreClient.post(
          `mutation {
            createTodo(task: "${taskInputValue}", category: "${categoryInputValue}" ) {
              todoID
              task
              category
            }
          }`
        );
  
        coreSetState(await getTodos(), 'setTodos');
        // if label is newly created, select it by defualt
        if (!categories.includes(categoryInputValue)) {
          coreSetState([...selectedCategories, categoryInputValue], 'setSelectedCategories');
        }
        coreSetState('', 'setTaskInputValue');
        coreSetState('', 'setCategoryInputValue');
      } catch (err) {
        console.log(err);
        throw new Error('failed to create the todo');
      }
    }

    const setSelectedCategory = (category: ITodo["category"]): void => {
      const ctgIdxInSelCtgs: number = selectedCategories.findIndex((c: ITodo["category"]) => category === c);
      if (ctgIdxInSelCtgs === -1) {
        coreSetState([...selectedCategories, category], 'setSelectedCategories');
      } else {
        coreSetState(selectedCategories.filter((c: ITodo["category"]) => c !== category), 'setSelectedCategories');
      }
    }

    return (
        <React.Fragment>
            <header>Todo list</header>
            <button type="button" onClick={() => coreSetState(!isCreateFormShown, 'setToggleCreateFormShown')}>
                {isCreateFormShown ? '-' : '+'}
            </button>
            {isCreateFormShown &&
                <TodoCreate
                    onSubmit={createTodo}
                    onTaskInputChange={onTaskInputChange}
                    onCategoryInputChange={onCategoryInputChange}
                    taskInputValue={taskInputValue}
                    categoryInputValue={categoryInputValue}
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