/**
 * Shared Leaflet loading utilities for Fish Catch blocks
 * Handles waiting for enqueued Leaflet to be available
 */

/**
 * Check if Leaflet is available
 * @returns {boolean} True if Leaflet is loaded
 */
export function isLeafletAvailable() {
    return typeof window.L !== 'undefined';
}

/**
 * Wait for Leaflet to be available (enqueued by WordPress)
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Promise} Resolves when Leaflet is available
 */
export function waitForLeaflet(timeout = 10000) {
    if (isLeafletAvailable()) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const checkLeaflet = () => {
            if (isLeafletAvailable()) {
                resolve();
            } else if (Date.now() - startTime > timeout) {
                reject(new Error('Leaflet failed to load within timeout'));
            } else {
                setTimeout(checkLeaflet, 100);
            }
        };
        
        checkLeaflet();
    });
}

/**
 * Load Leaflet with proper error handling and timeout
 * This replaces the manual script loading in both edit components
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Timeout in milliseconds
 * @param {boolean} options.throwOnError - Whether to throw on timeout
 * @returns {Promise} Resolves when Leaflet is available
 */
export async function loadLeaflet(options = {}) {
    const { timeout = 10000, throwOnError = true } = options;
    
    try {
        await waitForLeaflet(timeout);
        return Promise.resolve();
    } catch (error) {
        if (throwOnError) {
            throw error;
        } else {
            console.warn('Leaflet loading failed:', error.message);
            return Promise.reject(error);
        }
    }
}

/**
 * Create a Leaflet loader instance for class-based components
 * Maintains state to avoid multiple loading attempts
 */
export class LeafletLoader {
    constructor() {
        this.isLoaded = false;
    }

    /**
     * Load Leaflet if not already loaded
     * @param {Object} options - Configuration options
     * @returns {Promise} Resolves when Leaflet is available
     */
    async load(options = {}) {
        if (this.isLoaded || isLeafletAvailable()) {
            this.isLoaded = true;
            return Promise.resolve();
        }

        try {
            await loadLeaflet(options);
            this.isLoaded = true;
            return Promise.resolve();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Reset the loader state (useful for testing or re-initialization)
     */
    reset() {
        this.isLoaded = false;
    }
}
