<?php
/**
 * Plugin Name: Fish Catch Block
 * Description: A simple WordPress block for displaying fish catch information.
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL-2.0-or-later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue block assets
 */
function fish_catch_block_assets() {
    // Check if the block.json file exists in the build directory
    $block_json_path = plugin_dir_path(__FILE__) . 'build/fish-catch/block.json';
    
    if (file_exists($block_json_path)) {
        $metadata = json_decode(file_get_contents($block_json_path), true);
        
        // Enqueue editor script
        if (isset($metadata['editorScript'])) {
            wp_enqueue_script(
                'fish-catch-block-editor',
                plugin_dir_url(__FILE__) . 'build/fish-catch/index.js',
                $metadata['editorScriptDependencies'] ?? array('wp-blocks', 'wp-element', 'wp-editor'),
                $metadata['version'] ?? '1.0.0'
            );
        }
        
        // Enqueue editor style
        if (isset($metadata['editorStyle'])) {
            wp_enqueue_style(
                'fish-catch-block-editor',
                plugin_dir_url(__FILE__) . 'build/fish-catch/index.css',
                array(),
                $metadata['version'] ?? '1.0.0'
            );
        }
        
        // Enqueue frontend style
        if (isset($metadata['style'])) {
            wp_enqueue_style(
                'fish-catch-block-style',
                plugin_dir_url(__FILE__) . 'build/fish-catch/style-index.css',
                array(),
                $metadata['version'] ?? '1.0.0'
            );
        }
        
    }
}
add_action('enqueue_block_assets', 'fish_catch_block_assets');

/**
 * Enqueue frontend scripts
 */
function fish_catch_block_frontend_assets() {

    
        // Enqueue frontend script for map and gallery functionality  
        wp_enqueue_script(
            'fish-catch-block-frontend',
            plugin_dir_url(__FILE__) . 'frontend.js',
            array(),
            '1.0.0',
            true
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

}
add_action('wp_enqueue_scripts', 'fish_catch_block_frontend_assets');

/**
 * Register the block
 */
function fish_catch_block_init() {
    $block_json_path = plugin_dir_path(__FILE__) . 'build/fish-catch/block.json';
    
    if (file_exists($block_json_path)) {
        register_block_type($block_json_path);
    }
}
add_action('init', 'fish_catch_block_init');
