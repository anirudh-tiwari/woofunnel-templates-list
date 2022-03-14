const defaultStateVars = {
    templates: {},
    builders: {},
    filters:{},
    default_builder:'',
    isLoading:true
};

const onResponseSuccess = (state, response) => {
    return {
        ...state,
        templates: response.hasOwnProperty('templates') ? response.templates : {},
        builders: response.hasOwnProperty('all_builder') ? response.all_builder : {},
        filters:response.hasOwnProperty('sub_filter_group') ? response.sub_filter_group : {},
        default_builder:response.hasOwnProperty('default_builder') ? response.default_builder : '',
        isLoading: false,
        error: null,
    }
};

const onResponseFailed = (state, error) => ({
    ...state,
    isLoading: false,
    error: error,
});

const templatesReducer = {
    name: 'templates',
    defaultStateVars,
    onResponseSuccess,
    onResponseFailed
};

export default templatesReducer;