import classNames from 'classnames';
const templateGroup = [
	{
		key: 'funnel',
		label: 'Funnels',
	},
	{
		key: 'optin',
		label: 'Optin Pages',
	},
	{
		key: 'landing',
		label: 'Sales Pages',
	},
	{
		key: 'wc_checkout',
		label: 'Checkouts',
	},
	{
		key: 'upsell',
		label: 'One Click Upsells',
	},
	{
		key: 'wc_thankyou',
		label: 'Thank You Pages',
	},
];
export default function TemplateSteps( {
	activeTemplateType,
	setTemplateType,
} ) {
	return (
		<div className={ 'bwf-step-wrapper' }>
			{ templateGroup.map( ( { key, label } ) => (
				<div
					key={ key }
					className={ classNames( 'bwf-step-brick', {
						'bwf-active-step': activeTemplateType === key,
					} ) }
					onClick={ () => setTemplateType( key ) }
				>
					{ label }
				</div>
			) ) }
		</div>
	);
}
