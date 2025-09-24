/**
 * Frontend JavaScript for Fish Catch Block
 * Plain JavaScript - no webpack compilation needed
 */

console.log('LOADING: /assets/frontend.js');

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
                    const images = gallery.querySelectorAll('img');
                    const currentIndex = Array.from(images).indexOf(e.target);
                    openLightbox(images, currentIndex);
                }
            });
        });
    }

    function openLightbox(images, currentIndex) {
        let currentImgIndex = currentIndex || 0;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'fish-catch-lightbox';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;

        // Create container
        const container = document.createElement('div');
        container.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Create image
        const img = document.createElement('img');
        img.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 8px;
        `;

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: -50px;
            right: 0;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 30px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Navigation buttons (if multiple images)
        let prevBtn, nextBtn, counter;
        if (images.length > 1) {
            prevBtn = document.createElement('button');
            prevBtn.innerHTML = '‹';
            prevBtn.style.cssText = `
                position: absolute;
                left: -60px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                font-size: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            nextBtn = document.createElement('button');
            nextBtn.innerHTML = '›';
            nextBtn.style.cssText = `
                position: absolute;
                right: -60px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                font-size: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            counter = document.createElement('div');
            counter.style.cssText = `
                position: absolute;
                bottom: -40px;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                font-size: 14px;
                background: rgba(0,0,0,0.5);
                padding: 5px 10px;
                border-radius: 15px;
            `;
        }

        // Show image function
        function showImage(index) {
            currentImgIndex = index;
            img.src = images[currentImgIndex].src;
            img.alt = images[currentImgIndex].alt;
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
                    btn.style.backgroundColor = 'transparent';
                    btn.style.color = '#666';
                });
                e.target.classList.add('active');
                e.target.style.backgroundColor = '#007cba';
                e.target.style.color = 'white';

                // Update grid layout
                catchesGrid.className = 'catches-grid ' + e.target.dataset.view;
                catchesGrid.style.gridTemplateColumns = isListView ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))';

                // Show/hide appropriate content
                catchesGrid.querySelectorAll('.catch-card').forEach(function(card) {
                    const listContent = card.querySelector('.list-view-content');
                    const gridContent = card.querySelector('.grid-view-content');

                    if (isListView) {
                        if (listContent) listContent.style.display = 'flex';
                        if (gridContent) gridContent.style.display = 'none';
                    } else {
                        if (listContent) listContent.style.display = 'none';
                        if (gridContent) gridContent.style.display = 'block';
                    }
                });
            }
        });
    }

})();
