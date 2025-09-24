/**
 * Registers a new block provided a unique name and an object defining its behavior.
 */
console.log('LOADING: /src/fish-catch/index.js');
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Frontend JavaScript - only runs on frontend
 */
if (typeof window !== 'undefined' && typeof window.wp === 'undefined') {
	console.log('Running frontend code');
	// Import and execute frontend code
	import('./frontend.js').then(() => {
		console.log('Frontend imported successfully');
	}).catch(err => {
		console.error('Frontend import failed:', err);
	});
}



/**
 * Deprecated save function for old block format
 */
const deprecatedSave = () => {
	return (
		<div className="wp-block-fish-catch-fish-catch">
			<h3>Fish Catch Block</h3>
			<p>This is a simple fish catch block on the frontend.</p>
		</div>
	);
};

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,

} );
