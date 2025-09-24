/**
 * Registers the Fish Catch Map block
 */

import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Style imports
 */
import './style.scss';

/**
 * Register the Fish Catch Map block
 */
registerBlockType(metadata.name, {
    edit: Edit,
    save,
});
