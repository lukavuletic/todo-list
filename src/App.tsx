import React, { useEffect, useState } from 'react';

import './App.css';

import { TodoItem } from './components';

import { ITodo } from './interfaces';

const url = 'http://localhost:4000/api';

function App() {
  const [todos, setStateTodos] = useState<ITodo[]>([]);

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

  return (
    <div className="container" >
      <h1>
        to-do list
      </h1>
      <div className="todo-wrapper">
        {todos.map((todo: ITodo) => {
          return (
            <div key={todo.todoID}>
              <TodoItem todo={todo} />
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
