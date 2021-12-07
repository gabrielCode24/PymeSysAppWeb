import { combineReducers } from 'redux'
import productos from './productosReducer'

const reducerCombinados = combineReducers({ productos })

export default reducerCombinados