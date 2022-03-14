import {applyMiddleware, combineReducers, createStore} from "redux";
import createSagaMiddleware from 'redux-saga';
import {composeWithDevTools} from 'redux-devtools-extension';
import watcher from "./saga";
import apiClientReducer from "./reducer";

const sagaMiddleware = createSagaMiddleware();
const useApiStore = (reducerDataArray = []) => {

    const reducers = {};
    for (const reducerData of reducerDataArray) {
        reducers[reducerData.name] = apiClientReducer(reducerData);
    }

    const store = createStore(combineReducers(reducers), composeWithDevTools(
        applyMiddleware(sagaMiddleware)
    ));

    sagaMiddleware.run(watcher);

    return store;
};

export default useApiStore;


