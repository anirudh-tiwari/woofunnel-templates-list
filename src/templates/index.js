/**
 * External dependencies
 */
import classNames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Dropdown, Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import templateDispatchers from '../store/dispatchers/templates';
import TemplatesSelectors from '../store/selectors/templates';
import BWFLoading from '../components/bwf-loading';
import TemplatesPreview from './preview-template';
import TemplateSteps from './template-steps';
import './style.scss';
import './template-style.scss';

const FunnelTemplates = () => {
	const [ type, setType ] = useState( 'funnel' );
	const [ activeEditor, setactiveEditor ] = useState( 'elementor' );
	const [ isOpen, setOpen ] = useState( false );
	const [ templatePreview, setPreviewTemplate ] = useState( {
		id: '',
		template: {},
		isSelected: false,
	} );
	const {
		getTemplates,
		getBuilders,
		getFilters,
		// getDefaultBuilder,
		templateLoading,
	} = TemplatesSelectors();
	const { fetch: fetchTemplates } = templateDispatchers();

	const templatesList = getTemplates();
	const templateEditors = getBuilders();
	const templateFilters = getFilters();

	const currentActiveFilt =
		undefined !== templateFilters[ type ] &&
		! isEmpty( templateFilters[ type ] )
			? Object.keys( templateFilters[ type ] )[ 0 ]
			: false;
	const [ activeFilter, setTemplateFilter ] = useState( currentActiveFilt );

	/**Update CurrentActive filter by template group/pages */
	useEffect( () => {
		setTemplateFilter( currentActiveFilt );
	}, [ templateFilters, templateEditors ] );

	useEffect( () => {
		fetchTemplates();
	}, [] );

	const getTemplateFilters = () => {
		const templateFilterData = templateFilters[ type ];
		/** Check if template group/pages have filters */
		if (
			undefined === templateFilterData ||
			isEmpty( templateFilterData )
		) {
			return;
		}

		const tempFilters = [];
		for ( const key in templateFilterData ) {
			tempFilters.push(
				<label
					className={ classNames( 'wffn_filter_field', {
						wffn_selected_filter: activeFilter === key,
					} ) }
					key={ key }
				>
					<input
						type="radio"
						name="wffn-filter-type"
						onChange={ () => setTemplateFilter( key ) }
					/>
					{ templateFilterData[ key ] }
				</label>
			);
		}
		return tempFilters;
	};

	const getTemplateFilterCheck = ( template ) => {
		if ( false === currentActiveFilt ) {
			return true;
		} else if ( 'all' === activeFilter ) {
			return true;
		} else if ( 'wc_checkout' === type ) {
			return activeFilter === template.no_steps;
		} else if ( template.group ) {
			return Array.isArray( template.group )
				? template.group.includes( activeFilter )
				: activeFilter === template.group;
		}
		return false;
	};

	const getTemplateEditor = ( onClose ) => {
		const tempEditors = [];
		const editorList = templateEditors[ type ];
		for ( const key in editorList ) {
			tempEditors.push(
				<label className="wffn_dropdown_fields" key={ key }>
					<input
						name="wffn_template_editor"
						type="radio"
						value={ key }
						onChange={ () => {
							setactiveEditor( key );
							onClose();
							// wantThisDefaultEditor(key);
						} }
						checked={ key === activeEditor ? 'checked' : false }
					/>
					<span>{ editorList[ key ] }</span>
				</label>
			);
		}
		return tempEditors;
	};

	const getTemplateList = () => {
		const designTemplate = [];
		const templatefilterList = templatesList[ type ]
			? templatesList[ type ]
			: {};
		const templatesData = templatefilterList[ activeEditor ]
			? templatefilterList[ activeEditor ]
			: {};

		for ( const templateID in templatesData ) {
			const template = templatesData[ templateID ];
			if ( getTemplateFilterCheck( template ) ) {
				// check current active filter
				designTemplate.push(
					<div className="wffn_temp_card" key={ templateID }>
						{ template?.build_from_scratch ? (
							<div className="bwf-display-none"></div>
						) : (
							<div className="wffn_template_sec">
								{ 'yes' === template?.pro ? (
									<div className="wffn_template_sec_ribbon wffn-pro">
										{ /* {getRibbonName(template)} */ }Pro
									</div>
								) : (
									''
								) }
								<div
									className={
										template?.is_pro
											? 'wffn_template_sec_design_pro'
											: 'wffn_template_sec_design'
									}
								>
									<img
										src={ template?.thumbnail }
										className="wffn_img_temp"
										alt="Template"
									/>
									<div className="wffn_temp_overlay">
										<div className="wffn_temp_middle_align">
											<div className="wffn_pro_template">
												{ /* <div className="wffn_btn_white wffn_display_block">{ template?.name }</div> */ }
												<a
													onClick={ ( e ) => {
														setOpen( true ),
															setPreviewTemplate(
																{
																	id: templateID,
																	template: template,
																	isSelected: false,
																}
															),
															e.preventDefault();
													} }
													className="wffn_steps_btn wffn_steps_btn_success"
												>
													{ __(
														'Preview',
														'funnel-builder'
													) }
												</a>
											</div>
										</div>
									</div>
								</div>
								<div className="wffn_template_sec_meta">
									<div className="wffn_template_meta_left">
										{ template?.name }
									</div>
									<div className="wffn_template_meta_right"></div>
								</div>
							</div>
						) }
					</div>
				);
			}
		}
		return designTemplate;
	};

	return (
		<>
			{ templateLoading() ? (
				<div
					style={ {
						height: '350px',
						display: 'grid',
						placeContent: 'center',
					} }
				>
					{ <BWFLoading size={ 'xxl' } /> }
				</div>
			) : (
				<div className="wffn_template_wrap">
					<div id="wffn_design_container">
						<div className={ 'wffn_tabs' }>
							<TemplateSteps
								activeTemplateType={ type }
								setTemplateType={ setType }
							/>
						</div>
						<div className="wffn_tab_container">
							<div className="wffn_template_header">
								<div className="wffn_template_header_item">
									<div className="wffn_filter_container">
										{ getTemplateFilters() }
									</div>
								</div>
								<div className="header_item">
									<div className="wffn_template_editor">
										<span className="wffn_editor_field_label">
											{ __(
												'Page Builder:',
												'funnel-builder'
											) }
										</span>
										<div className="wffn_field_select_dropdown">
											<Dropdown
												className="wffn_field_dropdown_container"
												position="bottom right"
												renderToggle={ ( {
													isOpen,
													onToggle,
												} ) => (
													<div
														className="wffn_field_select_label"
														onClick={ onToggle }
														aria-expanded={ isOpen }
													>
														{ templateEditors[
															type
														] &&
															templateEditors[
																type
															][ activeEditor ] }
														&nbsp;
														<Icon icon="arrow-down-alt2" />
													</div>
												) }
												renderContent={ ( {
													onClose,
												} ) => (
													<div className="wffn_field_dropdown">
														<div className="wffn_dropdown_header">
															<label className="wffn_dropdown_header_label">
																{ __(
																	'Select Page Builder',
																	'funnle-builder'
																) }
															</label>
														</div>
														<div className="wffn_dropdown_body">
															{ getTemplateEditor(
																onClose
															) }
														</div>
													</div>
												) }
											/>
										</div>
									</div>
								</div>
							</div>
							{
								<div
									className="wffn_tab-content"
									style={ { paddingTop: '20px' } }
								>
									<div className="wffn_pick_template">
										{ getTemplateList() }
									</div>
								</div>
							}
						</div>
					</div>
					<TemplatesPreview
						isOpen={ isOpen }
						onRequestClose={ setOpen }
						templateList={ templatesList }
						activeEditor={ activeEditor }
						templateID={ templatePreview.id }
						template={ templatePreview.template }
						type={ type }
						// importTemplate={ ( template ) => {
						// 	importTemplate( template );
						// } }
						// importing={ importing }
						isSelected={ templatePreview.isSelected }
						// templateGroup={templateGroup}
						// activeGroup={activeTemplateGroup}
						getTemplateFilterCheck={ getTemplateFilterCheck }
						// hasPRO={hasPRO}
					/>
				</div>
			) }
		</>
	);
};

export default FunnelTemplates;
