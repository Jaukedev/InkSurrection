import {createStore, combineReducers} from 'redux'
import {filtroReducer} from '../Reducer/filtroReducer'

 const reducers = combineReducers({
    filtro: filtroReducer
});

export const store = createStore(
  reducers
);