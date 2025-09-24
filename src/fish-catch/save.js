/**
 * Retrieves the translation of text.
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 */
console.log('LOADING: /src/fish-catch/save.js');
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 */
export default function save({ attributes, className }) {
	const { locationAddress, latitude, longitude, catches, sizeUnit, weightUnit, defaultView, cardBackgroundColor, cardBorderColor, cardBorderRadius, imageSize } = attributes;
	const blockProps = useBlockProps.save({ className });

	// Generate unique IDs for map and gallery
	const mapId = `fish-catch-map-${Math.random().toString(36).substr(2, 9)}`;
	const viewToggleId = `view-toggle-${Math.random().toString(36).substr(2, 9)}`;

	// Helper function to get fish initials
	const getFishInitials = (species) => {
		if (!species) return '?';
		return species.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2);
	};

	// Helper function to get image size based on setting
	const getImageSize = (size) => {
		const sizes = {
			small: { list: '40px', grid: '60px', gallery: '60px' },
			medium: { list: '60px', grid: '80px', gallery: '80px' },
			large: { list: '80px', grid: '100px', gallery: '100px' }
		};
		return sizes[size] || sizes.medium;
	};

	const imageSizes = getImageSize(imageSize);

	return (
		<div { ...blockProps } className="fish-catch-block">
			{/* Location Section */}
			{locationAddress && (
				<div className="location-section" style={{ marginBottom: '24px' }}>
					<h3 style={{ 
						margin: '0 0 12px 0', 
						fontSize: '18px', 
						fontWeight: 'bold',
						color: '#1e1e1e'
					}}>
						📍 {locationAddress}
					</h3>
					{latitude && longitude && (
						<div style={{ 
							margin: '8px 0 0 0',
							display: 'flex',
							flexWrap: 'wrap',
							gap: '8px'
						}}>
							<a 
								href={`https://www.google.com/maps?q=${latitude},${longitude}`}
								target="_blank"
								rel="noopener noreferrer"
								style={{
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
								}}
								onMouseOver={(e) => {
									e.target.style.backgroundColor = '#e0e0e0';
									e.target.style.transform = 'translateY(-1px)';
								}}
								onMouseOut={(e) => {
									e.target.style.backgroundColor = '#f0f0f0';
									e.target.style.transform = 'translateY(0)';
								}}
							>
								🗺️ Google Maps
							</a>
							<a 
								href={`https://maps.apple.com/?q=${latitude},${longitude}`}
								target="_blank"
								rel="noopener noreferrer"
								style={{
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
								}}
								onMouseOver={(e) => {
									e.target.style.backgroundColor = '#e0e0e0';
									e.target.style.transform = 'translateY(-1px)';
								}}
								onMouseOut={(e) => {
									e.target.style.backgroundColor = '#f0f0f0';
									e.target.style.transform = 'translateY(0)';
								}}
							>
								🍎 Apple Maps
							</a>
							<a 
								href={`https://www.bing.com/maps?q=${latitude},${longitude}`}
								target="_blank"
								rel="noopener noreferrer"
								style={{
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
								}}
								onMouseOver={(e) => {
									e.target.style.backgroundColor = '#e0e0e0';
									e.target.style.transform = 'translateY(-1px)';
								}}
								onMouseOut={(e) => {
									e.target.style.backgroundColor = '#f0f0f0';
									e.target.style.transform = 'translateY(0)';
								}}
							>
								🔍 Bing Maps
							</a>
							<a 
								href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`}
								target="_blank"
								rel="noopener noreferrer"
								style={{
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
								}}
								onMouseOver={(e) => {
									e.target.style.backgroundColor = '#e0e0e0';
									e.target.style.transform = 'translateY(-1px)';
								}}
								onMouseOut={(e) => {
									e.target.style.backgroundColor = '#f0f0f0';
									e.target.style.transform = 'translateY(0)';
								}}
							>
								🌍 OpenStreetMap
							</a>
							<a 
								href={`https://what3words.com/`}
								target="_blank"
								rel="noopener noreferrer"
								style={{
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
								}}
								onMouseOver={(e) => {
									e.target.style.backgroundColor = '#e0e0e0';
									e.target.style.transform = 'translateY(-1px)';
								}}
								onMouseOut={(e) => {
									e.target.style.backgroundColor = '#f0f0f0';
									e.target.style.transform = 'translateY(0)';
								}}
							>
								📍 What3Words
							</a>
						</div>
					)}
				</div>
			)}

			{/* Map Section */}
			{latitude && longitude && (
				<div className="map-section" style={{ marginBottom: '32px' }}>
					<div 
						id={mapId}
						data-lat={latitude}
						data-lng={longitude}
						data-location={locationAddress || 'Fishing Location'}
						style={{ 
							height: '300px', 
							width: '100%', 
							borderRadius: '8px',
							border: '1px solid #ddd',
							backgroundColor: '#f5f5f5'
						}}
					></div>
				</div>
			)}

			{/* Catches Section */}
			{catches && catches.length > 0 && (
				<div className="catches-section">
					<div style={{ 
						display: 'flex', 
						justifyContent: 'space-between', 
						alignItems: 'center',
						marginBottom: '20px'
					}}>
						<h3 style={{ 
							margin: '0', 
							fontSize: '20px', 
							fontWeight: 'bold',
							color: '#1e1e1e'
						}}>
							🎣 {__( 'Fish Caught', 'fish-catch' )} ({catches.length})
						</h3>
						
						{/* View Toggle */}
						<div 
							id={viewToggleId}
							style={{ 
								display: 'flex', 
								gap: '4px',
								backgroundColor: '#f0f0f0',
								borderRadius: '6px',
								padding: '2px'
							}}
						>
							<button 
								className={`view-btn ${defaultView === 'list' ? 'active' : ''}`}
								data-view="list-view"
								style={{
									padding: '6px 12px',
									border: 'none',
									borderRadius: '4px',
									backgroundColor: defaultView === 'list' ? '#007cba' : 'transparent',
									color: defaultView === 'list' ? 'white' : '#666',
									fontSize: '12px',
									fontWeight: '500',
									cursor: 'pointer',
									transition: 'all 0.2s ease'
								}}
							>
								📋 List
							</button>
							<button 
								className={`view-btn ${defaultView === 'grid' ? 'active' : ''}`}
								data-view="grid-view"
								style={{
									padding: '6px 12px',
									border: 'none',
									borderRadius: '4px',
									backgroundColor: defaultView === 'grid' ? '#007cba' : 'transparent',
									color: defaultView === 'grid' ? 'white' : '#666',
									fontSize: '12px',
									fontWeight: '500',
									cursor: 'pointer',
									transition: 'all 0.2s ease'
								}}
							>
								🔲 Grid
							</button>
						</div>
					</div>
					
					<div className={`catches-grid ${defaultView}-view`} style={{ 
						display: 'grid', 
						gap: '16px',
						gridTemplateColumns: defaultView === 'list' ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))'
					}}>
						{catches.map((catchItem, index) => (
							<div 
								key={index} 
								className="catch-card" 
								style={{ 
									border: `1px solid ${cardBorderColor}`, 
									borderRadius: `${cardBorderRadius}px`, 
									padding: '16px', 
									backgroundColor: cardBackgroundColor,
									boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
								}}
							>
								{/* List View Layout */}
								<div className="list-view-content" style={{ 
									display: defaultView === 'list' ? 'flex' : 'none', 
									gap: '12px', 
									alignItems: 'flex-start' 
								}}>
									{/* Compact Media */}
									{catchItem.media && catchItem.media.length > 0 ? (
										<div style={{ flexShrink: 0 }}>
											<div 
												className="catch-media-gallery" 
												data-media={JSON.stringify(catchItem.media.map(item => {
													const actualMedia = Array.isArray(item) ? item[0] : item;
													return {
														url: actualMedia.url,
														alt: actualMedia.alt || `Catch photo`,
														mime: actualMedia.mime
													};
												}))}
												style={{ 
													width: imageSizes.list,
													height: imageSizes.list,
													position: 'relative',
													overflow: 'hidden',
													borderRadius: '6px',
													cursor: 'pointer',
													backgroundColor: '#f0f0f0'
												}}
											>
												{(() => {
													const firstMedia = Array.isArray(catchItem.media[0]) ? catchItem.media[0][0] : catchItem.media[0];
													return firstMedia.mime && firstMedia.mime.startsWith('image/') ? (
														<img 
															src={firstMedia.url} 
															alt={firstMedia.alt || `Catch photo`}
															style={{ 
																width: '100%', 
																height: '100%', 
																objectFit: 'cover'
															}}
														/>
													) : (
														<video 
															src={firstMedia.url} 
															style={{ 
																width: '100%', 
																height: '100%', 
																objectFit: 'cover'
															}}
														/>
													);
												})()}
												{catchItem.media.length > 1 && (
													<div style={{
														position: 'absolute',
														bottom: '2px',
														right: '2px',
														backgroundColor: 'rgba(0, 0, 0, 0.7)',
														color: 'white',
														fontSize: '10px',
														fontWeight: 'bold',
														padding: '1px 4px',
														borderRadius: '2px'
													}}>
														+{catchItem.media.length - 1}
													</div>
												)}
											</div>
										</div>
									) : (
										<div style={{ 
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
										}}>
											{getFishInitials(catchItem.species)}
										</div>
									)}

									{/* Content */}
									<div style={{ flex: 1, minWidth: 0 }}>
										<div style={{ 
											display: 'flex', 
											alignItems: 'center', 
											gap: '8px',
											marginBottom: catchItem.comments ? '4px' : '0',
											flexWrap: 'wrap'
										}}>
											<h4 style={{ 
												margin: '0', 
												fontSize: '16px', 
												fontWeight: 'bold',
												color: '#1e1e1e'
											}}>
												{catchItem.species || __( 'Unknown Species', 'fish-catch' )}
											</h4>
											{(catchItem.size || catchItem.weight) && (
												<span style={{ 
													fontSize: '14px', 
													color: '#666',
													fontWeight: '500'
												}}>
													({[
														catchItem.size && `${catchItem.size}${sizeUnit || 'cm'}`,
														catchItem.weight && `${catchItem.weight}${weightUnit || 'kg'}`
													].filter(Boolean).join(' • ')})
												</span>
											)}
										</div>
										{catchItem.comments && (
											<p style={{ 
												margin: '0', 
												fontSize: '13px', 
												color: '#555',
												fontStyle: 'italic',
												lineHeight: '1.3'
											}}>
												"{catchItem.comments}"
											</p>
										)}
									</div>
								</div>

								{/* Grid View Layout */}
								<div className="grid-view-content" style={{ display: defaultView === 'grid' ? 'block' : 'none' }}>
									{/* Grid Header */}
									<div style={{ marginBottom: '12px' }}>
										<h4 style={{ 
											margin: '0 0 8px 0', 
											fontSize: '16px', 
											fontWeight: 'bold',
											color: '#1e1e1e'
										}}>
											{catchItem.species || __( 'Unknown Species', 'fish-catch' )}
										</h4>
										{(catchItem.size || catchItem.weight) && (
											<p style={{ 
												margin: '0 0 8px 0', 
												fontSize: '14px', 
												color: '#666',
												fontWeight: '500'
											}}>
												{[
													catchItem.size && `${catchItem.size}${sizeUnit || 'cm'}`,
													catchItem.weight && `${catchItem.weight}${weightUnit || 'kg'}`
												].filter(Boolean).join(' • ')}
											</p>
										)}
										{catchItem.comments && (
											<p style={{ 
												margin: '0', 
												fontSize: '13px', 
												color: '#555',
												fontStyle: 'italic',
												lineHeight: '1.4'
											}}>
												"{catchItem.comments}"
											</p>
										)}
									</div>

									{/* Grid Media */}
									{catchItem.media && catchItem.media.length > 0 ? (
										<div 
											className="catch-media-gallery" 
											data-media={JSON.stringify(catchItem.media.map(item => {
												const actualMedia = Array.isArray(item) ? item[0] : item;
												return {
													url: actualMedia.url,
													alt: actualMedia.alt || `Catch photo`,
													mime: actualMedia.mime
												};
											}))}
											style={{ 
												display: 'grid', 
												gridTemplateColumns: `repeat(auto-fit, minmax(${imageSizes.gallery}, 1fr))`,
												gap: '8px',
												marginTop: '12px'
											}}
										>
											{catchItem.media.map((mediaItem, mediaIndex) => {
												const actualMedia = Array.isArray(mediaItem) ? mediaItem[0] : mediaItem;
												return (
													<div 
														key={mediaIndex}
														style={{ 
															position: 'relative',
															aspectRatio: '1',
															overflow: 'hidden',
															borderRadius: '6px',
															cursor: 'pointer',
															backgroundColor: '#f0f0f0'
														}}
													>
														{actualMedia.mime && actualMedia.mime.startsWith('image/') ? (
															<img 
																src={actualMedia.url} 
																alt={actualMedia.alt || `Catch photo ${mediaIndex + 1}`}
																style={{ 
																	width: '100%', 
																	height: '100%', 
																	objectFit: 'cover',
																	transition: 'transform 0.2s ease'
																}}
															/>
														) : (
															<video 
																src={actualMedia.url} 
																style={{ 
																	width: '100%', 
																	height: '100%', 
																	objectFit: 'cover'
																}}
																controls
															/>
														)}
														{catchItem.media.length > 1 && mediaIndex === 0 && (
															<div style={{
																position: 'absolute',
																bottom: '4px',
																right: '4px',
																backgroundColor: 'rgba(0, 0, 0, 0.7)',
																color: 'white',
																fontSize: '11px',
																fontWeight: 'bold',
																padding: '2px 6px',
																borderRadius: '3px'
															}}>
																+{catchItem.media.length - 1}
															</div>
														)}
													</div>
												);
											})}
										</div>
									) : (
										<div style={{
											width: '100%',
											height: '120px',
											backgroundColor: '#e0e0e0',
											borderRadius: '8px',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
											marginTop: '12px'
										}}>
											<div style={{
												fontSize: '24px',
												fontWeight: 'bold',
												color: '#666',
												marginBottom: '4px'
											}}>
												{getFishInitials(catchItem.species)}
											</div>
											<div style={{
												fontSize: '12px',
												color: '#999'
											}}>
												No photos
											</div>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* No catches message */}
			{(!catches || catches.length === 0) && (
				<div style={{ 
					textAlign: 'center', 
					padding: '40px 20px',
					color: '#666',
					fontStyle: 'italic'
				}}>
					<p style={{ margin: '0', fontSize: '16px' }}>
						{__( 'No fish caught yet. Add your first catch!', 'fish-catch' )}
					</p>
				</div>
			)}
		</div>
	);
}
