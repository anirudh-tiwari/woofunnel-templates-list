/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { Modal, Button, Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import WebPreview from '../components/web-preview';
import BWFLogo from '../assets/img/logo.svg';
import SVGIcon from '../components/svg-icon';

const templateGroup = {
	funnel: 'Funnels',
	optin: 'Optin Pages',
	landing: 'Sales Pages',
	wc_checkout: 'Checkouts',
	upsell: 'One Click Upsells',
	wc_thankyou: 'Thank You Pages',
};

export default function TemplatesPreview( {
	isOpen,
	onRequestClose,
	templateID,
	template,
	activeGroup,
	activeEditor,
	templateList,
	getTemplateFilterCheck,
} ) {
	/** return null if model open is not trigger */
	if ( false === isOpen ) {
		return null;
	}

	const [ viewport, setviewport ] = useState( 'desktop' );

	const [ stepPreview, setStepPreview ] = useState( {
		id: '',
		step: '',
		template: '',
		tempFID: '',
	} ); // Use to preview active template

	const [ activeTemplate, setTemplate ] = useState( {
		id: templateID,
		name: template.name,
		pro: template.pro,
	} ); // use to import current active template

	/** Reset stepPreview Data */
	const defaultStep =
		'funnel' === activeGroup ? template.steps[ 0 ].type : activeGroup;
	const defaultTemplateID =
		'funnel' === activeGroup ? template.steps[ 0 ].slug : templateID;
	const defaultTempFID =
		'funnel' === activeGroup
			? template.steps[ 0 ].type + '-' + template.steps[ 0 ].slug
			: templateID;

	useEffect( () => {
		setStepPreview( {
			id: defaultTemplateID,
			step: defaultStep,
			template: defaultTemplateID,
			tempFID: defaultTempFID,
		} );

		/**ScrollTop Active Template in sidebar */
		setTimeout( () => {
			let stickyActiveTemp = document.querySelector(
				'.wffn_template_page_options.active_preview'
			);
			stickyActiveTemp && stickyActiveTemp.scrollIntoView();
		}, 100 );
	}, [ isOpen ] );

	const funnlPreviewID = ( step ) => {
		return step.type + '-' + step.slug;
	};

	const getPreviewSidebar = () => {
		let sidebarOpts = templateList[ activeGroup ][ activeEditor ]
			? templateList[ activeGroup ][ activeEditor ]
			: {};
		let previewSidebar = [];

		/** preview sidebar options for non funnel steps */
		if ( 'funnel' !== activeGroup ) {
			for ( let key in sidebarOpts ) {
				if (
					true === sidebarOpts[ key ].build_from_scratch ||
					'yes' === sidebarOpts[ key ].build_from_scratch
				) {
					continue;
				}
				if ( getTemplateFilterCheck( sidebarOpts[ key ] ) ) {
					previewSidebar.push(
						<label
							key={ key }
							className={ classNames(
								'wffn_template_page_options',
								{
									active_preview: stepPreview.id == key,
								}
							) }
							onClick={ () => {
								setStepPreview( {
									id: key,
									step: activeGroup,
									template: key,
								} );
								setTemplate( {
									id: key,
									name: sidebarOpts[ key ].name,
									pro: sidebarOpts[ key ].pro,
								} );
							} }
						>
							<img src={ sidebarOpts[ key ].thumbnail } />
							<span className="wffn_template_name">
								{ sidebarOpts[ key ].name }
							</span>
						</label>
					);
				}
			}
		}

		/** preview sidebar options for funnel */
		return 'funnel' === activeGroup && template.steps ? (
			<div className="wffn_template_preview_sidebar">
				{ template.steps &&
					template.steps.map( ( fnStep ) => (
						<label
							key={ fnStep.slug }
							className={ classNames(
								'wffn_template_page_options',
								{
									active_preview:
										stepPreview.tempFID ===
										funnlPreviewID( fnStep ),
								}
							) }
							onClick={ () =>
								setStepPreview( {
									id: fnStep.slug,
									step: fnStep.type,
									template: fnStep.slug,
									tempFID: fnStep.type + '-' + fnStep.slug,
								} )
							}
						>
							<img
								src={
									templateList[ fnStep.type ][ activeEditor ][
										fnStep.slug
									].thumbnail
								}
							/>
							<span className="wffn_template_name">
								{ 'optin_ty' === fnStep.type
									? 'Optin Confirmation'
									: templateGroup[ fnStep.type ]
									? templateGroup[ fnStep.type ].slice(
											0,
											-1
									  )
									: '' }
							</span>
						</label>
					) ) }
			</div>
		) : 'funnel' !== activeGroup ? (
			<div className="wffn_template_preview_sidebar">
				{ previewSidebar }
			</div>
		) : (
			NULL
		);
	};
	const getPreviewTemplateID = ( slug ) => {
		if ( 'customizer' === activeEditor && 'wc_checkout' === activeGroup ) {
			return ( slug = 'customizer-' + slug );
		}

		if ( 'customizer' !== activeEditor ) {
			if ( slug.indexOf( '-' ) > -1 ) {
				return slug.slice( slug.indexOf( '-' ) + 1 ); //return trim slug
			}
		}

		return slug;
	};

	return isOpen ? (
		<Modal
			className="wffn_template_preview_modal"
			onRequestClose={ () => onRequestClose( false ) }
			overlayClassName="wffn_template_preview_overlay"
			isDismissible={ false }
			shouldCloseOnClickOutside={ false }
		>
			<div className="wffn_template_preview_wrap">
				<div className="wffn_template_preview_header">
					<div>
						<BWFLogo />
					</div>

					<div className="wffn_template_viewport">
						<div className="wffn_template_viewport_inner">
							<span
								className={ classNames( 'wffn_viewport_icons', {
									active: 'desktop' === viewport,
								} ) }
								onClick={ () => setviewport( 'desktop' ) }
								title="Desktop Viewport"
							>
								<Icon icon="desktop" size="24" />
							</span>
							<span
								className={ classNames( 'wffn_viewport_icons', {
									active: 'tablet' === viewport,
								} ) }
								onClick={ () => setviewport( 'tablet' ) }
								title="Tablet Viewport"
							>
								<Icon icon="tablet" size="24" />
							</span>
							<span
								className={ classNames( 'wffn_viewport_icons', {
									active: 'mobile' === viewport,
								} ) }
								onClick={ () => setviewport( 'mobile' ) }
								title="Mobile Viewport"
							>
								<Icon icon="smartphone" size="24" />
							</span>
						</div>
					</div>

					<div className="bwf-t-center">
						<a
							href="https://buildwoofunnels.com/exclusive-offer/"
							style={ {
								color: '#fff',
								textDecoration: 'none',
							} }
						>
							<Button
								className="wffn-import-template-btn"
								isPrimary
							>
								{ 'Buy Now' }
							</Button>
						</a>
					</div>
					<div className="wffn_template_preview_close">
						<Button
							onClick={ () => {
								onRequestClose( false );
							} }
						>
							<SVGIcon icon={ 'close' } size={ '14' } />
						</Button>
					</div>
				</div>
				<div className="wffn_template_preview_content">
					<div
						className={ classNames( 'wffn_template_preview_inner', {
							wffn_funnel_preview:
								'funnel' !== activeGroup ||
								( 'funnel' === activeGroup && template.steps ),
						} ) }
					>
						<WebPreview
							className={ classNames(
								'wffn_template_preview_frame',
								viewport
							) }
							title={ template.name }
							src={ `https://templates.buildwoofunnels.com/html/${
								stepPreview.step
							}/${ getPreviewTemplateID(
								stepPreview.template
							) }.html` }
						/>
					</div>
					{ getPreviewSidebar() }
				</div>
			</div>
		</Modal>
	) : (
		''
	);
}
