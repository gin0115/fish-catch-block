# Fish Catch Block Frontend Unification Plan

## Current Architecture Analysis

### Fish Catch Block
- **HTML Structure**: Complex React-rendered HTML with catches, media galleries, view toggles
- **Data Source**: Static data from block attributes (lat/lng, catches array)
- **Frontend JS**: `assets/frontend.js` (manually written, 316 lines)
- **Loading**: Global script loaded for all pages

### Fish Catch Map Block
- **HTML Structure**: Simple container with data attributes
- **Data Source**: Dynamic data from WordPress API
- **Frontend JS**: `build/fish-catch-map/frontend.js` (built from source, 390 lines)
- **Loading**: Block-specific script via `viewScript` in block.json

## Key Differences in HTML Structure

### Fish Catch Block HTML
```html
<div class="fish-catch-block">
  <div class="location-section">...</div>
  <div class="map-section">
    <div class="map-container" data-lat="..." data-lng="..."></div>
  </div>
  <div class="catches-section">
    <div class="catches-grid">
      <div class="catch-card">
        <div class="catch-media-gallery" data-media="[...]">...</div>
      </div>
    </div>
  </div>
</div>
```

### Fish Catch Map Block HTML
```html
<div class="fish-catch-map-block">
  <div class="fish-catch-map-container" 
       data-height="400" 
       data-min-catch-count="1"
       data-show-post-titles="1"
       data-show-catch-count="1"
       data-map-style="OpenStreetMap.Mapnik">
    <div>🗺️ Loading fishing locations...</div>
  </div>
</div>
```

## Detailed Unification Plan

### Phase 1: Create Unified Frontend.js

**File Structure:**
```
assets/frontend.js (NEW UNIFIED FILE)
├── SHARED UTILITIES
│   ├── loadLeafletAndProviders()
│   ├── createTileLayer(mapStyle, providerOptions)
│   ├── generateUniqueId(prefix)
│   └── handleMapError(container, error)
├── MAP FUNCTIONALITY
│   ├── initMap(container, options)
│   ├── createSingleMarker(lat, lng, options)
│   ├── createMultipleMarkers(markers, options)
│   └── addTileLayer(map, mapStyle)
├── FISH CATCH BLOCK SPECIFIC
│   ├── initFishCatchBlocks()
│   ├── initGallery(block)
│   ├── openLightbox(images, currentIndex)
│   └── initViewToggle(block)
├── FISH CATCH MAP BLOCK SPECIFIC
│   ├── initFishCatchMaps()
│   ├── fetchFishCatchPosts(minCatchCount)
│   ├── createFishMarker(catchCount)
│   ├── showLocationPanel(item, options)
│   └── loadLocationImages(postId)
└── MAIN INITIALIZATION
    └── init()
```

### Phase 2: Unified Map Function

```javascript
function initMap(container, options) {
    const {
        type = 'single',           // 'single' or 'multiple'
        lat, lng,                  // For single marker
        markers = [],              // For multiple markers
        mapStyle = 'OpenStreetMap.Mapnik',
        onMarkerClick = null,      // Callback for marker clicks
        mapId = null               // Optional custom ID
    } = options;

    // Generate ID if not provided
    if (!mapId) {
        mapId = container.id || generateUniqueId('fish-catch-map');
        container.id = mapId;
    }

    // Wait for Leaflet
    if (typeof L === 'undefined') {
        return loadLeafletAndProviders().then(() => initMap(container, options));
    }

    try {
        let map;
        
        if (type === 'single') {
            // Single marker logic (from fish-catch-block)
            map = L.map(mapId).setView([lat, lng], 13);
            L.marker([lat, lng]).addTo(map);
            
        } else if (type === 'multiple') {
            // Multiple markers logic (from fish-catch-map)
            const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
            map = L.map(mapId).fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
            
            markers.forEach(marker => {
                const leafletMarker = L.marker([marker.lat, marker.lng], { 
                    icon: marker.icon 
                }).addTo(map);
                
                if (onMarkerClick) {
                    leafletMarker.on('click', () => onMarkerClick(marker));
                }
            });
        }

        // Add tile layer (shared logic)
        addTileLayer(map, mapStyle);
        
    } catch (error) {
        handleMapError(container, error);
    }
}
```

### Phase 3: Block-Specific Initialization

#### Fish Catch Block Initialization
```javascript
function initFishCatchBlocks() {
    document.querySelectorAll('.fish-catch-block').forEach(function(block) {
        // Initialize map
        const mapContainer = block.querySelector('.map-container');
        if (mapContainer) {
            initMap(mapContainer, {
                type: 'single',
                lat: parseFloat(mapContainer.dataset.lat),
                lng: parseFloat(mapContainer.dataset.lng),
                mapStyle: mapContainer.dataset.mapStyle || 'OpenStreetMap.Mapnik'
            });
        }
        
        // Initialize gallery
        initGallery(block);
        
        // Initialize view toggle
        initViewToggle(block);
    });
}
```

#### Fish Catch Map Block Initialization
```javascript
async function initFishCatchMaps() {
    document.querySelectorAll('.fish-catch-map-container').forEach(async function(mapContainer) {
        const options = {
            type: 'multiple',
            mapStyle: mapContainer.dataset.mapStyle || 'OpenStreetMap.Mapnik',
            minCatchCount: parseInt(mapContainer.dataset.minCatchCount) || 1,
            showPostTitles: mapContainer.dataset.showPostTitles === '1',
            showCatchCount: mapContainer.dataset.showCatchCount === '1'
        };

        try {
            // Fetch data first
            const fishCatchData = await fetchFishCatchPosts(options.minCatchCount);
            
            if (fishCatchData.length === 0) {
                showNoDataMessage(mapContainer);
                return;
            }

            // Clear loading message
            mapContainer.innerHTML = '';

            // Create markers with custom icons
            const markers = fishCatchData.map(item => ({
                lat: item.latitude,
                lng: item.longitude,
                icon: createFishMarker(item.totalCount),
                data: item
            }));

            // Initialize map with markers
            initMap(mapContainer, {
                type: 'multiple',
                markers: markers,
                mapStyle: options.mapStyle,
                onMarkerClick: (marker) => showLocationPanel(marker.data, options)
            });

        } catch (error) {
            showErrorMessage(mapContainer, error.message);
        }
    });
}
```

### Phase 4: Shared Utilities

```javascript
// Shared Leaflet loading (use the better version from fish-catch-map)
async function loadLeafletAndProviders() {
    if (typeof L === 'undefined') {
        await loadLeaflet();
    }
    if (!L.tileLayer.provider) {
        await loadLeafletProviders();
    }
}

// Shared tile layer creation
function addTileLayer(map, mapStyle) {
    let tileLayer;
    if (L.tileLayer.provider && mapStyle !== 'OpenStreetMap.Mapnik') {
        try {
            let providerOptions = {};
            
            if (mapStyle.startsWith('Thunderforest.') && window.fishCatchMapConfig?.thunderforestApiKey) {
                providerOptions.apikey = window.fishCatchMapConfig.thunderforestApiKey;
            }
            
            if (mapStyle.startsWith('Jawg.') && window.fishCatchMapConfig?.jawgAccessToken) {
                providerOptions.accessToken = window.fishCatchMapConfig.jawgAccessToken;
            }
            
            tileLayer = L.tileLayer.provider(mapStyle, providerOptions);
        } catch (e) {
            console.warn('Failed to load map style:', mapStyle, 'Falling back to OpenStreetMap');
            tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            });
        }
    } else {
        tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        });
    }
    tileLayer.addTo(map);
}
```

### Phase 5: Implementation Steps

1. **Create new unified `assets/frontend.js`**
2. **Move all functionality** from both existing files
3. **Consolidate shared utilities** (map, Leaflet loading)
4. **Keep block-specific functions** separate but organized
5. **Update plugin loading** to use unified file
6. **Remove old files** (`src/fish-catch-map/frontend.js`)
7. **Test both blocks** work correctly

### Phase 6: Plugin Loading Update

#### Update `fish-catch-block.php`
```php
// Remove the old fish-catch-map frontend.js loading
// Keep only the unified assets/frontend.js loading
wp_enqueue_script(
    'fish-catch-block-frontend',
    plugin_dir_url( __FILE__ ) . 'assets/frontend.js',
    array(),
    '1.0.0',
    true
);
```

#### Update `build/fish-catch-map/block.json`
```json
{
  "viewScript": false
}
```

## Benefits of This Approach

1. **Single source of truth** - One file handles both blocks
2. **Shared utilities** - No duplication of map/Leaflet logic
3. **Maintainable** - Clear separation of block-specific vs shared code
4. **Performance** - One HTTP request instead of multiple
5. **Consistent** - Same loading patterns and error handling
6. **Future-proof** - Easy to add new map features

## Complexity Assessment

- **High complexity** due to different async patterns and data sources
- **Medium effort** to implement due to clear separation of concerns
- **High value** due to elimination of duplication and maintenance burden

## Current Functionality Analysis

### Fish Catch Block (assets/frontend.js - 316 lines)
- **initMap(block)** - Single marker map (40 lines)
- **initGallery(block)** - Gallery click handlers (35 lines)
- **openLightbox(images, currentIndex)** - Lightbox functionality (115 lines)
- **initViewToggle(block)** - View toggle (28 lines)
- **loadLeafletAndProviders()** - External library loading (35 lines)

### Fish Catch Map Block (src/fish-catch-map/frontend.js - 390 lines)
- **initMap(mapContainer)** - Multiple markers map (85 lines)
- **fetchFishCatchPosts(minCatchCount)** - API calls (35 lines)
- **createFishMarker(catchCount)** - Custom marker creation (50 lines)
- **showLocationPanel(item)** - Reveal panel (45 lines)
- **loadLocationImages(postId)** - Image loading (65 lines)
- **loadLeaflet()** - External library loading (30 lines)

## Key Challenges

1. **Different Async Patterns**: Fish Catch uses Promise-based, Fish Catch Map uses async/await
2. **Different Data Flow**: Static HTML vs API calls
3. **Different Event Systems**: Gallery clicks vs Marker clicks
4. **Different DOM Manipulation**: Lightbox vs Panels
5. **Different Error Handling**: Simple vs Multiple API error states

## Conclusion

This is a substantial refactor but absolutely worth it for long-term maintainability. The unification will eliminate ~100 lines of duplicated code and create a single, maintainable frontend system.
```

