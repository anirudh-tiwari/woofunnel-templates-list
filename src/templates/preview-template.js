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
import BWFLogo from '../assets/img/logo.svg';
import SVGIcon from '../components/svg-icon';

export default function TemplatesPreview( {
	isOpen,
	onRequestClose,
	templateID,
	template,
	activeEditor,
	type,
	templateList,
	getTemplateFilterCheck,
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

	const getPreviewSidebar = () => {
		const sidebarOpts = templateList[ type ][ activeEditor ]
			? templateList[ type ][ activeEditor ]
			: {};
		const previewSidebar = [];

		for ( const key in sidebarOpts ) {
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

	console.log( 'aniViewport', viewport );

	return isOpen ? (
		<Modal
			className="wffn_template_preview_modal components-modal__screen-overlay"
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
						<Button
							className="wffn-import-template-btn "
							isPrimary
							onClick={ () =>
								window.open(
									'https://buildwoofunnels.com/exclusive-offer/',
									'_self'
								)
							}
						>
							Buy
						</Button>
					</div>
					<div className="wffn_template_preview_close">
						<Button
							onClick={ () => {
								onRequestClose( false );
							} }
						>
							<SVGIcon icon="close" size="16" />
						</Button>
					</div>
				</div>
				<div className="wffn_template_preview_content">
					<div
						className={ classNames(
							`wffn_template_preview_inner ${
								! isSelected ? 'wffn_funnel_preview' : ''
							} `
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
