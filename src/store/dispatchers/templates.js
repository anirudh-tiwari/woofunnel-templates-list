import globalGetDispatchers from '../../api-store/dispatcher';
import {getApiPath} from "../../utils";

const getDispatchers = () => {
    const {fetch, setStateProp, ...remainingDispatchers} = globalGetDispatchers('templates');

    return {
        ...remainingDispatchers,
        fetch: () => {
            fetch(
                'GET',
                getApiPath('/woofunnels-admin/funnels/get-templates/'),
            )
        },
        makeDefaultEditor:(editor='') => setStateProp( 'default_builder', editor )
    }
};

export default getDispatchers;