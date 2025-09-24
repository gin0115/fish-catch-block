console.log('LOADING: /src/fish-catch/frontend.js');
(globalThis["webpackChunkfish_catch_block"] = globalThis["webpackChunkfish_catch_block"] || []).push([["src_fish-catch_frontend_js"],{

/***/ "./src/fish-catch/frontend.js":
/*!************************************!*\
  !*** ./src/fish-catch/frontend.js ***!
  \************************************/
/***/ (() => {

/**
 * Frontend JavaScript for Fish Catch Block
 * Handles map initialization, gallery lightbox, and view toggles
 */

console.log('LOADING: /src/fish-catch/frontend.js');
console.log('jQuery available:', typeof jQuery, typeof $);
(function ($) {
  'use strict';

  console.log('Inside IIFE, $ is:', typeof $);

  // Initialize when DOM is ready
  $(document).ready(function () {
    console.log('Fish Catch Block: Frontend script loaded');
    console.log('DOM ready, looking for blocks...');
    console.log('Found blocks:', $('.fish-catch-block').length);
    initFishCatchBlocks();
  });
  function initFishCatchBlocks() {
    // Initialize all fish catch blocks on the page
    $('.fish-catch-block').each(function () {
      const $block = $(this);
      initMap($block);
      initGallery($block);
      initViewToggle($block);
    });
  }
  function initMap($block) {
    const $mapContainer = $block.find('[id^="fish-catch-map-"]');
    if ($mapContainer.length === 0) {
      console.log('Fish Catch Block: No map container found');
      return;
    }
    const mapId = $mapContainer.attr('id');
    const lat = parseFloat($mapContainer.data('lat'));
    const lng = parseFloat($mapContainer.data('lng'));
    const locationName = $mapContainer.data('location') || 'Fishing Location';
    console.log('Fish Catch Block: Map data', {
      mapId,
      lat,
      lng,
      locationName
    });
    if (isNaN(lat) || isNaN(lng)) {
      console.log('Fish Catch Block: Invalid coordinates');
      return;
    }

    // Wait for Leaflet to load
    if (typeof L === 'undefined') {
      // Leaflet should be enqueued by WordPress, but just in case
      setTimeout(() => initMap($block), 100);
      return;
    }
    try {
      const map = L.map(mapId).setView([lat, lng], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);
      L.marker([lat, lng]).addTo(map).bindPopup(locationName).openPopup();
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }
  function initGallery($block) {
    $block.find('.catch-media-gallery').on('click', 'img', function (e) {
      e.preventDefault();
      const $clickedImg = $(this);
      const $gallery = $clickedImg.closest('.catch-media-gallery');
      const allImages = $gallery.find('img');
      const currentIndex = allImages.index($clickedImg);
      openLightbox(allImages, currentIndex);
    });
  }
  function openLightbox($images, currentIndex) {
    const images = $images.toArray();
    let currentImgIndex = currentIndex || 0;
    const overlay = $('<div class="fish-catch-lightbox">').css({
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.9)',
      'z-index': 9999,
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      cursor: 'pointer'
    });
    const container = $('<div class="lightbox-container">').css({
      position: 'relative',
      'max-width': '90%',
      'max-height': '90%',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center'
    });
    const img = $('<img class="lightbox-image">').attr({
      src: $(images[currentImgIndex]).attr('src'),
      alt: $(images[currentImgIndex]).attr('alt')
    }).css({
      'max-width': '100%',
      'max-height': '100%',
      'object-fit': 'contain',
      'border-radius': '8px'
    });

    // Navigation buttons
    const prevBtn = $('<button class="lightbox-nav lightbox-prev">').html('‹').css({
      position: 'absolute',
      left: '-60px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      'font-size': '30px',
      width: '50px',
      height: '50px',
      'border-radius': '50%',
      cursor: 'pointer',
      display: images.length > 1 ? 'flex' : 'none',
      'align-items': 'center',
      'justify-content': 'center'
    });
    const nextBtn = $('<button class="lightbox-nav lightbox-next">').html('›').css({
      position: 'absolute',
      right: '-60px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      'font-size': '30px',
      width: '50px',
      height: '50px',
      'border-radius': '50%',
      cursor: 'pointer',
      display: images.length > 1 ? 'flex' : 'none',
      'align-items': 'center',
      'justify-content': 'center'
    });
    const closeBtn = $('<button class="lightbox-close">').html('×').css({
      position: 'absolute',
      top: '-50px',
      right: '0',
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      'font-size': '30px',
      width: '40px',
      height: '40px',
      'border-radius': '50%',
      cursor: 'pointer',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center'
    });
    const counter = $('<div class="lightbox-counter">').html(`${currentImgIndex + 1} / ${images.length}`).css({
      position: 'absolute',
      bottom: '-40px',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'white',
      'font-size': '14px',
      background: 'rgba(0,0,0,0.5)',
      padding: '5px 10px',
      'border-radius': '15px'
    });
    container.append(img).append(prevBtn).append(nextBtn).append(closeBtn).append(counter);
    overlay.append(container);
    $('body').append(overlay);

    // Navigation functions
    function showImage(index) {
      currentImgIndex = index;
      img.attr({
        src: $(images[currentImgIndex]).attr('src'),
        alt: $(images[currentImgIndex]).attr('alt')
      });
      counter.html(`${currentImgIndex + 1} / ${images.length}`);
    }
    function prevImage() {
      const newIndex = currentImgIndex > 0 ? currentImgIndex - 1 : images.length - 1;
      showImage(newIndex);
    }
    function nextImage() {
      const newIndex = currentImgIndex < images.length - 1 ? currentImgIndex + 1 : 0;
      showImage(newIndex);
    }

    // Event handlers
    prevBtn.on('click', function (e) {
      e.stopPropagation();
      prevImage();
    });
    nextBtn.on('click', function (e) {
      e.stopPropagation();
      nextImage();
    });
    closeBtn.on('click', function (e) {
      e.stopPropagation();
      overlay.remove();
    });
    overlay.on('click', function (e) {
      if (e.target === overlay[0]) {
        overlay.remove();
      }
    });

    // Keyboard navigation
    $(document).on('keydown.lightbox', function (e) {
      if (e.key === 'Escape') {
        overlay.remove();
        $(document).off('keydown.lightbox');
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    });

    // Clean up on close
    overlay.on('remove', function () {
      $(document).off('keydown.lightbox');
    });
  }
  function initViewToggle($block) {
    const $toggle = $block.find('[id^="view-toggle-"]');
    const $catchesGrid = $block.find('.catches-grid');
    if ($toggle.length === 0 || $catchesGrid.length === 0) return;
    $toggle.on('click', '.view-btn', function (e) {
      e.preventDefault();
      const $btn = $(this);
      const isListView = $btn.data('view') === 'list-view';

      // Update active button
      $toggle.find('.view-btn').removeClass('active').css({
        'background-color': 'transparent',
        color: '#666'
      });
      $btn.addClass('active').css({
        'background-color': '#007cba',
        color: 'white'
      });

      // Update grid layout
      $catchesGrid.removeClass('list-view grid-view').addClass($btn.data('view'));
      $catchesGrid.css('grid-template-columns', isListView ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))');

      // Show/hide appropriate content
      $catchesGrid.find('.catch-card').each(function () {
        const $card = $(this);
        const $listContent = $card.find('.list-view-content');
        const $gridContent = $card.find('.grid-view-content');
        if (isListView) {
          $listContent.show();
          $gridContent.hide();
        } else {
          $listContent.hide();
          $gridContent.show();
        }
      });
    });
  }
})(jQuery);

/***/ })

}]);
//# sourceMappingURL=src_fish-catch_frontend_js.js.map?ver=8110f3e3d7a1bf9cd48b