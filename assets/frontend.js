/**
 * Frontend JavaScript for Fish Catch Block
 * Plain JavaScript - no webpack compilation needed
 */

console.log('LOADING: /frontend.js');

(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFishCatchBlocks);
    } else {
        initFishCatchBlocks();
    }

    function initFishCatchBlocks() {
        console.log('Fish Catch Block: Frontend script loaded');
        console.log('Found blocks:', document.querySelectorAll('.fish-catch-block').length);
        
        // Initialize all fish catch blocks on the page
        document.querySelectorAll('.fish-catch-block').forEach(function(block) {
            initMap(block);
            initGallery(block);
            initViewToggle(block);
        });
    }

    function initMap(block) {
        const mapContainer = block.querySelector('[id^="fish-catch-map-"]');
        if (!mapContainer) {
            console.log('Fish Catch Block: No map container found');
            return;
        }

        const mapId = mapContainer.id;
        const lat = parseFloat(mapContainer.dataset.lat);
        const lng = parseFloat(mapContainer.dataset.lng);
        const locationName = mapContainer.dataset.location || 'Fishing Location';

        console.log('Fish Catch Block: Map data', { mapId, lat, lng, locationName });

        if (isNaN(lat) || isNaN(lng)) {
            console.log('Fish Catch Block: Invalid coordinates');
            return;
        }

        // Wait for Leaflet to load
        if (typeof L === 'undefined') {
            setTimeout(() => initMap(block), 100);
            return;
        }

        try {
            const map = L.map(mapId).setView([lat, lng], 13);
            
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

            L.marker([lat, lng]).addTo(map)
                .bindPopup(locationName)
                .openPopup();
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
                            
                            // Find current index by matching the clicked image URL
                            const clickedSrc = e.target.src;
                            const currentIndex = images.findIndex(img => img.url === clickedSrc);
                            
                            console.log('Gallery click: found', images.length, 'images, current index:', currentIndex);
                            console.log('Clicked src:', clickedSrc);
                            console.log('Available URLs:', images.map(img => img.url));
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
        console.log('Lightbox opened with', images.length, 'images');
        
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
        const toggle = block.querySelector('[id^="view-toggle-"]');
        const catchesGrid = block.querySelector('.catches-grid');
        
        if (!toggle || !catchesGrid) return;

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

})();
