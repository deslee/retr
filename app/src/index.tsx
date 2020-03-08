import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';
import CssBaseline from '@material-ui/core/CssBaseline'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { rootReducer, RootState } from './slices';
import syncMiddleware from './sync';
import client from './apollo';
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import { ThemeProvider, createMuiTheme } from '@material-ui/core';

const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware<RootState>(), syncMiddleware] as const
})

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#1976d2'
        },
    }
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <DndProvider backend={Backend}>
                    <CssBaseline />
                    <App />
                </DndProvider>
            </Provider>
        </ThemeProvider>
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
