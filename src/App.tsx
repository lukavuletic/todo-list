import React, { FormEvent, useEffect, useState } from 'react';

import './App.css';

import { TodoPage } from './modules/todo/pages';

import { ITodo } from 'interfaces/todo';

import { StateFnTypes } from 'types/core';

import { CoreClient } from 'core';

function App() {
  const [todos, setStateTodos] = useState<ITodo[]>([]);
  const [categories, setStateCategories] = useState<string[]>([]);
  const [selectedCategories, setStateSelectedCategories] = useState<string[]>([]);
  const [isCreateFormShown, setStateToggleCreateFormShown] = useState<boolean>(false);
  const [taskInputValue, setStateTaskInputValue] = useState<string>('');
  const [categoryInputValue, setStateCategoryInputValue] = useState<string>('');

  const coreClient = new CoreClient();

  const coreSetState = (data: any, stateFn: StateFnTypes): void => {
    switch (stateFn) {
      case 'getTodos': {
        setStateTodos(data);
        break;
      }
      case 'setCategories': {
        setStateCategories(data);
        break;
      }
      case 'setSelectedCategories': {
        setStateSelectedCategories(data);
        break;
      }
      case 'setTodos': {
        setStateTodos(data);
        break;
      }
      case 'setToggleCreateFormShown': {
        setStateToggleCreateFormShown(data);
        break;
      }
      case 'setTaskInputValue': {
        setStateTaskInputValue(data);
        break;
      }
      case 'setCategoryInputValue': {
        setStateCategoryInputValue(data);
        break;
      }
      default: {
        throw new Error('Chosen set state function doesn\'t exist');
      }
    }
  }

  return (
    <div className="container" >
      <TodoPage
        coreSetState={coreSetState}
        coreClient={coreClient}
        state={{ todos, selectedCategories, isCreateFormShown, taskInputValue, categoryInputValue, categories }}
      />
    </div>
  );
}

export default App;