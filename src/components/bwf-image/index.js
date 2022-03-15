import { useEffect, useState } from '@wordpress/element';
import classNames from 'classnames';
import './style.scss';

const LazyImage = ( { src, alt, className } ) => {
	const [ loaded, setLoaded ] = useState( false );

	useEffect( () => {
		const imgLoad = new Image();
		imgLoad.src = src;
		imgLoad.onload = () => setLoaded( true );
	}, [] );

	return (
		<>
			{ loaded ? (
				<img src={ src } className={ className } alt={ alt } />
			) : (
				<div className={ 'bwf-image-loader' }></div>
			) }
		</>
	);
};

export default LazyImage;
