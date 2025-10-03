/**
 * Shared map services for Fish Catch blocks
 * Centralized map functionality used by both fish-catch and fish-catch-map blocks
 */

import { requiresApiKey, getApiKeyConfigKey } from './map-templates.js';

/**
 * Create a tile layer with proper API key handling
 * @param {string} mapStyle - The map style to use
 * @param {Object} config - Configuration object with API keys
 * @param {string} config.thunderforestApiKey - Thunderforest API key
 * @param {string} config.jawgAccessToken - Jawg access token
 * @returns {Object} Leaflet tile layer
 */
export function createTileLayer(mapStyle, config = {}) {
    // Default to OpenStreetMap if no style specified
    if (!mapStyle || mapStyle === 'OpenStreetMap.Mapnik') {
        return window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        });
    }

    // Check if we have the required API key
    if (requiresApiKey(mapStyle)) {
        const apiKeyName = getApiKeyConfigKey(mapStyle);
        const apiKey = config[apiKeyName];
        
        if (!apiKey) {
            console.warn(`API key required for ${mapStyle} but not provided. Falling back to OpenStreetMap.`);
            return window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            });
        }
    }

    // Try to create provider tile layer
    if (window.L.tileLayer.provider) {
        try {
            const providerOptions = {};
            
            if (mapStyle.startsWith('Thunderforest.') && config.thunderforestApiKey) {
                providerOptions.apikey = config.thunderforestApiKey;
            }
            
            if (mapStyle.startsWith('Jawg.') && config.jawgAccessToken) {
                providerOptions.accessToken = config.jawgAccessToken;
            }
            
            return window.L.tileLayer.provider(mapStyle, providerOptions);
        } catch (error) {
            console.warn('Failed to load map style:', mapStyle, 'Falling back to OpenStreetMap');
            return window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            });
        }
    } else {
        // Fallback if providers not available
        return window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        });
    }
}

/**
 * Add a tile layer to a map with proper error handling
 * @param {Object} map - Leaflet map instance
 * @param {string} mapStyle - The map style to use
 * @param {Object} config - Configuration object with API keys
 * @returns {Object} The created tile layer
 */
export function addTileLayerToMap(map, mapStyle, config = {}) {
    const tileLayer = createTileLayer(mapStyle, config);
    tileLayer.addTo(map);
    return tileLayer;
}

/**
 * Calculate bounds for multiple coordinates
 * @param {Array} coordinates - Array of [lat, lng] coordinate pairs
 * @returns {Object} Leaflet bounds object
 */
export function getMapBounds(coordinates) {
    if (!coordinates || coordinates.length === 0) {
        return null;
    }
    
    if (coordinates.length === 1) {
        // For single coordinate, create bounds that center on that point
        const [lat, lng] = coordinates[0];
        return window.L.latLngBounds([lat, lng], [lat, lng]);
    }
    
    return window.L.latLngBounds(coordinates);
}

/**
 * Clean up a map instance
 * @param {Object} mapInstance - Leaflet map instance to clean up
 */
export function cleanupMap(mapInstance) {
    if (mapInstance && typeof mapInstance.remove === 'function') {
        mapInstance.remove();
    }
}

/**
 * Validate coordinate values
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if coordinates are valid
 */
export function validateCoordinates(lat, lng) {
    return (
        typeof lat === 'number' && 
        typeof lng === 'number' && 
        !isNaN(lat) && 
        !isNaN(lng) &&
        lat >= -90 && 
        lat <= 90 && 
        lng >= -180 && 
        lng <= 180
    );
}

/**
 * Get the current map configuration from WordPress
 * @returns {Object} Map configuration with API keys
 */
export function getMapConfig() {
    return window.fishCatchMapConfig || {};
}

/**
 * Create a map with proper initialization
 * @param {string} containerId - DOM element ID for the map
 * @param {Object} options - Map options
 * @param {Array} options.center - [lat, lng] center coordinates
 * @param {number} options.zoom - Initial zoom level
 * @param {Object} options.bounds - Bounds to fit (alternative to center/zoom)
 * @param {Object} options.boundsOptions - Options for fitBounds
 * @returns {Object} Leaflet map instance
 */
export function createMap(containerId, options = {}) {
    const { center, zoom, bounds, boundsOptions = {} } = options;
    
    const map = window.L.map(containerId);
    
    if (bounds) {
        // Check if bounds is valid before using fitBounds
        if (bounds.isValid && bounds.isValid()) {
            map.fitBounds(bounds, boundsOptions);
        } else {
            // Fallback to center/zoom if bounds is invalid
            const centerPoint = bounds.getCenter ? bounds.getCenter() : [0, 0];
            const zoomLevel = boundsOptions.maxZoom || 13;
            map.setView(centerPoint, zoomLevel);
        }
    } else if (center && zoom !== undefined) {
        map.setView(center, zoom);
    } else {
        // Default fallback
        map.setView([0, 0], 2);
    }
    
    return map;
}

/**
 * Create a fish marker icon with catch count
 * @param {number} catchCount - Number of fish caught
 * @returns {Object} Leaflet div icon
 */
export function createFishMarker(catchCount) {
    const markerSize = catchCount > 10 ? 50 : catchCount > 5 ? 40 : 32;
    const fontSize = catchCount > 10 ? 14 : catchCount > 5 ? 12 : 10;
    
    // Fish emoji with different colors based on catch count
    let fishColor = '#4A90E2'; // Default blue
    if (catchCount > 10) fishColor = '#F5A623'; // Gold for lots of catches
    else if (catchCount > 5) fishColor = '#7ED321'; // Green for medium catches
    
    const markerHtml = `
        <div class="fish-marker" style="
            width: ${markerSize}px;
            height: ${markerSize}px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        ">
            <div class="fish-icon" style="
                font-size: ${markerSize - 8}px;
                filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
                color: ${fishColor};
            ">🐟</div>
            <div class="catch-count-badge" style="
                position: absolute;
                top: -8px;
                right: -8px;
                background: #FF6B6B;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${fontSize}px;
                font-weight: bold;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">${catchCount}</div>
        </div>
    `;

    return window.L.divIcon({
        html: markerHtml,
        className: 'fish-catch-marker',
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize / 2]
    });
}
