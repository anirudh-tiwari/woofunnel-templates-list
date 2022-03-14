import { createContext } from '@wordpress/element';
import { useEffect } from '@wordpress/element';

const development = 'development';
const production = 'production';
export const appMode = envMode;

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
			appMode === production ? bwftl.app_path : '';
	}
};



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


