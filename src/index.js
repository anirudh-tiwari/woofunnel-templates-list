/**
 * External dependencies
 */
import {Provider} from "react-redux";
import {isEmpty} from 'lodash';
 
/**
 * WordPress dependencies
 */
import { render, useState, Suspense } from '@wordpress/element';
import {Snackbar} from "@wordpress/components";
import '@wordpress/components/build-style/style.css';

/**
 * Internal dependencies
 */
import store from './store';
import {SnackBarContext, setPublicPath} from "./utils";
import BWFLoading from "./components/bwf-loading";
import FunnelTemplates from './templates';
// import './assets/css/global.scss';
// import './style.scss';

setPublicPath();
const App = () => {
    const [snackText, setSnackText] = useState('');
    return (
        <Provider store={store}>
        <SnackBarContext.Provider value={setSnackText}>
            <Suspense fallback={<BWFLoading />}>
                <FunnelTemplates />
            </Suspense>
        </SnackBarContext.Provider>
        {!isEmpty(snackText) && <Snackbar className="bwf-global-snackbar">{snackText}</Snackbar>}
        </Provider>
    );
};

render(
	<App />,
	document.getElementById( 'bwf-templates-list' )
);
