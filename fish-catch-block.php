<?php
/**
 * Plugin Name: Fish Catch Block
 * Plugin URI: https://github.com/gin0115/fish-catch-block
 * Description: A comprehensive WordPress block for anglers to document and display their fishing catches with locations, photos, and interactive maps.
 * Version: 0.0.2
 * Author: Glynn Quelch
 * Author URI: https://github.com/gin0115
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: fish-catch
 * GitHub Plugin URI: gin0115/fish-catch-block
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'FISH_CATCH_BLOCK_VERSION', '0.0.2' );
define( 'FISH_CATCH_BLOCK_DIR', plugin_dir_path( __FILE__ ) );
define( 'FISH_CATCH_BLOCK_URL', plugin_dir_url( __FILE__ ) );

/**
 * Enqueue block assets for editor and frontend.
 *
 * @return void
 */
function fish_catch_block_assets() {
	// Check if the block.json file exists in the build directory
	$block_json_path = plugin_dir_path( __FILE__ ) . 'build/fish-catch/block.json';

	if ( file_exists( $block_json_path ) ) {
		$metadata = json_decode( file_get_contents( $block_json_path ), true );

		// Enqueue editor script
		if ( isset( $metadata['editorScript'] ) ) {
			wp_enqueue_script(
				'fish-catch-block-editor',
				plugin_dir_url( __FILE__ ) . 'build/fish-catch/index.js',
				$metadata['editorScriptDependencies'] ?? array( 'wp-blocks', 'wp-element', 'wp-editor' ),
				$metadata['version'] ?? '0.0.2'
			);
		}

		// Enqueue editor style
		if ( isset( $metadata['editorStyle'] ) ) {
			wp_enqueue_style(
				'fish-catch-block-editor',
				plugin_dir_url( __FILE__ ) . 'build/fish-catch/index.css',
				array(),
				$metadata['version'] ?? '0.0.2'
			);
		}

		// Enqueue frontend style
		if ( isset( $metadata['style'] ) ) {
			wp_enqueue_style(
				'fish-catch-block-style',
				plugin_dir_url( __FILE__ ) . 'build/fish-catch/style-index.css',
				array(),
				$metadata['version'] ?? '0.0.2'
			);
		}
	}
}
add_action( 'enqueue_block_assets', 'fish_catch_block_assets' );

/**
 * Add custom image sizes for fish catch galleries.
 *
 * @return void
 */
function fish_catch_block_add_image_sizes() {
	add_image_size( 'fish-catch-thumb', 60, 60, true );   // List view thumbnails
	add_image_size( 'fish-catch-grid', 300, 300, true );  // Grid view images
}
add_action( 'after_setup_theme', 'fish_catch_block_add_image_sizes' );

/**
 * Make custom image sizes selectable in WordPress admin.
 *
 * @param array $sizes Existing image sizes.
 *
 * @return array Modified image sizes including custom sizes.
 */
function fish_catch_block_add_image_size_names( $sizes ) {
	return array_merge(
		$sizes,
		array(
			'fish-catch-thumb' => __( 'Fish Catch Thumbnail (60x60)', 'fish-catch' ),
			'fish-catch-grid'  => __( 'Fish Catch Grid (300x300)', 'fish-catch' ),
		)
	);
}
add_filter( 'image_size_names_choose', 'fish_catch_block_add_image_size_names' );

/**
 * Enqueue frontend scripts and styles for map and gallery functionality.
 *
 * @return void
 */
function fish_catch_block_frontend_assets() {

		// Enqueue frontend script for map and gallery functionality
		// Now with proper dependencies on Leaflet
		wp_enqueue_script(
			'fish-catch-block-frontend',
			plugin_dir_url( __FILE__ ) . 'assets/frontend.js',
			array( 'leaflet-js', 'leaflet-providers-js' ),
			'1.0.0',
			true
		);

		// Enqueue frontend CSS for lightbox and interactive elements
		wp_enqueue_style(
			'fish-catch-block-frontend-css',
			plugin_dir_url( __FILE__ ) . 'assets/frontend.css',
			array(),
			'1.0.0'
		);

	// Enqueue Leaflet for maps
	wp_enqueue_style(
		'leaflet-css',
		'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
		array(),
		'1.9.4'
	);

	wp_enqueue_script(
		'leaflet-js',
		'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
		array(),
		'1.9.4',
		true
	);

	// Enqueue Leaflet Providers for map themes
	wp_enqueue_script(
		'leaflet-providers-js',
		'https://unpkg.com/leaflet-providers@2.0.0/leaflet-providers.js',
		array( 'leaflet-js' ),
		'2.0.0',
		true
	);

	// Pass API keys to frontend JavaScript
	wp_localize_script(
		'fish-catch-block-frontend',
		'fishCatchMapConfig',
		array(
			'thunderforestApiKey' => sanitize_text_field( get_option( 'fish_catch_thunderforest_api_key', '' ) ),
			'jawgAccessToken'     => sanitize_text_field( get_option( 'fish_catch_jawg_access_token', '' ) ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'fish_catch_block_frontend_assets' );

/**
 * Register settings for map API keys in the general settings page.
 *
 * @return void
 */
function fish_catch_block_register_settings() {
	// Register Thunderforest API key setting
	register_setting(
		'general',
		'fish_catch_thunderforest_api_key',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => false,
			'default'           => '',
		)
	);

	// Register Jawg access token setting
	register_setting(
		'general',
		'fish_catch_jawg_access_token',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => false,
			'default'           => '',
		)
	);

	// Add settings section
	add_settings_section(
		'fish_catch_map_settings',
		__( 'Fish Catch Block - Map Settings', 'fish-catch-block' ),
		'fish_catch_block_settings_section_callback',
		'general'
	);

	// Add Thunderforest API key field
	add_settings_field(
		'fish_catch_thunderforest_api_key',
		__( 'Thunderforest API Key', 'fish-catch-block' ),
		'fish_catch_thunderforest_api_key_callback',
		'general',
		'fish_catch_map_settings'
	);

	// Add Jawg access token field
	add_settings_field(
		'fish_catch_jawg_access_token',
		__( 'Jawg Maps Access Token', 'fish-catch-block' ),
		'fish_catch_jawg_access_token_callback',
		'general',
		'fish_catch_map_settings'
	);
}
add_action( 'admin_init', 'fish_catch_block_register_settings' );

/**
 * Callback for the settings section description.
 *
 * @return void
 */
function fish_catch_block_settings_section_callback() {
	echo '<p>' . esc_html__( 'Configure API keys for map providers that require authentication.', 'fish-catch-block' ) . '</p>';
}

/**
 * Callback for Thunderforest API key field.
 *
 * @return void
 */
function fish_catch_thunderforest_api_key_callback() {
	$value = get_option( 'fish_catch_thunderforest_api_key', '' );
	echo '<input type="text" id="fish_catch_thunderforest_api_key" name="fish_catch_thunderforest_api_key" value="' . esc_attr( $value ) . '" class="regular-text" />';
	echo '<p class="description">' . esc_html__( 'Required for Thunderforest map themes (Landscape, Transport, etc.). Get your API key from', 'fish-catch-block' ) . ' <a href="https://www.thunderforest.com/maps/api/" target="_blank">Thunderforest</a></p>';
}

/**
 * Callback for Jawg access token field.
 *
 * @return void
 */
function fish_catch_jawg_access_token_callback() {
	$value = get_option( 'fish_catch_jawg_access_token', '' );
	echo '<input type="text" id="fish_catch_jawg_access_token" name="fish_catch_jawg_access_token" value="' . esc_attr( $value ) . '" class="regular-text" />';
	echo '<p class="description">' . esc_html__( 'Required for Jawg Maps themes (Streets, Dark, Matrix, etc.). Get your access token from', 'fish-catch-block' ) . ' <a href="https://www.jawg.io/" target="_blank">Jawg Maps</a></p>';
}

/**
 * Register the blocks for Fish Catch and Fish Catch Map.
 *
 * @return void
 */
function fish_catch_block_init() {
	// Register the main fish catch block
	$fish_catch_block_path = plugin_dir_path( __FILE__ ) . 'build/fish-catch/block.json';
	if ( file_exists( $fish_catch_block_path ) ) {
		register_block_type( $fish_catch_block_path );
	}

	// Register the fish catch map block
	$fish_catch_map_block_path = plugin_dir_path( __FILE__ ) . 'build/fish-catch-map/block.json';
	if ( file_exists( $fish_catch_map_block_path ) ) {
		register_block_type( $fish_catch_map_block_path );
	}
}
add_action( 'init', 'fish_catch_block_init' );

/**
 * Pass API keys to block editor scripts via wp_localize_script.
 *
 * @return void
 */
function fish_catch_block_editor_assets() {
	// Enqueue Leaflet for editor maps
	wp_enqueue_style(
		'leaflet-css',
		'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
		array(),
		'1.9.4'
	);

	wp_enqueue_script(
		'leaflet-js',
		'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
		array(),
		'1.9.4',
		true
	);

	// Enqueue Leaflet Providers for map themes
	wp_enqueue_script(
		'leaflet-providers-js',
		'https://unpkg.com/leaflet-providers@2.0.0/leaflet-providers.js',
		array( 'leaflet-js' ),
		'2.0.0',
		true
	);

	$api_config = array(
		'thunderforestApiKey' => sanitize_text_field( get_option( 'fish_catch_thunderforest_api_key', '' ) ),
		'jawgAccessToken'     => sanitize_text_field( get_option( 'fish_catch_jawg_access_token', '' ) ),
	);

	// Pass API keys to main fish catch block editor
	wp_localize_script( 'fish-catch-fish-catch-editor-script', 'fishCatchMapConfig', $api_config );

	// Pass API keys to fish catch map block editor
	wp_localize_script( 'fish-catch-fish-catch-map-editor-script', 'fishCatchMapConfig', $api_config );
}
add_action( 'enqueue_block_editor_assets', 'fish_catch_block_editor_assets' );

/**
 * Register custom meta fields for fish catch data.
 *
 * @return void
 */
function fish_catch_register_meta_fields() {
	// Register coordinates meta field
	register_post_meta(
		'',
		'fish_catch_coordinates',
		array(
			'show_in_rest'  => array(
				'schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'latitude'  => array(
							'type'        => 'number',
							'description' => 'Latitude coordinate',
						),
						'longitude' => array(
							'type'        => 'number',
							'description' => 'Longitude coordinate',
						),
					),
					'additionalProperties' => false,
				),
			),
			'single'        => true,
			'type'          => 'object',
			'description'   => 'Fishing location coordinates',
			'default'       => array(),
			'auth_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	// Register total fish count meta field
	register_post_meta(
		'',
		'fish_catch_total_count',
		array(
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'integer',
			'description'   => 'Total number of fish caught',
			'default'       => 0,
			'auth_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);
}
add_action( 'init', 'fish_catch_register_meta_fields' );

/**
 * Helper function to get fish catch meta data.
 *
 * @param integer|null $post_id Post ID. Defaults to current post.
 *
 * @return array Fish catch meta data.
 */
function get_fish_catch_meta( $post_id = null ) {
	if ( ! $post_id ) {
		$post_id = get_the_ID();
	}

	$coordinates = get_post_meta( $post_id, 'fish_catch_coordinates', true );
	$total_count = get_post_meta( $post_id, 'fish_catch_total_count', true );

	return array(
		'coordinates' => $coordinates ?: array(),
		'total_count' => (int) $total_count,
	);
}

/**
 * Add fish catch meta to REST API response for posts.
 *
 * @return void
 */
function add_fish_catch_meta_to_rest_api() {
	register_rest_field(
		'post',
		'fish_catch_meta',
		array(
			'get_callback' => function ( $post ) {
				return get_fish_catch_meta( $post['id'] );
			},
			'schema'       => array(
				'description' => 'Fish catch metadata',
				'type'        => 'object',
				'properties'  => array(
					'coordinates' => array(
						'type'       => 'object',
						'properties' => array(
							'latitude'  => array( 'type' => 'number' ),
							'longitude' => array( 'type' => 'number' ),
						),
					),
					'total_count' => array( 'type' => 'integer' ),
				),
			),
		)
	);
}
add_action( 'rest_api_init', 'add_fish_catch_meta_to_rest_api' );

/**
 * Add fish catch query parameters to REST API collection params.
 *
 * @param array $query_params Existing query parameters.
 *
 * @return array Modified query parameters including fish catch params.
 */
function add_fish_catch_rest_query_params( $query_params ) {
	$query_params['fish_catch_min_count'] = array(
		'description' => 'Filter posts by minimum fish catch count',
		'type'        => 'integer',
		'minimum'     => 0,
	);

	$query_params['fish_catch_has_coords'] = array(
		'description' => 'Filter posts that have coordinates',
		'type'        => 'boolean',
	);

	return $query_params;
}
add_filter( 'rest_post_collection_params', 'add_fish_catch_rest_query_params' );

/**
 * Handle fish catch query parameters in REST API queries.
 *
 * @param array           $args    WP_Query arguments.
 * @param WP_REST_Request $request REST API request object.
 *
 * @return array Modified WP_Query arguments.
 */
function handle_fish_catch_rest_query( $args, $request ) {
	$min_count  = $request->get_param( 'fish_catch_min_count' );
	$has_coords = $request->get_param( 'fish_catch_has_coords' );

	if ( $min_count !== null || $has_coords !== null ) {
		$meta_query = isset( $args['meta_query'] ) ? $args['meta_query'] : array();

		if ( $min_count !== null ) {
			$meta_query[] = array(
				'key'     => 'fish_catch_total_count',
				'value'   => (int) $min_count,
				'compare' => '>=',
			);
		}

		if ( $has_coords ) {
			$meta_query[] = array(
				'key'     => 'fish_catch_coordinates',
				'compare' => 'EXISTS',
			);
		}

		$args['meta_query'] = $meta_query;
	}

	return $args;
}
add_filter( 'rest_post_query', 'handle_fish_catch_rest_query', 10, 2 );
