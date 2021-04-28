import React, { FormEvent, useEffect, useState } from 'react';

import './App.css';

import { TodoItem, TodoCreate } from './components';

import { ITodo } from './interfaces';

const url = 'http://localhost:4000/api';

function App() {
  const [todos, setStateTodos] = useState<ITodo[]>([]);
  const [isCreateFormShown, setStateToggleCreateFormShown] = useState<boolean>(false);
  const [taskInputValue, setStateTaskInputValue] = useState<string>('');
  const [categoryInputValue, setStateCategoryInputValue] = useState<string>('');

  useEffect(() => {
    const fetchTodos = async (): Promise<void> => {
      const todosRes: ITodo[] = await getTodos();

      setStateTodos(todosRes);
    }

    fetchTodos();
  }, []);

  const getTodos = async (): Promise<ITodo[]> => {
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'mode': 'no-cors',
        'url': `http://localhost:4000`,
      },
      body: JSON.stringify({ query: "{ todos { todoID task category } }" })
    }).then(r => r.json()).then(data => data.data.todos);
  }

  const deleteTodo = async (id: number): Promise<void> => {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'mode': 'no-cors',
        'url': `http://localhost:4000`,
      },
      body: JSON.stringify({ query: `mutation { deleteTodo(todoID:${id}) } ` })
    });

    setStateTodos(await getTodos());
  }

  const createTodo = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'mode': 'no-cors',
        'url': `http://localhost:4000`,
      },
      body: JSON.stringify({ query: `mutation { createTodo(task: "${taskInputValue}", category: "${categoryInputValue}" ) } ` })
    });

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
    // e.preventDefault();

    const todoItem: ITodo = todos.find((todo: ITodo) => todo.todoID === todoID);

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'mode': 'no-cors',
        'url': `http://localhost:4000`,
      },
      body: JSON.stringify({
        query: `mutation {
        updateTodo(todoID: ${todoID}, task: "${todoItem.task}", category: "${todoItem.category}") {
          task
        }
      }`
      }),
    });
  }

  return (
    <div className="container" >
      <h1>
        to-do list
      </h1>
      <button type="button" onClick={() => setStateToggleCreateFormShown(!isCreateFormShown)}>
        {isCreateFormShown ? 'Close' : 'Add a todo'}
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
      <div className="todo-wrapper">
        {todos.length > 0 && todos.map((todo: ITodo) => {
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
