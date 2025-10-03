/**
 * Shared map template configuration for Fish Catch blocks
 * Centralized location for all map style options
 */

/**
 * Get all available map template options
 * @param {Function} __ - WordPress i18n function for translations
 * @returns {Array} Array of map template options for SelectControl
 */
export function getMapTemplateOptions(__) {
    return [
        // OpenStreetMap
        { label: __('OpenStreetMap', 'fish-catch'), value: 'OpenStreetMap.Mapnik' },
        
        // Esri Maps
        { label: __('Satellite (Esri)', 'fish-catch'), value: 'Esri.WorldImagery' },
        { label: __('Esri World Street Map', 'fish-catch'), value: 'Esri.WorldStreetMap' },
        { label: __('Esri World Topo Map', 'fish-catch'), value: 'Esri.WorldTopoMap' },
        { label: __('Esri World Terrain', 'fish-catch'), value: 'Esri.WorldTerrain' },
        { label: __('Esri World Shaded Relief', 'fish-catch'), value: 'Esri.WorldShadedRelief' },
        { label: __('Esri World Physical', 'fish-catch'), value: 'Esri.WorldPhysical' },
        { label: __('Esri Ocean Basemap', 'fish-catch'), value: 'Esri.OceanBasemap' },
        { label: __('Esri World Gray Canvas', 'fish-catch'), value: 'Esri.WorldGrayCanvas' },
        
        // Stadia Maps (replacement for Stamen)
        { label: __('Stadia Smooth', 'fish-catch'), value: 'Stadia.AlidadeSmooth' },
        { label: __('Stadia Smooth Dark', 'fish-catch'), value: 'Stadia.AlidadeSmoothDark' },
        { label: __('Stadia OSMBright', 'fish-catch'), value: 'Stadia.OSMBright' },
        { label: __('Stadia Outdoors', 'fish-catch'), value: 'Stadia.Outdoors' },
        { label: __('Stadia Toner', 'fish-catch'), value: 'Stadia.StamenToner' },
        { label: __('Stadia Toner Background', 'fish-catch'), value: 'Stadia.StamenTonerBackground' },
        { label: __('Stadia Toner Lines', 'fish-catch'), value: 'Stadia.StamenTonerLines' },
        { label: __('Stadia Toner Labels', 'fish-catch'), value: 'Stadia.StamenTonerLabels' },
        { label: __('Stadia Toner Lite', 'fish-catch'), value: 'Stadia.StamenTonerLite' },
        { label: __('Stadia Watercolor', 'fish-catch'), value: 'Stadia.StamenWatercolor' },
        { label: __('Stadia Terrain', 'fish-catch'), value: 'Stadia.StamenTerrain' },
        { label: __('Stadia Terrain Background', 'fish-catch'), value: 'Stadia.StamenTerrainBackground' },
        { label: __('Stadia Terrain Labels', 'fish-catch'), value: 'Stadia.StamenTerrainLabels' },
        { label: __('Stadia Terrain Lines', 'fish-catch'), value: 'Stadia.StamenTerrainLines' },
        
        // CartoDB
        { label: __('CartoDB Positron', 'fish-catch'), value: 'CartoDB.Positron' },
        { label: __('CartoDB Positron No Labels', 'fish-catch'), value: 'CartoDB.PositronNoLabels' },
        { label: __('CartoDB Positron Only Labels', 'fish-catch'), value: 'CartoDB.PositronOnlyLabels' },
        { label: __('CartoDB Dark Matter', 'fish-catch'), value: 'CartoDB.DarkMatter' },
        { label: __('CartoDB Dark Matter No Labels', 'fish-catch'), value: 'CartoDB.DarkMatterNoLabels' },
        { label: __('CartoDB Dark Matter Only Labels', 'fish-catch'), value: 'CartoDB.DarkMatterOnlyLabels' },
        { label: __('CartoDB Voyager', 'fish-catch'), value: 'CartoDB.Voyager' },
        { label: __('CartoDB Voyager No Labels', 'fish-catch'), value: 'CartoDB.VoyagerNoLabels' },
        { label: __('CartoDB Voyager Only Labels', 'fish-catch'), value: 'CartoDB.VoyagerOnlyLabels' },
        { label: __('CartoDB Voyager Labels Under', 'fish-catch'), value: 'CartoDB.VoyagerLabelsUnder' },
        
        // Other providers
        { label: __('OpenTopoMap', 'fish-catch'), value: 'OpenTopoMap' },
        
        // Thunderforest (requires API key)
        { label: __('Thunderforest OpenCycleMap', 'fish-catch'), value: 'Thunderforest.OpenCycleMap' },
        { label: __('Thunderforest Transport', 'fish-catch'), value: 'Thunderforest.Transport' },
        { label: __('Thunderforest Transport Dark', 'fish-catch'), value: 'Thunderforest.TransportDark' },
        { label: __('Thunderforest Spinal Map', 'fish-catch'), value: 'Thunderforest.SpinalMap' },
        { label: __('Thunderforest Landscape', 'fish-catch'), value: 'Thunderforest.Landscape' },
        { label: __('Thunderforest Outdoors', 'fish-catch'), value: 'Thunderforest.Outdoors' },
        { label: __('Thunderforest Pioneer', 'fish-catch'), value: 'Thunderforest.Pioneer' },
        { label: __('Thunderforest Mobile Atlas', 'fish-catch'), value: 'Thunderforest.MobileAtlas' },
        { label: __('Thunderforest Neighbourhood', 'fish-catch'), value: 'Thunderforest.Neighbourhood' },
        
        // Jawg (requires API key)
        { label: __('Jawg Streets', 'fish-catch'), value: 'Jawg.Streets' },
        { label: __('Jawg Terrain', 'fish-catch'), value: 'Jawg.Terrain' },
        { label: __('Jawg Sunny', 'fish-catch'), value: 'Jawg.Sunny' },
        { label: __('Jawg Dark', 'fish-catch'), value: 'Jawg.Dark' },
        { label: __('Jawg Light', 'fish-catch'), value: 'Jawg.Light' },
        { label: __('Jawg Matrix', 'fish-catch'), value: 'Jawg.Matrix' },
        
        // Other specialized maps
        { label: __('NASAGIBS ViirsEarthAtNight', 'fish-catch'), value: 'NASAGIBS.ViirsEarthAtNight2012' },
        { label: __('USGS Topo', 'fish-catch'), value: 'USGS.USTopo' },
        { label: __('USGS Imagery', 'fish-catch'), value: 'USGS.USImagery' }
    ];
}

/**
 * Get default map style
 * @returns {string} Default map style value
 */
export function getDefaultMapStyle() {
    return 'OpenStreetMap.Mapnik';
}

/**
 * Check if a map style requires an API key
 * @param {string} mapStyle - The map style to check
 * @returns {boolean} True if API key is required
 */
export function requiresApiKey(mapStyle) {
    return mapStyle.startsWith('Thunderforest.') || mapStyle.startsWith('Jawg.');
}

/**
 * Get the API key configuration key for a map style
 * @param {string} mapStyle - The map style to check
 * @returns {string|null} The configuration key name or null if no API key needed
 */
export function getApiKeyConfigKey(mapStyle) {
    if (mapStyle.startsWith('Thunderforest.')) {
        return 'thunderforestApiKey';
    }
    if (mapStyle.startsWith('Jawg.')) {
        return 'jawgAccessToken';
    }
    return null;
}
