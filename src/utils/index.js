import { isEmpty, join } from 'lodash';
import { __ } from '@wordpress/i18n';
import moment from 'moment';
import { createContext } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { format as formatDate, gmdate } from '@wordpress/date';
import { useEffect } from '@wordpress/element';

const development = 'development';
const production = 'production';
export const appMode = envMode;

//export const getApiPath = (path) => development === appMode ? '/wp-json' + path : path;
export const getApiPath = ( path ) => path;


export const SnackBarContext = createContext( null );
export const hideSnackBar = ( context, interval = 500 ) => {
	const timeout = setTimeout( () => {
		context( null );
		clearTimeout( timeout );
	}, interval );
};


export const setPublicPath = () => {
	if ( appMode === production ) {
		__webpack_public_path__ =
			appMode === production ? wffn_contacts_data.app_path : '';
	}
};



/**
 * Parse a string suggestion, split apart by where the first matching query is.
 * Used to display matched partial in bold.
 *
 * @param {string} suggestion The item's label as returned from the API.
 * @param {string} query The search term to match in the string.
 * @return {Object} A list in three parts: before, match, and after.
 */
export function computeSuggestionMatch( suggestion, query ) {
	if ( ! query ) {
		return null;
	}
	const indexOfMatch = suggestion
		.toLocaleLowerCase()
		.indexOf( query.toLocaleLowerCase() );

	return {
		suggestionBeforeMatch: decodeEntities(
			suggestion.substring( 0, indexOfMatch )
		),
		suggestionMatch: decodeEntities(
			suggestion.substring( indexOfMatch, indexOfMatch + query.length )
		),
		suggestionAfterMatch: decodeEntities(
			suggestion.substring( indexOfMatch + query.length )
		),
	};
}


export function useOnClickOutside( ref, handler ) {
	useEffect(
		() => {
			const listener = ( event ) => {
				// Do nothing if clicking ref's element or descendent elements
				if ( ! ref.current || ref.current.contains( event.target ) ) {
					return;
				}
				handler( event );
			};
			document.addEventListener( 'mousedown', listener );
			document.addEventListener( 'touchstart', listener );
			return () => {
				document.removeEventListener( 'mousedown', listener );
				document.removeEventListener( 'touchstart', listener );
			};
		},
		// Add ref and handler to effect dependencies
		// It's worth noting that because passed in handler is a new ...
		// ... function on every render that will cause this effect ...
		// ... callback/cleanup to run every render. It's not a big deal ...
		// ... but to optimize you can wrap handler in useCallback before ...
		// ... passing it into this hook.
		[ ref, handler ]
	);
}


