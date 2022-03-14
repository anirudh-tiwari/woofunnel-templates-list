import useApiStore from "../api-store";

import templatesReducer from "./reducers/templates";

const reducers = [
    templatesReducer,
];
const store = useApiStore(reducers);

export default store;