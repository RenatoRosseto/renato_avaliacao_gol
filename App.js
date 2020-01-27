import React from 'react'
import { StatusBar, YellowBox } from 'react-native'

import Routes from './src/routes'

YellowBox.ignoreWarnings([
  'VirtualizedLists should', //se o warning da YellowBox começar com esse texto, ele é ignorado e não aparece
  'Possible Unhandled Promise'
]);

export default function App() {
  return (
    <> 
      <StatusBar barStyle="light-content" backgroundColor="#ff7020" />
      <Routes />
    </>
  );
}