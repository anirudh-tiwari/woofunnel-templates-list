/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Modal, Button, Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import WebPreview from '../components/web-preview';

export default function TemplatesPreview( {
	isOpen,
	onRequestClose,
	templateID,
	template,
	//  activeGroup,
	// importTemplate,
	activeEditor,
	type,
	// importing,
	templateList,
	getTemplateFilterCheck,
	// templateGroup,
	// stepType = "landing",
	// hasPRO,
	isSelected,
} ) {
	/** return null if model open is not trigger */
	if ( false === isOpen ) {
		return null;
	}

	const [ viewport, setviewport ] = useState( 'desktop' );

	const [ activeTemplate, setTemplate ] = useState( {
		id: templateID,
		name: template.name,
		pro: template.pro,
		template: template,
	} ); // use to import current active template

	const headerData =
		!! wffn_contacts_data && !! wffn_contacts_data.header_data
			? wffn_contacts_data.header_data
			: {};
	const logo = headerData.logo ? headerData.logo : '';

	useEffect( () => {
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

	let getPreviewSidebar = () => {
		let sidebarOpts = templateList[ type ][ activeEditor ]
			? templateList[ type ][ activeEditor ]
			: {};
		let previewSidebar = [];

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
						className={ classNames( 'wffn_template_page_options', {
							active_preview: activeTemplate.id == key,
						} ) }
						onClick={ () => {
							setTemplate( {
								id: key,
								name: sidebarOpts[ key ].name,
								pro: sidebarOpts[ key ].pro,
								template: sidebarOpts[ key ],
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
		return previewSidebar;
		// <div className="wffn_template_preview_sidebar">{previewSidebar}</div>;
	};
	const getPreviewTemplateID = ( slug ) => {
		if ( 'customizer' === activeEditor && 'wc_checkout' === type ) {
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
						<img
							src={ logo }
							alt={ 'Funnel Builder for WordPress' }
							width={ 148 }
						/>
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
						{ /* {hasPRO(activeTemplate.pro) ? ( */ }
						{ activeTemplate.pro ? (
							<a
								href="https://buildwoofunnels.com/exclusive-offer/"
								target="_blank"
								style={ {
									color: '#fff',
									textDecoration: 'none',
								} }
							>
								<Button
									className="wffn-import-template-btn"
									isPrimary
								>
									{ __( 'Get PRO', 'funnel-builder' ) }
								</Button>
							</a>
						) : ! isSelected ? (
							<Button
								className="wffn-import-template-btn"
								isPrimary
								// onClick={ () => {
								// 	importTemplate( activeTemplate.template );
								// } }
							>
								Buy
							</Button>
						) : (
							''
						) }
					</div>
					<div className="wffn_template_preview_close">
						<Button
							onClick={ () => {
								onRequestClose( false );
							} }
						>
							<Icon icon="no-alt" />
						</Button>
					</div>
				</div>
				<div className="wffn_template_preview_content">
					<div
						className={ classNames(
							`wffn_template_preview_inner ${
								! isSelected ? 'wffn_funnel_preview' : ''
							} `
							//  {
							//      wffn_funnel_preview:
							//          "funnel" !== activeGroup ||
							//          ("funnel" === activeGroup && template.steps),
							//  }
						) }
					>
						<WebPreview
							className={ classNames(
								'wffn_template_preview_frame',
								viewport
							) }
							title={ template.name }
							src={ `https://templates.buildwoofunnels.com/html/${ type }/${ getPreviewTemplateID(
								activeTemplate.id
							) }.html` }
						/>
					</div>
					{ ! isSelected ? (
						<div className="wffn_template_preview_sidebar">
							{ getPreviewSidebar() }
						</div>
					) : (
						''
					) }
				</div>
			</div>
		</Modal>
	) : (
		''
	);
}