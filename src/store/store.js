import { createStore, applyMiddleware } from 'redux'
import logger from "redux-logger"
import thunk from 'redux-thunk'
import reducer from '../reducers'
import { loadState, saveState } from './localStorage'

const persistedState = loadState();

const store = createStore(reducer, persistedState, applyMiddleware(thunk, logger));

store.subscribe(() => {
    saveState(store.getState())
})

export default store