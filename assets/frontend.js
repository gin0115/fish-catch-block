/**
 * Frontend JavaScript for Fish Catch Block
 * Plain JavaScript - no webpack compilation needed
 */


(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFishCatchBlocks);
    } else {
        initFishCatchBlocks();
    }

    function initFishCatchBlocks() {
        
        // Initialize all fish catch blocks on the page
        document.querySelectorAll('.fish-catch-block').forEach(function(block) {
            initMap(block);
            initGallery(block);
            initViewToggle(block);
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
        const locationName = mapContainer.dataset.location || 'Fishing Location';
        const mapStyle = mapContainer.dataset.mapStyle || mapContainer.getAttribute('data-map-style') || 'OpenStreetMap.Mapnik';


        if (isNaN(lat) || isNaN(lng)) {
            return;
        }

        // Wait for Leaflet and providers to load
        if (typeof L === 'undefined') {
            loadLeafletAndProviders().then(() => {
                initMap(block);
            });
            return;
        }

        try {
            const map = L.map(mapId).setView([lat, lng], 13);
            
            // Add tile layer based on selected style
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

            L.marker([lat, lng]).addTo(map);
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

    function loadLeafletAndProviders() {
        return new Promise((resolve, reject) => {
            // Load Leaflet if not already loaded
            if (typeof L === 'undefined') {
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(cssLink);

                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = () => {
                    // Load leaflet-providers after leaflet
                    const providersScript = document.createElement('script');
                    providersScript.src = 'https://unpkg.com/leaflet-providers@2.0.0/leaflet-providers.js';
                    providersScript.onload = resolve;
                    providersScript.onerror = resolve; // Continue even if providers fail
                    document.head.appendChild(providersScript);
                };
                script.onerror = reject;
                document.head.appendChild(script);
            } else {
                // Leaflet is loaded, check for providers
                if (!L.tileLayer.provider) {
                    const providersScript = document.createElement('script');
                    providersScript.src = 'https://unpkg.com/leaflet-providers@2.0.0/leaflet-providers.js';
                    providersScript.onload = resolve;
                    providersScript.onerror = resolve; // Continue even if providers fail
                    document.head.appendChild(providersScript);
                } else {
                    resolve();
                }
            }
        });
    }

})();
