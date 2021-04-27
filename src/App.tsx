import React, { useEffect, useState } from 'react';

import './App.css';

import { TodoItem } from './components';

import { ITodo } from './interfaces';

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
    return await fetch('http://localhost:4000/api', {
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
      <header>
        to-do list
      </header>
      {todos.map((todo: ITodo) => {
        console.log(todo.todoID)
        return (
          <div key={todo.todoID}>
            <TodoItem todo={todo} />
          </div>
        )
      })}
    </div>
  );
}

export default App;
