import globalGetSelectors from '../../api-store/selector';

const TemplatesSelectors = () => {
	const { getStateProp, ...remainingSelectors } = globalGetSelectors( 'templates' );
	return {
		...remainingSelectors,
		getTemplates:      () => getStateProp( 'templates' ),
		getBuilders:       () => getStateProp( 'builders'  ),
		getFilters:        () => getStateProp( 'filters'  ),
		templateLoading:   () => getStateProp( 'isLoading' ),
		getDefaultBuilder: () => getStateProp( 'default_builder' )
	};
};

export default TemplatesSelectors;
