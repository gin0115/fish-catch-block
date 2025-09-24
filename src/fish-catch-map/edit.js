/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { 
    useBlockProps, 
    InspectorControls 
} from '@wordpress/block-editor';
import { 
    PanelBody, 
    RangeControl,
    ToggleControl 
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Editor styles
 */
import './editor.scss';

/**
 * Edit component for Fish Catch Map block
 */
export default function Edit({ attributes, setAttributes }) {
    const { 
        mapHeight, 
        minCatchCount, 
        showPostTitles, 
        showCatchCount,
        mapZoom 
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

        // Load Leaflet if not already loaded
        if (typeof window.L === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = initializeMap;
            document.head.appendChild(script);

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        } else {
            initializeMap();
        }

        function initializeMap() {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
            }

            // Calculate bounds from all markers
            const bounds = window.L.latLngBounds(
                mapData.map(item => [item.latitude, item.longitude])
            );

            const map = window.L.map(mapRef.current, {
                scrollWheelZoom: false
            }).fitBounds(bounds, { padding: [20, 20] });

            window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

            // Add markers
            mapData.forEach(item => {
                const popupContent = `
                    <div style="min-width: 200px;">
                        <h4 style="margin: 0 0 8px 0; font-size: 14px;">${item.title}</h4>
                        ${showCatchCount ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">🎣 ${item.totalCount} catches</p>` : ''}
                        <p style="margin: 0; font-size: 11px; color: #999;">Lat: ${item.latitude.toFixed(4)}, Lng: ${item.longitude.toFixed(4)}</p>
                    </div>
                `;

                window.L.marker([item.latitude, item.longitude])
                    .addTo(map)
                    .bindPopup(popupContent);
            });

            mapInstanceRef.current = map;
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [mapData, showCatchCount, mapHeight]);

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Map Settings', 'fish-catch')}>
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
