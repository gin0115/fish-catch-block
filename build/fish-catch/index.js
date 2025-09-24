/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/fish-catch/block.json":
/*!***********************************!*\
  !*** ./src/fish-catch/block.json ***!
  \***********************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"fish-catch/fish-catch","version":"0.1.0","title":"Fish Catch Block","category":"widgets","icon":"fish","description":"A simple fish catch block for displaying fishing information.","supports":{"html":false,"color":{"background":true,"text":true,"link":true},"spacing":{"padding":true,"margin":true}},"attributes":{"locationAddress":{"type":"string","default":""},"latitude":{"type":"string","default":""},"longitude":{"type":"string","default":""},"catches":{"type":"array","default":[]},"sizeUnit":{"type":"string","default":"cm"},"weightUnit":{"type":"string","default":"lbs"},"defaultView":{"type":"string","default":"list"},"cardBackgroundColor":{"type":"string","default":"#f9f9f9"},"cardBorderColor":{"type":"string","default":"#ddd"},"cardBorderRadius":{"type":"number","default":12},"imageSize":{"type":"string","default":"medium"}},"textdomain":"fish-catch","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css"}');

/***/ }),

/***/ "./src/fish-catch/edit.js":
/*!********************************!*\
  !*** ./src/fish-catch/edit.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/fish-catch/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * Retrieves the translation of text.
 */


/**
 * React hook that is used to mark the block wrapper element.
 */

/**
 * WordPress components for building the editor interface.
 */


/**
 * React hooks for state management.
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 */


/**
 * MapManager - Utility class for handling interactive maps
 * Built for extensibility - can handle single location, multiple locations, etc.
 */

class MapManager {
  constructor(options = {}) {
    this.containerId = options.containerId || 'map';
    this.defaultZoom = options.defaultZoom || 13;
    this.defaultCenter = options.defaultCenter || [51.505, -0.09]; // London default
    this.onLocationSelect = options.onLocationSelect || (() => {});
    this.map = null;
    this.marker = null;
    this.isLeafletLoaded = false;

    // Configuration for future extensions
    this.config = {
      allowMultipleMarkers: options.allowMultipleMarkers || false,
      enableSearch: options.enableSearch || false,
      enableGeolocation: options.enableGeolocation || true,
      tileLayer: options.tileLayer || 'openstreetmap'
    };
    this.markers = []; // For future multiple location support
  }

  /**
   * Load Leaflet CSS and JS dynamically
   */
  async loadLeaflet() {
    if (this.isLeafletLoaded || window.L) {
      this.isLeafletLoaded = true;
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      // Load CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      document.head.appendChild(cssLink);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => {
        this.isLeafletLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Leaflet'));
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize the map
   */
  async initMap(containerId = null) {
    if (containerId) this.containerId = containerId;
    try {
      await this.loadLeaflet();

      // Wait a brief moment for DOM updates
      setTimeout(() => {
        this.createMap();
      }, 100);
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }

  /**
   * Create the Leaflet map instance
   */
  createMap() {
    const container = document.getElementById(this.containerId);
    if (!container || !window.L) {
      console.error('Map container not found or Leaflet not loaded');
      return;
    }

    // Initialize map
    this.map = window.L.map(this.containerId).setView(this.defaultCenter, this.defaultZoom);

    // Add OpenStreetMap tile layer
    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Add click handler for setting location
    this.map.on('click', e => this.handleMapClick(e));

    // Add geolocation control
    this.addGeolocationControl();
  }

  /**
   * Handle map click events
   */
  handleMapClick(e) {
    const {
      lat,
      lng
    } = e.latlng;
    this.setSingleLocation(lat, lng);
  }

  /**
   * Set a single location (current behavior)
   */
  setSingleLocation(lat, lng) {
    // Remove existing marker
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Add new marker
    this.marker = window.L.marker([lat, lng], {
      draggable: true
    }).addTo(this.map);

    // Handle marker drag
    this.marker.on('dragend', e => {
      const position = e.target.getLatLng();
      this.onLocationSelect(position.lat, position.lng);
    });

    // Callback with coordinates
    this.onLocationSelect(lat, lng);
  }

  /**
   * Set map center and zoom to coordinates
   */
  setView(lat, lng, zoom = null) {
    if (this.map) {
      this.map.setView([lat, lng], zoom || this.defaultZoom);
    }
  }

  /**
   * Add existing location marker to map
   */
  setExistingLocation(lat, lng) {
    if (!lat || !lng || !this.map) return;
    this.setSingleLocation(parseFloat(lat), parseFloat(lng));
    this.setView(lat, lng);
  }

  /**
   * Add geolocation control
   */
  addGeolocationControl() {
    const LocationControl = window.L.Control.extend({
      onAdd: () => {
        const container = window.L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.innerHTML = '📍';
        container.style.backgroundColor = 'white';
        container.style.width = '30px';
        container.style.height = '30px';
        container.style.cursor = 'pointer';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.fontSize = '16px';
        container.title = 'Find my location';
        container.onclick = () => this.getCurrentLocation();
        return container;
      }
    });
    new LocationControl({
      position: 'topleft'
    }).addTo(this.map);
  }

  /**
   * Get current location using browser geolocation
   */
  getCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.setView(lat, lng, 15);
      this.setSingleLocation(lat, lng);
    }, error => {
      console.error('Geolocation error:', error);
      alert('Unable to retrieve your location.');
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    });
  }

  /**
   * Destroy map instance
   */
  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
      this.markers = [];
    }
  }
}

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 */
function Edit({
  attributes,
  setAttributes
}) {
  const {
    locationAddress,
    latitude,
    longitude,
    catches,
    sizeUnit,
    weightUnit,
    defaultView,
    cardBackgroundColor,
    cardBorderColor,
    cardBorderRadius,
    imageSize
  } = attributes;
  const [isModalOpen, setIsModalOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const [editingIndex, setEditingIndex] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
  const [newCatch, setNewCatch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)({
    time: new Date().toISOString(),
    species: '',
    size: '',
    weight: '',
    comments: '',
    media: []
  });
  const [isGettingLocation, setIsGettingLocation] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const [isMapModalOpen, setIsMapModalOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const mapManagerRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useRef)(null);
  const removeCatch = index => {
    const updatedCatches = catches.filter((_, i) => i !== index);
    setAttributes({
      catches: updatedCatches
    });
  };
  const editCatch = index => {
    const catchToEdit = catches[index];
    setNewCatch({
      time: catchToEdit.time || new Date().toISOString(),
      species: catchToEdit.species || '',
      size: catchToEdit.size || '',
      weight: catchToEdit.weight || '',
      comments: catchToEdit.comments || '',
      media: catchToEdit.media || []
    });
    setEditingIndex(index);
    setIsModalOpen(true);
  };
  const openNewCatchModal = () => {
    setNewCatch({
      time: new Date().toISOString(),
      species: '',
      size: '',
      weight: '',
      comments: '',
      media: []
    });
    setEditingIndex(null);
    setIsModalOpen(true);
  };
  const removeMedia = mediaIndex => {
    const updatedMedia = newCatch.media.filter((_, index) => index !== mediaIndex);
    setNewCatch({
      ...newCatch,
      media: updatedMedia
    });
  };
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Geolocation is not supported by this browser.', 'fish-catch'));
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude.toFixed(6);
      const lng = position.coords.longitude.toFixed(6);
      setAttributes({
        latitude: lat,
        longitude: lng
      });
      setIsGettingLocation(false);
    }, error => {
      setIsGettingLocation(false);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Location access denied by user.', 'fish-catch'));
          break;
        case error.POSITION_UNAVAILABLE:
          alert((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Location information is unavailable.', 'fish-catch'));
          break;
        case error.TIMEOUT:
          alert((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Location request timed out.', 'fish-catch'));
          break;
        default:
          alert((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('An unknown error occurred while getting location.', 'fish-catch'));
          break;
      }
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    });
  };

  // Map initialization effect
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (isMapModalOpen && !mapManagerRef.current) {
      // Small delay to ensure modal DOM is ready
      setTimeout(() => {
        mapManagerRef.current = new MapManager({
          containerId: 'fish-catch-map-modal',
          defaultCenter: latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : [54.5, -3],
          // UK center
          onLocationSelect: (lat, lng) => {
            setAttributes({
              latitude: lat.toFixed(6),
              longitude: lng.toFixed(6)
            });
          }
        });
        mapManagerRef.current.initMap();

        // Set existing location if available
        if (latitude && longitude) {
          setTimeout(() => {
            mapManagerRef.current.setExistingLocation(latitude, longitude);
          }, 500);
        }
      }, 100);
    }
    return () => {
      if (mapManagerRef.current && !isMapModalOpen) {
        mapManagerRef.current.destroy();
        mapManagerRef.current = null;
      }
    };
  }, [isMapModalOpen, latitude, longitude]);

  // Cleanup effect
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    return () => {
      if (mapManagerRef.current) {
        mapManagerRef.current.destroy();
        mapManagerRef.current = null;
      }
    };
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Location Settings', 'fish-catch'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '16px'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "secondary",
            onClick: getCurrentLocation,
            disabled: isGettingLocation,
            style: {
              width: '100%'
            },
            children: isGettingLocation ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Getting Location...', 'fish-catch') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('📍 Get Current Location', 'fish-catch')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "secondary",
            onClick: () => setIsMapModalOpen(true),
            style: {
              width: '100%'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('🗺️ Place on Map', 'fish-catch')
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Location Address', 'fish-catch'),
          value: locationAddress,
          onChange: value => setAttributes({
            locationAddress: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter a descriptive address or location name', 'fish-catch')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Latitude', 'fish-catch'),
          value: latitude,
          onChange: value => setAttributes({
            latitude: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Longitude', 'fish-catch'),
          value: longitude,
          onChange: value => setAttributes({
            longitude: value
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Units', 'fish-catch'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Size Unit', 'fish-catch'),
          value: sizeUnit,
          onChange: value => setAttributes({
            sizeUnit: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default unit for size measurements (e.g., cm, in)', 'fish-catch')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Weight Unit', 'fish-catch'),
          value: weightUnit,
          onChange: value => setAttributes({
            weightUnit: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default unit for weight measurements (e.g., lbs, kg)', 'fish-catch')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display Settings', 'fish-catch'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default View', 'fish-catch'),
          value: defaultView,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('List View', 'fish-catch'),
            value: 'list'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Grid View', 'fish-catch'),
            value: 'grid'
          }],
          onChange: value => setAttributes({
            defaultView: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default view mode for the frontend display', 'fish-catch')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image Size', 'fish-catch'),
          value: imageSize,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Small', 'fish-catch'),
            value: 'small'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Medium', 'fish-catch'),
            value: 'medium'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Large', 'fish-catch'),
            value: 'large'
          }],
          onChange: value => setAttributes({
            imageSize: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Size of images in the gallery', 'fish-catch')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Card Styling', 'fish-catch'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          style: {
            marginBottom: '16px'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
            style: {
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              fontSize: '13px'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Card Background Color', 'fish-catch')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
              type: "color",
              value: cardBackgroundColor,
              onChange: e => setAttributes({
                cardBackgroundColor: e.target.value
              }),
              style: {
                width: '40px',
                height: '32px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
              value: cardBackgroundColor,
              onChange: value => setAttributes({
                cardBackgroundColor: value
              }),
              placeholder: "#f9f9f9",
              style: {
                flex: 1
              }
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          style: {
            marginBottom: '16px'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
            style: {
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              fontSize: '13px'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Card Border Color', 'fish-catch')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
              type: "color",
              value: cardBorderColor,
              onChange: e => setAttributes({
                cardBorderColor: e.target.value
              }),
              style: {
                width: '40px',
                height: '32px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
              value: cardBorderColor,
              onChange: value => setAttributes({
                cardBorderColor: value
              }),
              placeholder: "#ddd",
              style: {
                flex: 1
              }
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Card Border Radius', 'fish-catch'),
          value: cardBorderRadius,
          onChange: value => setAttributes({
            cardBorderRadius: parseInt(value) || 12
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border radius for catch cards in pixels', 'fish-catch'),
          type: "number"
        })]
      })]
    }), isModalOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Modal, {
      title: editingIndex !== null ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Edit Catch', 'fish-catch') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Catch', 'fish-catch'),
      onRequestClose: () => setIsModalOpen(false),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Species', 'fish-catch'),
        value: newCatch.species,
        onChange: value => setNewCatch({
          ...newCatch,
          species: value
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        style: {
          display: 'flex',
          gap: '10px'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: `${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Size', 'fish-catch')} (${sizeUnit})`,
          value: newCatch.size,
          onChange: value => setNewCatch({
            ...newCatch,
            size: value.replace(/[^0-9.]/g, '')
          }),
          type: "number",
          step: "0.1"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: `${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Weight', 'fish-catch')} (${weightUnit})`,
          value: newCatch.weight,
          onChange: value => setNewCatch({
            ...newCatch,
            weight: value.replace(/[^0-9.]/g, '')
          }),
          type: "number",
          step: "0.1"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextareaControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Comments', 'fish-catch'),
        value: newCatch.comments,
        onChange: value => setNewCatch({
          ...newCatch,
          comments: value
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
          onSelect: media => {
            // Media can be a single item or an array, so we need to flatten it
            const mediaArray = Array.isArray(media) ? media : [media];
            setNewCatch({
              ...newCatch,
              media: [...(newCatch.media || []), ...mediaArray]
            });
          },
          allowedTypes: ['image', 'video'],
          multiple: true,
          value: newCatch.media ? newCatch.media.map(m => m.id) : [],
          render: ({
            open
          }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: open,
            variant: "secondary",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Media', 'fish-catch')
          })
        })
      }), newCatch.media && newCatch.media.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        style: {
          marginTop: '10px'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Selected Media:', 'fish-catch')
          })
        }), newCatch.media.map((mediaItem, mediaIndex) => {
          // Handle nested arrays - flatten them
          const actualMedia = Array.isArray(mediaItem) ? mediaItem[0] : mediaItem;
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '5px'
            },
            children: [actualMedia.mime && actualMedia.mime.startsWith('image/') ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("img", {
              src: actualMedia.url,
              alt: actualMedia.alt || 'Media',
              style: {
                width: '50px',
                height: '50px',
                objectFit: 'cover'
              }
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("video", {
              src: actualMedia.url,
              style: {
                width: '50px',
                height: '50px',
                objectFit: 'cover'
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
              children: actualMedia.title || actualMedia.name || 'Media'
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              variant: "link",
              isDestructive: true,
              onClick: () => removeMedia(mediaIndex),
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'fish-catch')
            })]
          }, mediaIndex);
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "primary",
        onClick: () => {
          if (editingIndex !== null) {
            // Editing existing catch
            const updatedCatches = [...catches];
            updatedCatches[editingIndex] = newCatch;
            setAttributes({
              catches: updatedCatches
            });
          } else {
            // Adding new catch
            setAttributes({
              catches: [...catches, newCatch]
            });
          }
          setNewCatch({
            time: new Date().toISOString(),
            species: '',
            size: '',
            weight: '',
            comments: '',
            media: []
          });
          setEditingIndex(null);
          setIsModalOpen(false);
        },
        children: editingIndex !== null ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Update Catch', 'fish-catch') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Catch', 'fish-catch')
      })]
    }), isMapModalOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Modal, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set Location on Map', 'fish-catch'),
      onRequestClose: () => {
        setIsMapModalOpen(false);
        if (mapManagerRef.current) {
          mapManagerRef.current.destroy();
          mapManagerRef.current = null;
        }
      },
      style: {
        maxWidth: '800px',
        width: '90vw'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        style: {
          marginBottom: '16px'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          id: "fish-catch-map-modal",
          style: {
            height: '400px',
            width: '100%',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f5f5f5'
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          style: {
            fontSize: '13px',
            color: '#666',
            marginTop: '12px',
            marginBottom: '0'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Click on the map to set your location, or drag the marker to fine-tune. Use the 📍 button on the map to find your current location.', 'fish-catch')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        style: {
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          onClick: () => {
            setIsMapModalOpen(false);
            if (mapManagerRef.current) {
              mapManagerRef.current.destroy();
              mapManagerRef.current = null;
            }
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cancel', 'fish-catch')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "primary",
          onClick: () => {
            setIsMapModalOpen(false);
            if (mapManagerRef.current) {
              mapManagerRef.current.destroy();
              mapManagerRef.current = null;
            }
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Done', 'fish-catch')
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      ...(0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)(),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "location-info",
        children: [locationAddress && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          style: {
            color: '#1e1e1e',
            margin: '0 0 8px 0'
          },
          children: locationAddress
        }), latitude && longitude && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("p", {
          style: {
            color: '#666',
            margin: '0 0 8px 0',
            fontSize: '14px'
          },
          children: [latitude, ", ", longitude]
        }), !locationAddress && !latitude && !longitude && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          style: {
            color: '#666',
            fontStyle: 'italic',
            margin: '0 0 8px 0'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No location set', 'fish-catch')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "catches-section",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "primary",
          onClick: openNewCatchModal,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Catch', 'fish-catch')
        }), catches.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "catches-list",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h4", {
            style: {
              color: '#1e1e1e',
              marginBottom: '12px'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Catches', 'fish-catch')
          }), catches.map((catchItem, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            className: "catch-item",
            style: {
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '8px',
              backgroundColor: '#f9f9f9'
            },
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
              style: {
                display: 'flex',
                gap: '12px'
              },
              children: [catchItem.media && catchItem.media.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                className: "catch-media",
                style: {
                  flexShrink: 0
                },
                children: (() => {
                  const firstMedia = Array.isArray(catchItem.media[0]) ? catchItem.media[0][0] : catchItem.media[0];
                  const remainingCount = catchItem.media.length - 1;
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                    style: {
                      position: 'relative',
                      width: '60px',
                      height: '60px',
                      overflow: 'hidden',
                      borderRadius: '6px'
                    },
                    children: [firstMedia.mime && firstMedia.mime.startsWith('image/') ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("img", {
                      src: firstMedia.url,
                      alt: firstMedia.alt || 'Catch media',
                      style: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }
                    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("video", {
                      src: firstMedia.url,
                      style: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }
                    }), remainingCount > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                      style: {
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        lineHeight: '1'
                      },
                      children: ["+", remainingCount]
                    })]
                  });
                })()
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                style: {
                  flex: 1,
                  minWidth: 0
                },
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px'
                  },
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                    style: {
                      flex: 1
                    },
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("h5", {
                      style: {
                        margin: '0',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        lineHeight: '1.3',
                        color: '#1e1e1e'
                      },
                      children: [catchItem.species || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Unknown Species', 'fish-catch'), (catchItem.size || catchItem.weight) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("span", {
                        style: {
                          fontWeight: 'normal',
                          color: '#666',
                          fontSize: '13px',
                          marginLeft: '8px'
                        },
                        children: ["(", [catchItem.size && `${catchItem.size}${sizeUnit}`, catchItem.weight && `${catchItem.weight}${weightUnit}`].filter(Boolean).join(' | '), ")"]
                      })]
                    })
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                    className: "catch-actions",
                    style: {
                      display: 'flex',
                      gap: '4px',
                      marginLeft: '8px'
                    },
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                      variant: "secondary",
                      size: "small",
                      onClick: () => editCatch(index),
                      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Edit', 'fish-catch')
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                      variant: "link",
                      isDestructive: true,
                      size: "small",
                      onClick: () => removeCatch(index),
                      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'fish-catch')
                    })]
                  })]
                }), catchItem.comments && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
                  style: {
                    margin: '0',
                    fontSize: '13px',
                    color: '#555',
                    lineHeight: '1.4'
                  },
                  children: catchItem.comments
                })]
              })]
            })
          }, index))]
        })]
      })]
    })]
  });
}

/***/ }),

/***/ "./src/fish-catch/editor.scss":
/*!************************************!*\
  !*** ./src/fish-catch/editor.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/fish-catch/index.js":
/*!*********************************!*\
  !*** ./src/fish-catch/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/fish-catch/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/fish-catch/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/fish-catch/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/fish-catch/block.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 */
console.log('LOADING: /src/fish-catch/index.js');


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 */


/**
 * Internal dependencies
 */




/**
 * Frontend JavaScript - only runs on frontend
 */

if (typeof window !== 'undefined' && typeof window.wp === 'undefined') {
  console.log('Running frontend code');
  // Import and execute frontend code
  __webpack_require__.e(/*! import() */ "src_fish-catch_frontend_js").then(__webpack_require__.t.bind(__webpack_require__, /*! ./frontend.js */ "./src/fish-catch/frontend.js", 23)).then(() => {
    console.log('Frontend imported successfully');
  }).catch(err => {
    console.error('Frontend import failed:', err);
  });
}

/**
 * Deprecated save function for old block format
 */
const deprecatedSave = () => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "wp-block-fish-catch-fish-catch",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h3", {
      children: "Fish Catch Block"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
      children: "This is a simple fish catch block on the frontend."
    })]
  });
};

/**
 * Every block starts by registering a new block type definition.
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  /**
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./src/fish-catch/save.js":
/*!********************************!*\
  !*** ./src/fish-catch/save.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * Retrieves the translation of text.
 */


/**
 * React hook that is used to mark the block wrapper element.
 */
console.log('LOADING: /src/fish-catch/save.js');


/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 */

function save({
  attributes,
  className
}) {
  const {
    locationAddress,
    latitude,
    longitude,
    catches,
    sizeUnit,
    weightUnit,
    defaultView,
    cardBackgroundColor,
    cardBorderColor,
    cardBorderRadius,
    imageSize
  } = attributes;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
    className
  });

  // Generate unique IDs for map and gallery
  const mapId = `fish-catch-map-${Math.random().toString(36).substr(2, 9)}`;
  const viewToggleId = `view-toggle-${Math.random().toString(36).substr(2, 9)}`;

  // Helper function to get fish initials
  const getFishInitials = species => {
    if (!species) return '?';
    return species.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2);
  };

  // Helper function to get image size based on setting
  const getImageSize = size => {
    const sizes = {
      small: {
        list: '40px',
        grid: '60px',
        gallery: '60px'
      },
      medium: {
        list: '60px',
        grid: '80px',
        gallery: '80px'
      },
      large: {
        list: '80px',
        grid: '100px',
        gallery: '100px'
      }
    };
    return sizes[size] || sizes.medium;
  };
  const imageSizes = getImageSize(imageSize);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    ...blockProps,
    className: "fish-catch-block",
    children: [locationAddress && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "location-section",
      style: {
        marginBottom: '24px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("h3", {
        style: {
          margin: '0 0 12px 0',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#1e1e1e'
        },
        children: ["\uD83D\uDCCD ", locationAddress]
      }), latitude && longitude && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        style: {
          margin: '8px 0 0 0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
          href: `https://www.google.com/maps?q=${latitude},${longitude}`,
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '12px',
            color: '#333',
            border: '1px solid #ddd',
            transition: 'all 0.2s ease'
          },
          onMouseOver: e => {
            e.target.style.backgroundColor = '#e0e0e0';
            e.target.style.transform = 'translateY(-1px)';
          },
          onMouseOut: e => {
            e.target.style.backgroundColor = '#f0f0f0';
            e.target.style.transform = 'translateY(0)';
          },
          children: "\uD83D\uDDFA\uFE0F Google Maps"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
          href: `https://maps.apple.com/?q=${latitude},${longitude}`,
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '12px',
            color: '#333',
            border: '1px solid #ddd',
            transition: 'all 0.2s ease'
          },
          onMouseOver: e => {
            e.target.style.backgroundColor = '#e0e0e0';
            e.target.style.transform = 'translateY(-1px)';
          },
          onMouseOut: e => {
            e.target.style.backgroundColor = '#f0f0f0';
            e.target.style.transform = 'translateY(0)';
          },
          children: "\uD83C\uDF4E Apple Maps"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
          href: `https://www.bing.com/maps?q=${latitude},${longitude}`,
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '12px',
            color: '#333',
            border: '1px solid #ddd',
            transition: 'all 0.2s ease'
          },
          onMouseOver: e => {
            e.target.style.backgroundColor = '#e0e0e0';
            e.target.style.transform = 'translateY(-1px)';
          },
          onMouseOut: e => {
            e.target.style.backgroundColor = '#f0f0f0';
            e.target.style.transform = 'translateY(0)';
          },
          children: "\uD83D\uDD0D Bing Maps"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
          href: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`,
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '12px',
            color: '#333',
            border: '1px solid #ddd',
            transition: 'all 0.2s ease'
          },
          onMouseOver: e => {
            e.target.style.backgroundColor = '#e0e0e0';
            e.target.style.transform = 'translateY(-1px)';
          },
          onMouseOut: e => {
            e.target.style.backgroundColor = '#f0f0f0';
            e.target.style.transform = 'translateY(0)';
          },
          children: "\uD83C\uDF0D OpenStreetMap"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
          href: `https://what3words.com/`,
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '12px',
            color: '#333',
            border: '1px solid #ddd',
            transition: 'all 0.2s ease'
          },
          onMouseOver: e => {
            e.target.style.backgroundColor = '#e0e0e0';
            e.target.style.transform = 'translateY(-1px)';
          },
          onMouseOut: e => {
            e.target.style.backgroundColor = '#f0f0f0';
            e.target.style.transform = 'translateY(0)';
          },
          children: "\uD83D\uDCCD What3Words"
        })]
      })]
    }), latitude && longitude && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "map-section",
      style: {
        marginBottom: '32px'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        id: mapId,
        "data-lat": latitude,
        "data-lng": longitude,
        "data-location": locationAddress || 'Fishing Location',
        style: {
          height: '300px',
          width: '100%',
          borderRadius: '8px',
          border: '1px solid #ddd',
          backgroundColor: '#f5f5f5'
        }
      })
    }), catches && catches.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "catches-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("h3", {
          style: {
            margin: '0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1e1e1e'
          },
          children: ["\uD83C\uDFA3 ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fish Caught', 'fish-catch'), " (", catches.length, ")"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          id: viewToggleId,
          style: {
            display: 'flex',
            gap: '4px',
            backgroundColor: '#f0f0f0',
            borderRadius: '6px',
            padding: '2px'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            className: `view-btn ${defaultView === 'list' ? 'active' : ''}`,
            "data-view": "list-view",
            style: {
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: defaultView === 'list' ? '#007cba' : 'transparent',
              color: defaultView === 'list' ? 'white' : '#666',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            },
            children: "\uD83D\uDCCB List"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            className: `view-btn ${defaultView === 'grid' ? 'active' : ''}`,
            "data-view": "grid-view",
            style: {
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: defaultView === 'grid' ? '#007cba' : 'transparent',
              color: defaultView === 'grid' ? 'white' : '#666',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            },
            children: "\uD83D\uDD32 Grid"
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: `catches-grid ${defaultView}-view`,
        style: {
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: defaultView === 'list' ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))'
        },
        children: catches.map((catchItem, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "catch-card",
          style: {
            border: `1px solid ${cardBorderColor}`,
            borderRadius: `${cardBorderRadius}px`,
            padding: '16px',
            backgroundColor: cardBackgroundColor,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "list-view-content",
            style: {
              display: defaultView === 'list' ? 'flex' : 'none',
              gap: '12px',
              alignItems: 'flex-start'
            },
            children: [catchItem.media && catchItem.media.length > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
              style: {
                flexShrink: 0
              },
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                className: "catch-media-gallery",
                "data-media": JSON.stringify(catchItem.media.map(item => {
                  const actualMedia = Array.isArray(item) ? item[0] : item;
                  return {
                    url: actualMedia.url,
                    alt: actualMedia.alt || `Catch photo`,
                    mime: actualMedia.mime
                  };
                })),
                style: {
                  width: imageSizes.list,
                  height: imageSizes.list,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: '#f0f0f0'
                },
                children: [(() => {
                  const firstMedia = Array.isArray(catchItem.media[0]) ? catchItem.media[0][0] : catchItem.media[0];
                  return firstMedia.mime && firstMedia.mime.startsWith('image/') ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
                    src: firstMedia.url,
                    alt: firstMedia.alt || `Catch photo`,
                    style: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }
                  }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("video", {
                    src: firstMedia.url,
                    style: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }
                  });
                })(), catchItem.media.length > 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                  style: {
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '1px 4px',
                    borderRadius: '2px'
                  },
                  children: ["+", catchItem.media.length - 1]
                })]
              })
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
              style: {
                flexShrink: 0,
                width: imageSizes.list,
                height: imageSizes.list,
                backgroundColor: '#e0e0e0',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#666'
              },
              children: getFishInitials(catchItem.species)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
              style: {
                flex: 1,
                minWidth: 0
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: catchItem.comments ? '4px' : '0',
                  flexWrap: 'wrap'
                },
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h4", {
                  style: {
                    margin: '0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#1e1e1e'
                  },
                  children: catchItem.species || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Unknown Species', 'fish-catch')
                }), (catchItem.size || catchItem.weight) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("span", {
                  style: {
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: '500'
                  },
                  children: ["(", [catchItem.size && `${catchItem.size}${sizeUnit || 'cm'}`, catchItem.weight && `${catchItem.weight}${weightUnit || 'kg'}`].filter(Boolean).join(' • '), ")"]
                })]
              }), catchItem.comments && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("p", {
                style: {
                  margin: '0',
                  fontSize: '13px',
                  color: '#555',
                  fontStyle: 'italic',
                  lineHeight: '1.3'
                },
                children: ["\"", catchItem.comments, "\""]
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "grid-view-content",
            style: {
              display: defaultView === 'grid' ? 'block' : 'none'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
              style: {
                marginBottom: '12px'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h4", {
                style: {
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1e1e1e'
                },
                children: catchItem.species || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Unknown Species', 'fish-catch')
              }), (catchItem.size || catchItem.weight) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
                style: {
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  color: '#666',
                  fontWeight: '500'
                },
                children: [catchItem.size && `${catchItem.size}${sizeUnit || 'cm'}`, catchItem.weight && `${catchItem.weight}${weightUnit || 'kg'}`].filter(Boolean).join(' • ')
              }), catchItem.comments && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("p", {
                style: {
                  margin: '0',
                  fontSize: '13px',
                  color: '#555',
                  fontStyle: 'italic',
                  lineHeight: '1.4'
                },
                children: ["\"", catchItem.comments, "\""]
              })]
            }), catchItem.media && catchItem.media.length > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
              className: "catch-media-gallery",
              "data-media": JSON.stringify(catchItem.media.map(item => {
                const actualMedia = Array.isArray(item) ? item[0] : item;
                return {
                  url: actualMedia.url,
                  alt: actualMedia.alt || `Catch photo`,
                  mime: actualMedia.mime
                };
              })),
              style: {
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(${imageSizes.gallery}, 1fr))`,
                gap: '8px',
                marginTop: '12px'
              },
              children: catchItem.media.map((mediaItem, mediaIndex) => {
                const actualMedia = Array.isArray(mediaItem) ? mediaItem[0] : mediaItem;
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                  style: {
                    position: 'relative',
                    aspectRatio: '1',
                    overflow: 'hidden',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: '#f0f0f0'
                  },
                  children: [actualMedia.mime && actualMedia.mime.startsWith('image/') ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
                    src: actualMedia.url,
                    alt: actualMedia.alt || `Catch photo ${mediaIndex + 1}`,
                    style: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.2s ease'
                    }
                  }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("video", {
                    src: actualMedia.url,
                    style: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    },
                    controls: true
                  }), catchItem.media.length > 1 && mediaIndex === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                    style: {
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '2px 6px',
                      borderRadius: '3px'
                    },
                    children: ["+", catchItem.media.length - 1]
                  })]
                }, mediaIndex);
              })
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
              style: {
                width: '100%',
                height: '120px',
                backgroundColor: '#e0e0e0',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '12px'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
                style: {
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#666',
                  marginBottom: '4px'
                },
                children: getFishInitials(catchItem.species)
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
                style: {
                  fontSize: '12px',
                  color: '#999'
                },
                children: "No photos"
              })]
            })]
          })]
        }, index))
      })]
    }), (!catches || catches.length === 0) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      style: {
        textAlign: 'center',
        padding: '40px 20px',
        color: '#666',
        fontStyle: 'italic'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
        style: {
          margin: '0',
          fontSize: '16px'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No fish caught yet. Add your first catch!', 'fish-catch')
      })
    })]
  });
}

/***/ }),

/***/ "./src/fish-catch/style.scss":
/*!***********************************!*\
  !*** ./src/fish-catch/style.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js?ver=" + "8110f3e3d7a1bf9cd48b" + "";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "fish-catch-block:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"fish-catch/index": 0,
/******/ 			"fish-catch/style-index": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if("fish-catch/style-index" != chunkId) {
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkfish_catch_block"] = globalThis["webpackChunkfish_catch_block"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["fish-catch/style-index"], () => (__webpack_require__("./src/fish-catch/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map