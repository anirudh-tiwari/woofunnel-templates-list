/**
 * External dependencies
 */
import classNames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { useEffect, useState, useRef } from '@wordpress/element';
import { Dropdown, Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import templateDispatchers from '../store/dispatchers/templates';
import TemplatesSelectors from '../store/selectors/templates';
import TemplatesPreview from './preview-template';
import TemplateSteps from './template-steps';
import TemplateLoader from './template-loader';
import SVGIcon from '../components/svg-icon';
import './style.scss';
import './template-style.scss';
import LazyImage from '../components/bwf-image';

const FunnelTemplates = () => {
	const [ type, setType ] = useState( 'funnel' );
	const [ activeEditor, setactiveEditor ] = useState( 'elementor' );
	const [ isOpen, setOpen ] = useState( false );
	// const [ loaded, setLoaded ] = useState( false );
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
	const imageRef = useRef();
	/**Update CurrentActive filter by template group/pages */
	useEffect( () => {
		setTemplateFilter( currentActiveFilt );
	}, [ templateFilters, templateEditors, type ] );

	useEffect( () => {
		fetchTemplates();
	}, [] );

	// useEffect( () => {
	// 	setLoaded( false );
	// }, [ type ] );

	// const onLoad = () => {
	// 	setLoaded( true );
	// };

	// useEffect( () => {
	// 	if ( ref.current && ref.current.complete ) {
	// 		onLoad();
	// 	}
	// 	console.log( 'ani', ref.current?.complete );
	// }, [ ref, loaded, onLoad, type ] );

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
						checked={ activeFilter === key }
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
				! template.build_from_scratch &&
					designTemplate.push(
						<div className="wffn_temp_card" key={ templateID }>
							<div className="wffn_template_sec">
								{ 'yes' === template?.pro ? (
									<div className="wffn_template_sec_ribbon wffn-pro">
										{ /* {getRibbonName(template)} */ }
										Pro
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
									{ /* <img
										src={ template?.thumbnail }
										className="wffn_img_temp"
										alt="Template"
										ref={ imageRef }
										onLoad={ () => {
											console.log(
												'RefImage',
												imageRef.current
											);
										} }
									/> */ }
									<LazyImage
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
																	template,
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
									<div className="wffn_template_meta_right">
										{ 'funnel' === type &&
										template.steps ? (
											<>
												<svg
													fill="#0073aa"
													xmlns="http://www.w3.org/2000/svg"
													width="18"
													height="18"
													viewBox="0 0 48 48"
												>
													<path d="M 28.591797 6.0019531 C 28.418672 5.9915781 28.243672 6.012 28.076172 6.0625 L 6.0761719 12.5625 C 5.4711719 12.7415 5.0419063 13.280156 5.0039062 13.910156 C 4.9659062 14.540156 5.3252969 15.125953 5.9042969 15.376953 L 20.904297 21.876953 C 21.093297 21.958953 21.296 22 21.5 22 C 21.643 22 21.786781 21.9785 21.925781 21.9375 L 43.925781 15.4375 C 44.530781 15.2585 44.958094 14.719844 44.996094 14.089844 C 45.034094 13.459844 44.676656 12.874047 44.097656 12.623047 L 29.097656 6.1230469 C 28.936656 6.0520469 28.764922 6.0123281 28.591797 6.0019531 z M 6.515625 19.492188 A 1.50015 1.50015 0 0 0 5.9042969 22.376953 L 20.904297 28.876953 A 1.50015 1.50015 0 0 0 21.925781 28.939453 L 43.925781 22.439453 A 1.5011044 1.5011044 0 1 0 43.074219 19.560547 L 21.597656 25.908203 L 7.0957031 19.623047 A 1.50015 1.50015 0 0 0 6.515625 19.492188 z M 6.515625 26.492188 A 1.50015 1.50015 0 0 0 5.9042969 29.376953 L 20.904297 35.876953 A 1.50015 1.50015 0 0 0 21.925781 35.939453 L 43.925781 29.439453 A 1.5011044 1.5011044 0 1 0 43.074219 26.560547 L 21.597656 32.908203 L 7.0957031 26.623047 A 1.50015 1.50015 0 0 0 6.515625 26.492188 z M 6.515625 33.492188 A 1.50015 1.50015 0 0 0 5.9042969 36.376953 L 20.904297 42.876953 A 1.50015 1.50015 0 0 0 21.925781 42.939453 L 43.925781 36.439453 A 1.5011044 1.5011044 0 1 0 43.074219 33.560547 L 21.597656 39.908203 L 7.0957031 33.623047 A 1.50015 1.50015 0 0 0 6.515625 33.492188 z"></path>
												</svg>
												{ sprintf(
													_n(
														'%s step',
														'%s steps',
														template.steps.length,
														'funel-builder'
													),
													template.steps.length
												) }
											</>
										) : null }
									</div>
								</div>
							</div>
						</div>
					);
			}
		}
		return designTemplate;
	};

	return (
		<>
			{ templateLoading() ? (
				<TemplateLoader />
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
														<span>
															{ templateEditors[
																type
															] &&
																templateEditors[
																	type
																][
																	activeEditor
																] }
														</span>
														&nbsp;
														<SVGIcon
															icon="down-arrow"
															style={
																isOpen
																	? {
																			transform:
																				'rotate(180deg)',
																	  }
																	: {}
															}
														/>
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
								<div className="wffn_tab-content">
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
						isSelected={ templatePreview.isSelected }
						activeGroup={ type }
						getTemplateFilterCheck={ getTemplateFilterCheck }
					/>
				</div>
			) }
		</>
	);
};

export default FunnelTemplates;
