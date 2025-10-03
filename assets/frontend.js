/**
 * Frontend JavaScript for Fish Catch Block and Fish Catch Map Block
 * Unified JavaScript - no webpack compilation needed
 */


(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Initialize fish catch blocks
        initFishCatchBlocks();
        // Initialize fish catch map blocks
        initFishCatchMaps();
    }

    function initFishCatchBlocks() {
        // Initialize all fish catch blocks on the page
        document.querySelectorAll('.fish-catch-block').forEach(function(block) {
            initMap(block);
            initGallery(block);
            initViewToggle(block);
        });
    }

    async function initFishCatchMaps() {
        // Initialize all fish catch map blocks on the page
        document.querySelectorAll('.fish-catch-map-container').forEach(async function(mapContainer) {
            await initFishCatchMap(mapContainer);
        });
    }

    function initMap(block) {
        const mapContainer = block.querySelector('.map-container');
        if (!mapContainer) {
            return;
        }

        // Generate unique ID if not present
        let mapId = mapContainer.id;
        if (!mapId) {
            mapId = `fish-catch-map-${Math.random().toString(36).substr(2, 9)}`;
            mapContainer.id = mapId;
        }
        const lat = parseFloat(mapContainer.dataset.lat);
        const lng = parseFloat(mapContainer.dataset.lng);
        const mapStyle = mapContainer.dataset.mapStyle || mapContainer.getAttribute('data-map-style') || 'OpenStreetMap.Mapnik';

        if (isNaN(lat) || isNaN(lng)) {
            return;
        }

        try {
            const map = L.map(mapId).setView([lat, lng], 13);
            addTileLayer(map, mapStyle);
            const catchCount = parseInt(mapContainer.dataset.catchcount) || 1;
            const fishIcon = createFishMarker(catchCount);
            L.marker([lat, lng], { icon: fishIcon }).addTo(map);
        } catch (error) {
            console.error('Failed to initialize map:', error);
        }
    }

    function initGallery(block) {
        const galleries = block.querySelectorAll('.catch-media-gallery');
        galleries.forEach(function(gallery) {
            gallery.addEventListener('click', function(e) {
                if (e.target.tagName === 'IMG') {
                    e.preventDefault();
                    
                    // Get all media from data attribute
                    const mediaData = gallery.dataset.media;
                    if (mediaData) {
                        try {
                            const allMedia = JSON.parse(mediaData);
                            const images = allMedia.filter(item => item.mime && item.mime.startsWith('image/'));
                            console.log('Parsed media data:', images); // Debug log
                            
                            // Find current index by matching the clicked image URL
                            const clickedSrc = e.target.src;
                            const currentIndex = images.findIndex(img => img.url === clickedSrc);
                            
                            openLightbox(images, currentIndex >= 0 ? currentIndex : 0);
                        } catch (error) {
                            console.error('Failed to parse media data:', error);
                            // Fallback to visible images
                            const images = gallery.querySelectorAll('img');
                            const currentIndex = Array.from(images).indexOf(e.target);
                            openLightbox(images, currentIndex);
                        }
                    } else {
                        // Fallback to visible images
                        const images = gallery.querySelectorAll('img');
                        const currentIndex = Array.from(images).indexOf(e.target);
                        openLightbox(images, currentIndex);
                    }
                }
            });
        });
    }

    function openLightbox(images, currentIndex) {
        let currentImgIndex = currentIndex || 0;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'fish-catch-lightbox';

        // Create container
        const container = document.createElement('div');
        container.className = 'lightbox-container';

        // Create image
        const img = document.createElement('img');
        img.className = 'lightbox-image';

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.className = 'lightbox-close';

        // Navigation buttons (if multiple images)
        let prevBtn, nextBtn, counter;
        if (images.length > 1) {
            prevBtn = document.createElement('button');
            prevBtn.innerHTML = '‹';
            prevBtn.className = 'lightbox-nav lightbox-prev';

            nextBtn = document.createElement('button');
            nextBtn.innerHTML = '›';
            nextBtn.className = 'lightbox-nav lightbox-next';

            counter = document.createElement('div');
            counter.className = 'lightbox-counter';
        }

        // Show image function
        function showImage(index) {
            currentImgIndex = index;
            // Handle both DOM elements and data objects
            if (images[currentImgIndex].url) {
                // Data object from JSON
                img.src = images[currentImgIndex].url;
                img.alt = images[currentImgIndex].alt;
            } else {
                // DOM element fallback
                img.src = images[currentImgIndex].src;
                img.alt = images[currentImgIndex].alt;
            }
            if (counter) {
                counter.textContent = `${currentImgIndex + 1} / ${images.length}`;
            }
        }

        // Navigation functions
        function prevImage() {
            const newIndex = currentImgIndex > 0 ? currentImgIndex - 1 : images.length - 1;
            showImage(newIndex);
        }

        function nextImage() {
            const newIndex = currentImgIndex < images.length - 1 ? currentImgIndex + 1 : 0;
            showImage(newIndex);
        }

        // Build DOM
        container.appendChild(img);
        container.appendChild(closeBtn);
        if (prevBtn) container.appendChild(prevBtn);
        if (nextBtn) container.appendChild(nextBtn);
        if (counter) container.appendChild(counter);
        overlay.appendChild(container);
        document.body.appendChild(overlay);

        // Show initial image
        showImage(currentImgIndex);

        // Event handlers
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                prevImage();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                nextImage();
            });
        }

        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            document.body.removeChild(overlay);
        });

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // Keyboard navigation
        function handleKeyboard(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', handleKeyboard);
            } else if (e.key === 'ArrowLeft' && images.length > 1) {
                prevImage();
            } else if (e.key === 'ArrowRight' && images.length > 1) {
                nextImage();
            }
        }
        document.addEventListener('keydown', handleKeyboard);
    }

    function initViewToggle(block) {
        const toggle = block.querySelector('.view-toggle-container');
        const catchesGrid = block.querySelector('.catches-grid');
        
        if (!toggle || !catchesGrid) return;

        // Generate unique ID if not present
        if (!toggle.id) {
            toggle.id = `view-toggle-${Math.random().toString(36).substr(2, 9)}`;
        }

        toggle.addEventListener('click', function(e) {
            if (e.target.classList.contains('view-btn')) {
                e.preventDefault();
                const isListView = e.target.dataset.view === 'list-view';

                // Update active button
                toggle.querySelectorAll('.view-btn').forEach(function(btn) {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');

                // Update grid layout
                catchesGrid.className = 'catches-grid ' + e.target.dataset.view;

                // The CSS handles show/hide for list vs grid content automatically
            }
        });
    }

    // ===== SHARED UTILITIES =====

    function addTileLayer(map, mapStyle) {
        let tileLayer;
        if (L.tileLayer.provider && mapStyle !== 'OpenStreetMap.Mapnik') {
            try {
                // Handle API key authentication for different providers
                let providerOptions = {};
                
                if (mapStyle.startsWith('Thunderforest.') && window.fishCatchMapConfig && window.fishCatchMapConfig.thunderforestApiKey) {
                    providerOptions.apikey = window.fishCatchMapConfig.thunderforestApiKey;
                }
                
                if (mapStyle.startsWith('Jawg.') && window.fishCatchMapConfig && window.fishCatchMapConfig.jawgAccessToken) {
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

    // ===== FISH CATCH MAP BLOCK FUNCTIONS =====

    async function initFishCatchMap(mapContainer) {
        const mapId = mapContainer.id;
        const minCatchCount = parseInt(mapContainer.dataset.minCatchCount) || 1;
        const showPostTitles = mapContainer.dataset.showPostTitles === '1';
        const showCatchCount = mapContainer.dataset.showCatchCount === '1';
        const mapStyle = mapContainer.dataset.mapStyle || 'OpenStreetMap.Mapnik';

        try {
            // Fetch fish catch posts
            const fishCatchData = await fetchFishCatchPosts(minCatchCount);
            
            if (fishCatchData.length === 0) {
                showNoDataMessage(mapContainer);
                return;
            }

            // Clear loading message
            mapContainer.innerHTML = '';

            // Create the map
            let map;
            if (fishCatchData.length === 1) {
                // Single marker - use same logic as fish-catch-block
                map = L.map(mapId).setView([fishCatchData[0].latitude, fishCatchData[0].longitude], 13);
            } else {
                // Multiple markers - use bounds
                const bounds = L.latLngBounds(
                    fishCatchData.map(item => [item.latitude, item.longitude])
                );
                map = L.map(mapId).fitBounds(bounds, { 
                    padding: [20, 20],
                    maxZoom: 13
                });
            }

            // Add shared tile layer
            addTileLayer(map, mapStyle);

            // Add custom fish markers for each fishing location
            fishCatchData.forEach(item => {
                const fishIcon = createFishMarker(item.totalCount);
                
                L.marker([item.latitude, item.longitude], { icon: fishIcon })
                    .addTo(map)
                    .on('click', function() {
                        showLocationPanel(item, showPostTitles, showCatchCount);
                    });
            });

        } catch (error) {
            console.error('Fish Catch Map: Error initializing map:', error);
            showErrorMessage(mapContainer, error.message);
        }
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
