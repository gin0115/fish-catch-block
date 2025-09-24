/**
 * Retrieves the translation of text.
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 */
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
	MediaUpload,
	MediaUploadCheck
} from '@wordpress/block-editor';
/**
 * WordPress components for building the editor interface.
 */
import { 
	TextControl, 
	TextareaControl, 
	PanelBody,
	Button,
	Modal,
	SelectControl,
	ColorPicker
} from '@wordpress/components';



/**
 * React hooks for state management.
 */
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * WordPress data API for managing post meta.
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 */
import './editor.scss';

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
		this.map.on('click', (e) => this.handleMapClick(e));

		// Add geolocation control
		this.addGeolocationControl();
	}

	/**
	 * Handle map click events
	 */
	handleMapClick(e) {
		const { lat, lng } = e.latlng;
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
		this.marker.on('dragend', (e) => {
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

		new LocationControl({ position: 'topleft' }).addTo(this.map);
	}

	/**
	 * Get current location using browser geolocation
	 */
	getCurrentLocation() {
		if (!navigator.geolocation) {
			alert('Geolocation is not supported by this browser.');
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;
				
				this.setView(lat, lng, 15);
				this.setSingleLocation(lat, lng);
			},
			(error) => {
				console.error('Geolocation error:', error);
				alert('Unable to retrieve your location.');
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 300000
			}
		);
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
export default function Edit({ attributes, setAttributes }) {
	const { locationAddress, latitude, longitude, catches, sizeUnit, weightUnit, defaultView, cardBackgroundColor, cardBorderColor, cardBorderRadius, imageSize } = attributes;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingIndex, setEditingIndex] = useState(null);
	const [newCatch, setNewCatch] = useState({
		time: new Date().toISOString(),
		species: '',
		size: '',
		weight: '',
		comments: '',
		media: []
	});
	const [isGettingLocation, setIsGettingLocation] = useState(false);
	const [isMapModalOpen, setIsMapModalOpen] = useState(false);
	const mapManagerRef = useRef(null);

	// Get current post ID and meta management functions
	const postId = useSelect((select) => {
		return select('core/editor').getCurrentPostId();
	}, []);

	const { editPost } = useDispatch('core/editor');

	const removeCatch = (index) => {
		const updatedCatches = catches.filter((_, i) => i !== index);
		setAttributes({ catches: updatedCatches });
	};

	const editCatch = (index) => {
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

	const removeMedia = (mediaIndex) => {
		const updatedMedia = newCatch.media.filter((_, index) => index !== mediaIndex);
		setNewCatch({...newCatch, media: updatedMedia});
	};

	const getCurrentLocation = () => {
		if (!navigator.geolocation) {
			alert(__('Geolocation is not supported by this browser.', 'fish-catch'));
			return;
		}

		setIsGettingLocation(true);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude.toFixed(6);
				const lng = position.coords.longitude.toFixed(6);
				
				setAttributes({ 
					latitude: lat, 
					longitude: lng 
				});

				setIsGettingLocation(false);
			},
			(error) => {
				setIsGettingLocation(false);
				switch(error.code) {
					case error.PERMISSION_DENIED:
						alert(__('Location access denied by user.', 'fish-catch'));
						break;
					case error.POSITION_UNAVAILABLE:
						alert(__('Location information is unavailable.', 'fish-catch'));
						break;
					case error.TIMEOUT:
						alert(__('Location request timed out.', 'fish-catch'));
						break;
					default:
						alert(__('An unknown error occurred while getting location.', 'fish-catch'));
						break;
				}
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 300000 // 5 minutes
			}
		);
	};

	// Map initialization effect
	useEffect(() => {
		if (isMapModalOpen && !mapManagerRef.current) {
			// Small delay to ensure modal DOM is ready
			setTimeout(() => {
				mapManagerRef.current = new MapManager({
					containerId: 'fish-catch-map-modal',
					defaultCenter: latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : [54.5, -3], // UK center
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
	useEffect(() => {
		return () => {
			if (mapManagerRef.current) {
				mapManagerRef.current.destroy();
				mapManagerRef.current = null;
			}
		};
	}, []);

	// Save coordinates and fish count to post meta
	useEffect(() => {
		if (postId) {
			const meta = {};
			
			// Save coordinates if available
			if (latitude && longitude) {
				meta.fish_catch_coordinates = {
					latitude: parseFloat(latitude),
					longitude: parseFloat(longitude)
				};
			}
			
			// Save total fish count
			meta.fish_catch_total_count = catches.length;
			
			// Update post meta
			editPost({ meta });
		}
	}, [postId, latitude, longitude, catches, editPost]);

	return (
		<>
			<InspectorControls> 
				<PanelBody title={__( 'Location Settings', 'fish-catch' )}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
						<Button
							variant="secondary"
							onClick={getCurrentLocation}
							disabled={isGettingLocation}
							style={{ width: '100%' }}
						>
							{isGettingLocation ? __( 'Getting Location...', 'fish-catch' ) : __( '📍 Get Current Location', 'fish-catch' )}
						</Button>
						<Button
							variant="secondary"
							onClick={() => setIsMapModalOpen(true)}
							style={{ width: '100%' }}
						>
							{__('🗺️ Place on Map', 'fish-catch')}
						</Button>
					</div>
					<TextControl
						label={__( 'Location Address', 'fish-catch' )}
						value={locationAddress}
						onChange={(value) => setAttributes({ locationAddress: value })}
						help={__( 'Enter a descriptive address or location name', 'fish-catch' )}
					/>
					<TextControl
						label={__( 'Latitude', 'fish-catch' )}
						value={latitude}
						onChange={(value) => setAttributes({ latitude: value })}
					/>
					<TextControl
						label={__( 'Longitude', 'fish-catch' )}
						value={longitude}
						onChange={(value) => setAttributes({ longitude: value })}
					/>
				</PanelBody>
				
				<PanelBody title={__( 'Units', 'fish-catch' )}>
					<TextControl
						label={__( 'Size Unit', 'fish-catch' )}
						value={sizeUnit}
						onChange={(value) => setAttributes({ sizeUnit: value })}
						help={__( 'Default unit for size measurements (e.g., cm, in)', 'fish-catch' )}
					/>
					<TextControl
						label={__( 'Weight Unit', 'fish-catch' )}
						value={weightUnit}
						onChange={(value) => setAttributes({ weightUnit: value })}
						help={__( 'Default unit for weight measurements (e.g., lbs, kg)', 'fish-catch' )}
					/>
				</PanelBody>

				<PanelBody title={__( 'Display Settings', 'fish-catch' )}>
					<SelectControl
						label={__( 'Default View', 'fish-catch' )}
						value={defaultView}
						options={[
							{ label: __( 'List View', 'fish-catch' ), value: 'list' },
							{ label: __( 'Grid View', 'fish-catch' ), value: 'grid' }
						]}
						onChange={(value) => setAttributes({ defaultView: value })}
						help={__( 'Default view mode for the frontend display', 'fish-catch' )}
					/>
					<SelectControl
						label={__( 'Image Size', 'fish-catch' )}
						value={imageSize}
						options={[
							{ label: __( 'Small', 'fish-catch' ), value: 'small' },
							{ label: __( 'Medium', 'fish-catch' ), value: 'medium' },
							{ label: __( 'Large', 'fish-catch' ), value: 'large' }
						]}
						onChange={(value) => setAttributes({ imageSize: value })}
						help={__( 'Size of images in the gallery', 'fish-catch' )}
					/>
				</PanelBody>

				<PanelBody title={__( 'Card Styling', 'fish-catch' )}>
					<div style={{ marginBottom: '16px' }}>
						<label style={{ 
							display: 'block', 
							marginBottom: '8px', 
							fontWeight: '500',
							fontSize: '13px'
						}}>
							{__( 'Card Background Color', 'fish-catch' )}
						</label>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<input
								type="color"
								value={cardBackgroundColor}
								onChange={(e) => setAttributes({ cardBackgroundColor: e.target.value })}
								style={{ 
									width: '40px', 
									height: '32px', 
									border: '1px solid #ddd',
									borderRadius: '4px',
									cursor: 'pointer'
								}}
							/>
							<TextControl
								value={cardBackgroundColor}
								onChange={(value) => setAttributes({ cardBackgroundColor: value })}
								placeholder="#f9f9f9"
								style={{ flex: 1 }}
							/>
						</div>
					</div>
					
					<div style={{ marginBottom: '16px' }}>
						<label style={{ 
							display: 'block', 
							marginBottom: '8px', 
							fontWeight: '500',
							fontSize: '13px'
						}}>
							{__( 'Card Border Color', 'fish-catch' )}
						</label>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<input
								type="color"
								value={cardBorderColor}
								onChange={(e) => setAttributes({ cardBorderColor: e.target.value })}
								style={{ 
									width: '40px', 
									height: '32px', 
									border: '1px solid #ddd',
									borderRadius: '4px',
									cursor: 'pointer'
								}}
							/>
							<TextControl
								value={cardBorderColor}
								onChange={(value) => setAttributes({ cardBorderColor: value })}
								placeholder="#ddd"
								style={{ flex: 1 }}
							/>
						</div>
					</div>
					
					<TextControl
						label={__( 'Card Border Radius', 'fish-catch' )}
						value={cardBorderRadius}
						onChange={(value) => setAttributes({ cardBorderRadius: parseInt(value) || 12 })}
						help={__( 'Border radius for catch cards in pixels', 'fish-catch' )}
						type="number"
					/>
				</PanelBody>
			</InspectorControls>
			
			{isModalOpen && (
				<Modal
					title={editingIndex !== null ? __( 'Edit Catch', 'fish-catch' ) : __( 'Add Catch', 'fish-catch' )}
					onRequestClose={() => setIsModalOpen(false)}
				>
					<TextControl
						label={__( 'Species', 'fish-catch' )}
						value={newCatch.species}
						onChange={(value) => setNewCatch({...newCatch, species: value})}
					/>
					<div style={{display: 'flex', gap: '10px'}}>
						<TextControl
							label={`${__( 'Size', 'fish-catch' )} (${sizeUnit})`}
							value={newCatch.size}
							onChange={(value) => setNewCatch({...newCatch, size: value.replace(/[^0-9.]/g, '')})}
							type="number"
							step="0.1"
						/>
						<TextControl
							label={`${__( 'Weight', 'fish-catch' )} (${weightUnit})`}
							value={newCatch.weight}
							onChange={(value) => setNewCatch({...newCatch, weight: value.replace(/[^0-9.]/g, '')})}
							type="number"
							step="0.1"
						/>
					</div>
					<TextareaControl
						label={__( 'Comments', 'fish-catch' )}
						value={newCatch.comments}
						onChange={(value) => setNewCatch({...newCatch, comments: value})}
					/>
					
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) => {
								// Media can be a single item or an array, so we need to flatten it
								const mediaArray = Array.isArray(media) ? media : [media];
								setNewCatch({...newCatch, media: [...(newCatch.media || []), ...mediaArray]});
							}}
							allowedTypes={['image', 'video']}
							multiple={true}
							value={newCatch.media ? newCatch.media.map(m => m.id) : []}
							render={({ open }) => (
								<Button onClick={open} variant="secondary">
									{__( 'Add Media', 'fish-catch' )}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					{newCatch.media && newCatch.media.length > 0 && (
						<div style={{marginTop: '10px'}}>
							<p><strong>{__( 'Selected Media:', 'fish-catch' )}</strong></p>
							{newCatch.media.map((mediaItem, mediaIndex) => {
								// Handle nested arrays - flatten them
								const actualMedia = Array.isArray(mediaItem) ? mediaItem[0] : mediaItem;
								return (
									<div key={mediaIndex} style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px'}}>
										{actualMedia.mime && actualMedia.mime.startsWith('image/') ? (
											<img 
												src={actualMedia.url} 
												alt={actualMedia.alt || 'Media'}
												style={{width: '50px', height: '50px', objectFit: 'cover'}}
											/>
										) : (
											<video 
												src={actualMedia.url} 
												style={{width: '50px', height: '50px', objectFit: 'cover'}}
											/>
										)}
										<span>{actualMedia.title || actualMedia.name || 'Media'}</span>
										<Button 
											variant="link" 
											isDestructive 
											onClick={() => removeMedia(mediaIndex)}
										>
											{__( 'Remove', 'fish-catch' )}
										</Button>
									</div>
								);
							})}
						</div>
					)}
					
					<Button
						variant="primary"
						onClick={() => {
							if (editingIndex !== null) {
								// Editing existing catch
								const updatedCatches = [...catches];
								updatedCatches[editingIndex] = newCatch;
								setAttributes({ catches: updatedCatches });
							} else {
								// Adding new catch
								setAttributes({ catches: [...catches, newCatch] });
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
						}}
					>
						{editingIndex !== null ? __( 'Update Catch', 'fish-catch' ) : __( 'Add Catch', 'fish-catch' )}
					</Button>
				</Modal>
			)}

			{isMapModalOpen && (
				<Modal
					title={__( 'Set Location on Map', 'fish-catch' )}
					onRequestClose={() => {
						setIsMapModalOpen(false);
						if (mapManagerRef.current) {
							mapManagerRef.current.destroy();
							mapManagerRef.current = null;
						}
					}}
					style={{ maxWidth: '800px', width: '90vw' }}
				>
					<div style={{ marginBottom: '16px' }}>
						<div 
							id="fish-catch-map-modal" 
							style={{ 
								height: '400px', 
								width: '100%', 
								border: '1px solid #ddd',
								borderRadius: '4px',
								backgroundColor: '#f5f5f5'
							}}
						></div>
						<p style={{ fontSize: '13px', color: '#666', marginTop: '12px', marginBottom: '0' }}>
							{__('Click on the map to set your location, or drag the marker to fine-tune. Use the 📍 button on the map to find your current location.', 'fish-catch')}
						</p>
					</div>
					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
						<Button
							variant="secondary"
							onClick={() => {
								setIsMapModalOpen(false);
								if (mapManagerRef.current) {
									mapManagerRef.current.destroy();
									mapManagerRef.current = null;
								}
							}}
						>
							{__('Cancel', 'fish-catch')}
						</Button>
						<Button
							variant="primary"
							onClick={() => {
								setIsMapModalOpen(false);
								if (mapManagerRef.current) {
									mapManagerRef.current.destroy();
									mapManagerRef.current = null;
								}
							}}
						>
							{__('Done', 'fish-catch')}
						</Button>
					</div>
				</Modal>
			)}
			
			<div { ...useBlockProps() }>
				<div className="location-info">
                    {locationAddress && (
                        <p style={{color: '#1e1e1e', margin: '0 0 8px 0'}}>{locationAddress}</p>
                    )}
                    {latitude && longitude && (
                        <p style={{color: '#666', margin: '0 0 8px 0', fontSize: '14px'}}>{latitude}, {longitude}</p>
                    )}
                    {!locationAddress && !latitude && !longitude && (
                        <p style={{color: '#666', fontStyle: 'italic', margin: '0 0 8px 0'}}>{ __( 'No location set', 'fish-catch' ) }</p>
                    )}
                </div>
                
                <div className="catches-section">
                    <Button
                        variant="primary"
                        onClick={openNewCatchModal}
                    >
                        {__( 'Add Catch', 'fish-catch' )}
                    </Button>
                    
                    {catches.length > 0 && (
                        <div className="catches-list">
                            <h4 style={{color: '#1e1e1e', marginBottom: '12px'}}>{__( 'Catches', 'fish-catch' )}</h4>
                            {catches.map((catchItem, index) => (
                                <div key={index} className="catch-item" style={{border: '1px solid #ddd', borderRadius: '8px', padding: '12px', marginBottom: '8px', backgroundColor: '#f9f9f9'}}>
                                    <div style={{display: 'flex', gap: '12px'}}>
                                        {catchItem.media && catchItem.media.length > 0 && (
                                            <div className="catch-media" style={{flexShrink: 0}}>
                                                {(() => {
                                                    const firstMedia = Array.isArray(catchItem.media[0]) ? catchItem.media[0][0] : catchItem.media[0];
                                                    const remainingCount = catchItem.media.length - 1;
                                                    return (
                                                        <div style={{position: 'relative', width: '60px', height: '60px', overflow: 'hidden', borderRadius: '6px'}}>
                                                            {firstMedia.mime && firstMedia.mime.startsWith('image/') ? (
                                                                <img 
                                                                    src={firstMedia.url} 
                                                                    alt={firstMedia.alt || 'Catch media'}
                                                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                                />
                                                            ) : (
                                                                <video 
                                                                    src={firstMedia.url} 
                                                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                                />
                                                            )}
                                                            {remainingCount > 0 && (
                                                                <div style={{
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
                                                                }}>
                                                                    +{remainingCount}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                        <div style={{flex: 1, minWidth: 0}}>
                                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px'}}>
                                                <div style={{flex: 1}}>
                                                    <h5 style={{margin: '0', fontSize: '15px', fontWeight: 'bold', lineHeight: '1.3', color: '#1e1e1e'}}>
                                                        {catchItem.species || __( 'Unknown Species', 'fish-catch' )}
                                                        {(catchItem.size || catchItem.weight) && (
                                                            <span style={{fontWeight: 'normal', color: '#666', fontSize: '13px', marginLeft: '8px'}}>
                                                                ({[
                                                                    catchItem.size && `${catchItem.size}${sizeUnit}`,
                                                                    catchItem.weight && `${catchItem.weight}${weightUnit}`
                                                                ].filter(Boolean).join(' | ')})
                                                            </span>
                                                        )}
                                                    </h5>
                                                </div>
                                                <div className="catch-actions" style={{display: 'flex', gap: '4px', marginLeft: '8px'}}>
                                                    <Button
                                                        variant="secondary"
                                                        size="small"
                                                        onClick={() => editCatch(index)}
                                                    >
                                                        {__( 'Edit', 'fish-catch' )}
                                                    </Button>
                                                    <Button
                                                        variant="link"
                                                        isDestructive
                                                        size="small"
                                                        onClick={() => removeCatch(index)}
                                                    >
                                                        {__( 'Remove', 'fish-catch' )}
                                                    </Button>
                                                </div>
                                            </div>
                                            {catchItem.comments && (
                                                <p style={{margin: '0', fontSize: '13px', color: '#555', lineHeight: '1.4'}}>{catchItem.comments}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
			</div>
		</>
	);
}
