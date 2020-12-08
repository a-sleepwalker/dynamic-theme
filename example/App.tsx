import React, {FC} from 'react';
import './app.styl';
import getInstance from '../dist';
import {DynamicThemeClass} from '../index';

declare const window: Window & { theme: DynamicThemeClass };

window.theme = getInstance({
  primaryColor: '#ff6700',
  autoLoad: true,
  cssUrl: '',
});

const App: FC = () => {
  return (
    <div className="app">
      <div className="app-header"/>
      <div className="app-content"/>
    </div>
  );
};

export default App;
