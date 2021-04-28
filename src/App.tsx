import React, { FormEvent, useEffect, useState } from 'react';

import './App.css';

import { TodoItem, TodoCreate, Category } from './components';
import { ITodo } from './interfaces';
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
    const res = await coreClient.post(
      `{ 
        todos { 
          todoID
          task
          category 
        } 
      }`
    ).then(r => r.json()).then(data => data.data.todos);

    const categories: string[] = res.map(({ category }: { category: string }) => category);
    setCategories([...new Set(categories)]);

    if (isInitial) {
      setStateSelectedCategories(categories);
    }

    return res;
  }

  const setSelectedCategory = (category: string): void => {
    const ctgIdxInSelCtgs: number = selectedCategories.findIndex((c: string) => category === c);
    if (ctgIdxInSelCtgs === -1) {
      setStateSelectedCategories([...selectedCategories, category]);
    } else {
      setStateSelectedCategories(selectedCategories.filter((c: string) => c !== category));
    }
    console.log(selectedCategories)
  }

  const setCategories = (categories: string[]): void => {
    setStateCategories(categories);
  }

  const deleteTodo = async (id: number): Promise<void> => {
    await coreClient.post(
      `mutation {
        deleteTodo(todoID:${id})
      }`
    );

    setStateTodos(await getTodos());
  }

  const createTodo = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

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
    setStateTaskInputValue('');
    setStateCategoryInputValue('');
  }

  const onTaskInputChange = (value: string): void => {
    setStateTaskInputValue(value);
  }

  const onCategoryInputChange = (value: string): void => {
    setStateCategoryInputValue(value);
  }

  const onTodoItemTaskInputChange = (todoID: number, value: string): void => {
    const todoItemIdx: number = todos.findIndex((todo: ITodo) => todo.todoID === todoID);
    const todosSlice: ITodo[] = todos.slice();
    todosSlice[todoItemIdx].task = value;

    setStateTodos(todosSlice);
  }

  const onTodoItemTaskInputSave = async (todoID: number): Promise<void> => {
    const todoItem: ITodo = todos.find((todo: ITodo) => todo.todoID === todoID)!;

    await coreClient.post(
      `mutation {
        updateTodo(todoID: ${todoID}, task: "${todoItem.task}", category: "${todoItem.category}") {
          task
        }
      }`
    );
  }

  return (
    <div className="container" >
      <h1>
        to-do list
      </h1>
      <button type="button" onClick={() => setStateToggleCreateFormShown(!isCreateFormShown)}>
        {isCreateFormShown ? 'Close' : 'Add a todo'}
      </button>
      <p>Categories:</p>
      {categories.length > 0 && categories.map((category: string, idx: number) => {
        return (
          <div key={idx} className={`category${selectedCategories.includes(category) ? '-selected' : ''}`}>
            <Category
              category={category}
              onSelect={setSelectedCategory}
            />
          </div>
        )
      })}
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
      <div className="todo-wrapper">
        {todos.length > 0 && todos.filter((todo: ITodo) => selectedCategories.includes(todo.category)).map((todo: ITodo) => {
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
        })}
      </div>
    </div>
  );
}

export default App;