/**
 * External dependencies
 */
import classnames from 'classnames';
import { Component, createRef } from '@wordpress/element';
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import './style.scss';
import BWFLoading from '../bwf-loading';

/**
 * WebPreview component to display an iframe of another page.
 */
class WebPreview extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isLoading: true,
		};

		this.iframeRef = createRef();
		this.setLoaded = this.setLoaded.bind( this );
	}

	componentDidMount() {
		this.iframeRef.current.addEventListener( 'load', this.setLoaded );
	}

	setLoaded() {
		this.setState( { isLoading: false } );
		// this.props.onLoad();
	}
	componentDidUpdate( prevProps, prevState ) {
		if ( !! this.props.src && this.props.src !== prevProps.src ) {
			this.setState( { isLoading: true } );
		}
	}

	render() {
		const {
			className,
			loadingContent = <BWFLoading size={ 'xxl' } />,
			src,
			title,
		} = this.props;
		const { isLoading } = this.state;

		const classes = classnames( 'wffn-web-preview', className, {
			'is-loading': isLoading,
		} );

		return (
			<div className={ classes }>
				{ isLoading && loadingContent }
				<div className="wffn-web-preview__iframe-wrapper">
					<iframe
						ref={ this.iframeRef }
						title={ title }
						src={ src }
					/>
				</div>
			</div>
		);
	}
}

export default WebPreview;
