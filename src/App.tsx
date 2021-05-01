import React, { FormEvent, useEffect, useState } from 'react';

import './App.css';

import { Category } from './modules/category/components';
import { TodoItem, TodoCreate } from './modules/todo/components';
import { ITodo } from './interfaces/todo';
import { CoreClient } from './core';

function App() {
  const [todos, setStateTodos] = useState<ITodo[]>([]);
  const [categories, setStateCategories] = useState<string[]>([]);
  const [selectedCategories, setStateSelectedCategories] = useState<string[]>([]);
  const [isCreateFormShown, setStateToggleCreateFormShown] = useState<boolean>(false);
  const [taskInputValue, setStateTaskInputValue] = useState<string>('');
  const [categoryInputValue, setStateCategoryInputValue] = useState<string>('');

  const coreClient = new CoreClient();

  useEffect(() => {
    const fetchTodos = async (): Promise<void> => {
      const todosRes: ITodo[] = await getTodos(true);

      setStateTodos(todosRes);
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
      setCategories([...new Set(categories)]);

      if (isInitial) {
        setStateSelectedCategories(categories);
      }

      return res;
    } catch (err) {
      console.log(err);
      throw new Error('failed to get todos');
    }
  }

  const setSelectedCategory = (category: ITodo["category"]): void => {
    const ctgIdxInSelCtgs: number = selectedCategories.findIndex((c: ITodo["category"]) => category === c);
    if (ctgIdxInSelCtgs === -1) {
      setStateSelectedCategories([...selectedCategories, category]);
    } else {
      setStateSelectedCategories(selectedCategories.filter((c: ITodo["category"]) => c !== category));
    }
  }

  const setCategories = (categories: string[]): void => {
    setStateCategories(categories);
  }

  const deleteTodo = async (id: ITodo["todoID"]): Promise<void> => {
    try {
      await coreClient.post(
        `mutation {
          deleteTodo(todoID:${id})
        }`
      );

      setStateTodos(await getTodos());
    } catch (err) {
      console.log(err);
      throw new Error('failed to delete the todo');
    }
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

      setStateTodos(await getTodos());
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

  const onTaskInputChange = (value: ITodo["task"]): void => {
    setStateTaskInputValue(value);
  }

  const onCategoryInputChange = (value: ITodo["category"]): void => {
    setStateCategoryInputValue(value);
  }

  const onTodoItemTaskInputChange = (todoID: number, value: ITodo["task"]): void => {
    const todoItemIdx: number = todos.findIndex((todo: ITodo) => todo.todoID === todoID);
    const todosSlice: ITodo[] = todos.slice();
    todosSlice[todoItemIdx].task = value;

    setStateTodos(todosSlice);
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

  return (
    <div className="container" >
      <header>Todo list</header>
      <button type="button" onClick={() => setStateToggleCreateFormShown(!isCreateFormShown)}>
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
    </div>
  );
}

export default App;