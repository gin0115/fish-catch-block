/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Shared services
 */
import { waitForLeaflet } from '../shared/leaflet-loader.js';
import { 
    createMap, 
    addTileLayerToMap, 
    cleanupMap, 
    getMapBounds,
    getMapConfig,
    createFishMarker
} from '../shared/map-services.js';
import {
    useBlockProps,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    ToggleControl,
    SelectControl
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Editor styles
 */
import './editor.scss';

/**
 * Shared map template configuration
 */
import { getMapTemplateOptions } from '../shared/map-templates';


/**
 * Edit component for Fish Catch Map block
 */
export default function Edit({ attributes, setAttributes }) {
    const {
        mapHeight,
        minCatchCount,
        showPostTitles,
        showCatchCount,
        mapZoom,
        mapStyle
    } = attributes;

    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    // Query posts with fish catch data
    const fishCatchPosts = useSelect((select) => {
        const { getEntityRecords } = select('core');

        return getEntityRecords('postType', 'post', {
            fish_catch_min_count: minCatchCount,
            fish_catch_has_coords: true,
            per_page: 100,
            _embed: true
        });
    }, [minCatchCount]);

    // Process posts to extract coordinates and data
    const mapData = fishCatchPosts ? fishCatchPosts
        .map(post => {
            const fishCatchMeta = post.fish_catch_meta;
            const coordinates = fishCatchMeta?.coordinates;
            const totalCount = fishCatchMeta?.total_count || 0;

            if (coordinates && coordinates.latitude && coordinates.longitude) {
                return {
                    id: post.id,
                    title: post.title?.rendered || 'Untitled',
                    latitude: parseFloat(coordinates.latitude),
                    longitude: parseFloat(coordinates.longitude),
                    totalCount: parseInt(totalCount),
                    link: post.link,
                    excerpt: post.excerpt?.rendered
                };
            }
            return null;
        })
        .filter(Boolean) : [];

    // Initialize map
    useEffect(() => {
        if (!mapRef.current || mapData.length === 0) return;

        // Wait for Leaflet to be available using shared service
        waitForLeaflet()
            .then(() => {
                console.log('Leaflet is available');
                initializeMap();
            })
            .catch((error) => {
                console.error('Failed to load Leaflet:', error);
            });

        function initializeMap() {
            if (mapInstanceRef.current) {
                cleanupMap(mapInstanceRef.current);
            }

            // Calculate bounds from all markers using shared service
            const coordinates = mapData.map(item => [item.latitude, item.longitude]);
            
            // Create map using shared service
            let map;
            if (coordinates.length === 1) {
                // Single marker - use center and zoom
                map = createMap(mapRef.current, {
                    center: coordinates[0],
                    zoom: 13
                });
            } else {
                // Multiple markers - use bounds
                const bounds = getMapBounds(coordinates);
                map = createMap(mapRef.current, {
                    bounds: bounds,
                    boundsOptions: {
                        padding: [20, 20],
                        maxZoom: 13
                    }
                });
            }

            // Add scroll wheel zoom control
            map.scrollWheelZoom.disable();

            // Add tile layer using shared service
            addTileLayerToMap(map, mapStyle, getMapConfig());

            // Add markers using shared service
            mapData.forEach(item => {
                const popupContent = `
                    <div style="min-width: 200px;">
                        <h4 style="margin: 0 0 8px 0; font-size: 14px;">${item.title}</h4>
                        ${showCatchCount ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">🎣 ${item.totalCount} catches</p>` : ''}
                        <p style="margin: 0; font-size: 11px; color: #999;">Lat: ${item.latitude.toFixed(4)}, Lng: ${item.longitude.toFixed(4)}</p>
                    </div>
                `;

                // Use shared fish marker creation
                const fishIcon = createFishMarker(item.totalCount);
                window.L.marker([item.latitude, item.longitude], { icon: fishIcon })
                    .addTo(map)
                    .bindPopup(popupContent);
            });

            mapInstanceRef.current = map;
        }

        return () => {
            if (mapInstanceRef.current) {
                cleanupMap(mapInstanceRef.current);
                mapInstanceRef.current = null;
            }
        };
    }, [mapData, showCatchCount, mapHeight]);

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Map Settings', 'fish-catch')}>
                    <SelectControl
                        label={__('Map Style', 'fish-catch')}
                        value={mapStyle}
                        onChange={(value) => setAttributes({ mapStyle: value })}
                        options={getMapTemplateOptions(__)}
                        help={__('Choose a map style theme', 'fish-catch')}
                    />
                    <RangeControl
                        label={__('Map Height (px)', 'fish-catch')}
                        value={mapHeight}
                        onChange={(value) => setAttributes({ mapHeight: value })}
                        min={200}
                        max={800}
                        step={50}
                    />
                    <RangeControl
                        label={__('Minimum Catch Count', 'fish-catch')}
                        value={minCatchCount}
                        onChange={(value) => setAttributes({ minCatchCount: value })}
                        min={1}
                        max={20}
                        step={1}
                        help={__('Only show posts with this many catches or more', 'fish-catch')}
                    />
                </PanelBody>

                <PanelBody title={__('Display Options', 'fish-catch')}>
                    <ToggleControl
                        label={__('Show Post Titles', 'fish-catch')}
                        checked={showPostTitles}
                        onChange={(value) => setAttributes({ showPostTitles: value })}
                    />
                    <ToggleControl
                        label={__('Show Catch Count', 'fish-catch')}
                        checked={showCatchCount}
                        onChange={(value) => setAttributes({ showCatchCount: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...useBlockProps()}>
                <div className="fish-catch-map-block">
                    <h3>{__('Fish Catch Map', 'fish-catch')}</h3>

                    {fishCatchPosts === null ? (
                        <p>{__('Loading fishing locations...', 'fish-catch')}</p>
                    ) : mapData.length === 0 ? (
                        <div className="no-data-message">
                            <p>{__('No fishing locations found.', 'fish-catch')}</p>
                            <p style={{ fontSize: '14px', color: '#666' }}>
                                {__('Make sure you have posts with the Fish Catch block that include coordinates and at least', 'fish-catch')} {minCatchCount} {__('catches.', 'fish-catch')}
                            </p>
                        </div>
                    ) : (
                        <>
                            <p style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
                                {__('Found', 'fish-catch')} {mapData.length} {__('fishing locations', 'fish-catch')}
                            </p>
                            <div
                                ref={mapRef}
                                style={{
                                    height: `${mapHeight}px`,
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    overflow: 'hidden'
                                }}
                            ></div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
