import React from 'react';

import './App.css';

import { TodoPage } from 'modules/todo/pages';

import { CoreClient } from 'core';

function App() {
  const coreClient = new CoreClient();

  return (
    <div className="container" >
      <TodoPage
        coreClient={coreClient}
      />
    </div>
  );
}

export default App;