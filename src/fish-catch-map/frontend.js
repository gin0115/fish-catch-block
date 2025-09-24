/**
 * Frontend JavaScript for Fish Catch Map Block
 */

console.log('LOADING: /src/fish-catch-map/frontend.js');

(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFishCatchMaps);
    } else {
        initFishCatchMaps();
    }

    function initFishCatchMaps() {
        console.log('Fish Catch Map: Frontend script loaded');
        
        // Initialize all fish catch map blocks on the page
        document.querySelectorAll('.fish-catch-map-container').forEach(function(mapContainer) {
            initMap(mapContainer);
        });
    }

    async function initMap(mapContainer) {
        const mapId = mapContainer.id;
        const mapHeight = parseInt(mapContainer.dataset.height) || 400;
        const minCatchCount = parseInt(mapContainer.dataset.minCatchCount) || 1;
        const showPostTitles = mapContainer.dataset.showPostTitles === '1';
        const showCatchCount = mapContainer.dataset.showCatchCount === '1';

        console.log('Fish Catch Map: Initializing map', { mapId, minCatchCount, showPostTitles, showCatchCount });

        try {
            // Load Leaflet if not already available
            if (typeof L === 'undefined') {
                await loadLeaflet();
            }

            // Fetch fish catch posts
            const fishCatchData = await fetchFishCatchPosts(minCatchCount);
            
            if (fishCatchData.length === 0) {
                showNoDataMessage(mapContainer);
                return;
            }

            // Clear loading message
            mapContainer.innerHTML = '';

            // Create the map
            const bounds = L.latLngBounds(
                fishCatchData.map(item => [item.latitude, item.longitude])
            );

            const map = L.map(mapId).fitBounds(bounds, { 
                padding: [20, 20],
                maxZoom: 15
            });

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

            // Add custom fish markers for each fishing location
            fishCatchData.forEach(item => {
                const fishIcon = createFishMarker(item.totalCount);
                
                L.marker([item.latitude, item.longitude], { icon: fishIcon })
                    .addTo(map)
                    .on('click', function() {
                        showLocationPanel(item, showPostTitles, showCatchCount);
                    });
            });

            console.log(`Fish Catch Map: Added ${fishCatchData.length} markers to map`);

        } catch (error) {
            console.error('Fish Catch Map: Error initializing map:', error);
            showErrorMessage(mapContainer, error.message);
        }
    }

    function loadLeaflet() {
        return new Promise((resolve, reject) => {
            // Load CSS
            if (!document.querySelector('link[href*="leaflet.css"]')) {
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
                cssLink.crossOrigin = '';
                document.head.appendChild(cssLink);
            }

            // Load JS
            if (!document.querySelector('script[src*="leaflet.js"]')) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
                script.crossOrigin = '';
                
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load Leaflet'));
                
                document.head.appendChild(script);
            } else {
                resolve();
            }
        });
    }

    async function fetchFishCatchPosts(minCatchCount) {
        const wpApiUrl = window.wpApiSettings?.root || '/wp-json/wp/v2/';
        const url = `${wpApiUrl}posts?per_page=100&_embed=1&fish_catch_min_count=${minCatchCount}&fish_catch_has_coords=true`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.status}`);
        }

        const posts = await response.json();
        
        return posts
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
                        excerpt: post.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
                        date: new Date(post.date).toLocaleDateString()
                    };
                }
                return null;
            })
            .filter(Boolean);
    }

    function createFishMarker(catchCount) {
        // Create custom fish marker with catch count overlay
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

        return L.divIcon({
            html: markerHtml,
            className: 'fish-catch-marker',
            iconSize: [markerSize, markerSize],
            iconAnchor: [markerSize / 2, markerSize / 2]
        });
    }

    function showLocationPanel(item, showPostTitles, showCatchCount) {
        // Remove any existing panel
        const existingPanel = document.querySelector('.fish-catch-reveal-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // Create reveal panel
        const panel = document.createElement('div');
        panel.className = 'fish-catch-reveal-panel';
        
        let panelContent = `
            <button class="panel-close">×</button>
            <div class="panel-content">
                <div class="post-date">${item.date}</div>
                <div class="location-title">
                    <a href="${item.link}">${item.title}</a>
                </div>
                <div class="catch-count">${item.totalCount} fish</div>
                <a href="${item.link}" class="view-link">View</a>
            </div>
        `;
        
        
        panel.innerHTML = panelContent;
        
        // Add backdrop for mobile
        const backdrop = document.createElement('div');
        backdrop.className = 'fish-catch-panel-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            transition: opacity 0.3s ease;
            display: none;
        `;
        
        // Show backdrop on mobile
        if (window.innerWidth <= 768) {
            backdrop.style.display = 'block';
            document.body.appendChild(backdrop);
            setTimeout(() => backdrop.style.opacity = '1', 10);
            
            backdrop.addEventListener('click', function() {
                panel.remove();
                backdrop.remove();
            });
        }

        // Add panel after the map container
        const mapContainer = document.querySelector('.fish-catch-map-container');
        const mapBlock = mapContainer.closest('.fish-catch-map-block');
        mapBlock.appendChild(panel);
        
        // Add close functionality
        panel.querySelector('.panel-close').addEventListener('click', function() {
            panel.remove();
            if (backdrop && backdrop.parentNode) {
                backdrop.remove();
            }
        });
        
        // Load images for this location
        loadLocationImages(item.id);
    }

    async function loadLocationImages(postId) {
        try {
            const wpApiUrl = window.wpApiSettings?.root || '/wp-json/wp/v2/';
            const response = await fetch(`${wpApiUrl}posts/${postId}`);
            const post = await response.json();
            
            const imagesContainer = document.getElementById(`images-${postId}`);
            if (!imagesContainer) return;
            
            // Look for images in the post content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content.rendered;
            const images = tempDiv.querySelectorAll('img');
            
            if (images.length > 0) {
                // Create a Set to track unique image URLs and avoid duplicates
                const uniqueImages = new Map();
                
                Array.from(images).forEach((img) => {
                    const src = img.src;
                    const alt = img.alt || 'Catch photo';
                    
                    // Skip if we've already seen this image URL
                    if (!uniqueImages.has(src)) {
                        uniqueImages.set(src, { src, alt });
                    }
                });
                
                // Convert to array and take first 4 unique images
                const uniqueImagesArray = Array.from(uniqueImages.values()).slice(0, 4);
                
                if (uniqueImagesArray.length > 0) {
                    let imagesHtml = '';
                    uniqueImagesArray.forEach((img, index) => {
                        imagesHtml += `
                            <div class="image-item">
                                <img src="${img.src}" alt="${img.alt}" loading="lazy">
                            </div>
                        `;
                    });
                    
                    // Show "more" indicator based on total unique images
                    const totalUniqueImages = Array.from(new Set(Array.from(images).map(img => img.src))).length;
                    if (totalUniqueImages > 4) {
                        imagesHtml += `<div class="more-images">+${totalUniqueImages - 4} more</div>`;
                    }
                    
                    imagesContainer.innerHTML = imagesHtml;
                } else {
                    imagesContainer.innerHTML = '<div class="no-images">No images available</div>';
                }
            } else {
                imagesContainer.innerHTML = '<div class="no-images">No images available</div>';
            }
            
        } catch (error) {
            console.error('Error loading images:', error);
            const imagesContainer = document.getElementById(`images-${postId}`);
            if (imagesContainer) {
                imagesContainer.innerHTML = '<div class="no-images">Could not load images</div>';
            }
        }
    }

    function showNoDataMessage(mapContainer) {
        mapContainer.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                flex-direction: column;
                color: #666;
                text-align: center;
                padding: 40px 20px;
            ">
                <div style="font-size: 48px; margin-bottom: 16px;">🎣</div>
                <h4 style="margin: 0 0 8px 0;">No fishing locations found</h4>
                <p style="margin: 0; font-size: 14px;">
                    No posts found with coordinates and sufficient catch counts.
                </p>
            </div>
        `;
    }

    function showErrorMessage(mapContainer, errorMsg) {
        mapContainer.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                flex-direction: column;
                color: #d63638;
                text-align: center;
                padding: 40px 20px;
            ">
                <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                <h4 style="margin: 0 0 8px 0;">Error loading map</h4>
                <p style="margin: 0; font-size: 14px;">${errorMsg}</p>
            </div>
        `;
    }

})();
