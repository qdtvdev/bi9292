/**
 * Location Tracker JavaScript
 * Fetches and displays user's IP-based location information
 */

// Global variables
let retryCount = 0;
const maxRetries = 3;

/**
 * Initialize the application when document is ready
 */
$(document).ready(function() {
    console.log('Location tracker initialized');
    fetchLocationData();
});

/**
 * Fetch location data from ipapi.co service
 */
function fetchLocationData() {
    // Show loading state
    showLoading();
    hideError();
    hideLocationData();
    
    console.log('Fetching location data...');
    
    // Make AJAX request to ipapi.co
    $.ajax({
        url: "https://ipapi.co/json/",
        method: "GET",
        timeout: 10000, // 10 seconds timeout
        success: function(data) {
            console.log('Location data received:', data);
            handleLocationSuccess(data);
            retryCount = 0; // Reset retry count on success
        },
        error: function(xhr, status, error) {
            console.error('Error fetching location data:', error);
            console.error('Status:', status);
            console.error('Response:', xhr.responseText);
            handleLocationError(error, status);
        }
    });
}

/**
 * Handle successful location data response
 * @param {Object} data - Location data from API
 */
function handleLocationSuccess(data) {
    // Validate that we have the required data
    if (!data || !data.ip) {
        console.error('Invalid data received:', data);
        handleLocationError('Invalid data received', 'parsererror');
        return;
    }
    
    // Populate the location information
    populateLocationData(data);
    
    // Hide loading and show data
    hideLoading();
    showLocationData();
    
    console.log('Location data successfully displayed');
}

/**
 * Populate the HTML elements with location data
 * @param {Object} data - Location data object
 */
function populateLocationData(data) {
    // Helper function to safely set text content
    const safeSet = (selector, value) => {
        const element = $(selector);
        if (element.length) {
            element.text(value || 'N/A');
        }
    };
    
    // Populate all location fields
    safeSet("#ip_address", data.ip);
    safeSet("#country_name", data.country_name);
    safeSet("#region_name", data.region);
    safeSet("#city_name", data.city);
    safeSet("#latitude", data.latitude);
    safeSet("#longitude", data.longitude);
    safeSet("#postal_code", data.postal);
    safeSet("#timezone", data.timezone);
    safeSet("#isp", data.org);
    
    // Log the populated data for debugging
    console.log('Populated location data:', {
        ip: data.ip,
        country: data.country_name,
        region: data.region,
        city: data.city,
        lat: data.latitude,
        lng: data.longitude,
        postal: data.postal,
        timezone: data.timezone,
        isp: data.org
    });
}

/**
 * Handle location data fetch errors
 * @param {string} error - Error message
 * @param {string} status - Error status
 */
function handleLocationError(error, status) {
    hideLoading();
    hideLocationData();
    
    // Determine if we should retry
    if (retryCount < maxRetries && (status === 'timeout' || status === 'error')) {
        retryCount++;
        console.log(`Retrying... Attempt ${retryCount}/${maxRetries}`);
        
        // Retry after a delay
        setTimeout(() => {
            fetchLocationData();
        }, 2000 * retryCount); // Exponential backoff
        
        return;
    }
    
    // Show error message
    showError();
    
    // Log detailed error information
    console.error('Failed to fetch location data after retries:', {
        error: error,
        status: status,
        retryCount: retryCount
    });
}

/**
 * UI State Management Functions
 */

function showLoading() {
    $("#loading").removeClass('d-none');
}

function hideLoading() {
    $("#loading").addClass('d-none');
}

function showError() {
    $("#error").removeClass('d-none');
}

function hideError() {
    $("#error").addClass('d-none');
}

function showLocationData() {
    $("#location-data").removeClass('d-none');
    $("#bottom-hr").removeClass('d-none');
    $("#refresh-section").removeClass('d-none');
}

function hideLocationData() {
    $("#location-data").addClass('d-none');
    $("#bottom-hr").addClass('d-none');
    $("#refresh-section").addClass('d-none');
}

/**
 * Utility Functions
 */

/**
 * Format coordinates for better display
 * @param {number} coord - Coordinate value
 * @param {number} precision - Decimal places
 * @returns {string} Formatted coordinate
 */
function formatCoordinate(coord, precision = 4) {
    if (coord === null || coord === undefined) return 'N/A';
    return parseFloat(coord).toFixed(precision);
}

/**
 * Check if the browser is online
 * @returns {boolean} Online status
 */
function isOnline() {
    return navigator.onLine;
}

// Add online/offline event listeners
window.addEventListener('online', function() {
    console.log('Browser is online');
    if ($("#error").is(':visible')) {
        fetchLocationData();
    }
});

window.addEventListener('offline', function() {
    console.log('Browser is offline');
});

// Export functions for global access (if needed)
window.fetchLocationData = fetchLocationData;
