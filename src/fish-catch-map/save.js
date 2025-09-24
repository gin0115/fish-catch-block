/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Save component for Fish Catch Map block
 * 
 * Note: The actual map data will be loaded via PHP on the frontend
 * to ensure fresh data and better performance
 */
export default function save({ attributes }) {
    const { 
        mapHeight, 
        minCatchCount, 
        showPostTitles, 
        showCatchCount 
    } = attributes;

    // Generate unique ID for this map instance
    const mapId = `fish-catch-map-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div {...useBlockProps.save()}>
            <div className="fish-catch-map-block">
                <div 
                    id={mapId}
                    className="fish-catch-map-container"
                    data-height={mapHeight}
                    data-min-catch-count={minCatchCount}
                    data-show-post-titles={showPostTitles ? '1' : '0'}
                    data-show-catch-count={showCatchCount ? '1' : '0'}
                    style={{ 
                        height: `${mapHeight}px`,
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#f5f5f5',
                        position: 'relative'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        color: '#666'
                    }}>
                        <div>🗺️</div>
                        <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Loading fishing locations...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
