// Global variables
let map;
let markers = [];
let routingControl;
let currentRoute;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeNavigation();
    initializeSearch();
    initializeDestinationCards();
    initializeRouteCalculation();
});

// Initialize the interactive map
function initializeMap() {
    // Initialize map centered on a default location (New York)
    map = L.map('map-container').setView([40.7128, -74.0060], 10);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add some default markers for popular destinations
    const destinations = [
        // USA
        { name: 'New York City', lat: 40.7128, lng: -74.0060, description: 'Times Square, Central Park, Statue of Liberty' },
        { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, description: 'Hollywood, Beverly Hills, Santa Monica Pier' },
        { name: 'Miami Beach', lat: 25.7617, lng: -80.1918, description: 'South Beach, Art Deco District, Ocean Drive' },
        { name: 'Las Vegas', lat: 36.1699, lng: -115.1398, description: 'The Strip, Fremont Street, Grand Canyon' },
        
        // Europe
        { name: 'Paris', lat: 48.8566, lng: 2.3522, description: 'Eiffel Tower, Louvre Museum, Notre-Dame' },
        { name: 'London', lat: 51.5074, lng: -0.1278, description: 'Big Ben, Buckingham Palace, Tower Bridge' },
        { name: 'Rome', lat: 41.9028, lng: 12.4964, description: 'Colosseum, Vatican City, Trevi Fountain' },
        { name: 'Madrid', lat: 40.4168, lng: -3.7038, description: 'Prado Museum, Plaza Mayor, Royal Palace' },
        { name: 'Berlin', lat: 52.5200, lng: 13.4050, description: 'Brandenburg Gate, Berlin Wall, Museum Island' },
        { name: 'Vienna', lat: 48.2082, lng: 16.3738, description: 'Schönbrunn Palace, St. Stephen\'s Cathedral' },
        
        // Asia
        { name: 'Tokyo', lat: 35.6762, lng: 139.6503, description: 'Shibuya Crossing, Senso-ji Temple, Tokyo Tower' },
        { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, description: 'Victoria Peak, Tsim Sha Tsui, Lantau Island' },
        { name: 'Singapore', lat: 1.3521, lng: 103.8198, description: 'Marina Bay Sands, Gardens by the Bay, Sentosa' },
        { name: 'Bangkok', lat: 13.7563, lng: 100.5018, description: 'Grand Palace, Wat Phra Kaew, Chatuchak Market' },
        
        // Middle East
        { name: 'Dubai', lat: 25.2048, lng: 55.2708, description: 'Burj Khalifa, Palm Jumeirah, Dubai Mall' },
        { name: 'Mecca', lat: 21.4225, lng: 39.8262, description: 'Kaaba, Masjid al-Haram, Mount Arafat' },
        
        // Oceania
        { name: 'Sydney', lat: -33.8688, lng: 151.2093, description: 'Sydney Opera House, Bondi Beach, Harbour Bridge' },
        { name: 'Melbourne', lat: -37.8136, lng: 144.9631, description: 'Federation Square, Great Ocean Road, Yarra Valley' },
        { name: 'Auckland', lat: -36.8485, lng: 174.7633, description: 'Sky Tower, Waiheke Island, Waitakere Ranges' }
    ];

    destinations.forEach(dest => {
        const marker = L.marker([dest.lat, dest.lng])
            .addTo(map)
            .bindPopup(`
                <div style="text-align: center;">
                    <h3 style="margin: 0 0 10px 0; color: #1e293b;">${dest.name}</h3>
                    <p style="margin: 0; color: #64748b;">${dest.description}</p>
                    <button onclick="setDestination('${dest.name}', ${dest.lat}, ${dest.lng})" 
                            style="margin-top: 10px; padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Set as Destination
                    </button>
                </div>
            `);
        markers.push(marker);
    });
}

// Initialize mobile navigation
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('destination-search');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            searchDestination(query);
        }
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchDestination(query);
            }
        }
    });
}

// Search for destinations
function searchDestination(query) {
    // Simulate search functionality
    const destinations = [
        // USA
        'New York City', 'Los Angeles', 'Miami Beach', 'Las Vegas',
        // Europe
        'Paris', 'London', 'Rome', 'Madrid', 'Berlin', 'Vienna',
        // Asia
        'Tokyo', 'Hong Kong', 'Singapore', 'Bangkok',
        // Middle East
        'Dubai', 'Mecca',
        // Oceania
        'Sydney', 'Melbourne', 'Auckland'
    ];

    const results = destinations.filter(dest => 
        dest.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length > 0) {
        // For demo purposes, we'll just show the first result
        const destination = results[0];
        alert(`Found destination: ${destination}`);
        
        // You could implement a more sophisticated search here
        // For now, we'll just scroll to the map section
        document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
    } else {
        alert('Destination not found. Try searching for popular cities like New York, Paris, Tokyo, etc.');
    }
}

// Initialize destination cards
function initializeDestinationCards() {
    const cards = document.querySelectorAll('.destination-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const lat = parseFloat(this.dataset.lat);
            const lng = parseFloat(this.dataset.lng);
            const name = this.querySelector('h3').textContent;
            
            // Center map on the selected destination
            map.setView([lat, lng], 12);
            
            // Show popup for the destination
            const marker = markers.find(m => 
                m.getLatLng().lat === lat && m.getLatLng().lng === lng
            );
            if (marker) {
                marker.openPopup();
            }
        });
    });
}

// Initialize route calculation
function initializeRouteCalculation() {
    const calculateBtn = document.getElementById('calculate-route');
    const startInput = document.getElementById('start-location');
    const endInput = document.getElementById('end-location');

    calculateBtn.addEventListener('click', function() {
        const startLocation = startInput.value.trim();
        const endLocation = endInput.value.trim();

        if (!startLocation || !endLocation) {
            alert('Please enter both start and end locations');
            return;
        }

        calculateRoute(startLocation, endLocation);
    });

    // Add event listeners for Enter key
    startInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateBtn.click();
        }
    });

    endInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateBtn.click();
        }
    });
}

// Calculate route between two locations
function calculateRoute(startLocation, endLocation) {
    const calculateBtn = document.getElementById('calculate-route');
    const originalText = calculateBtn.innerHTML;
    
    // Show loading state
    calculateBtn.innerHTML = '<div class="loading"></div> Calculating...';
    calculateBtn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
        try {
            // For demo purposes, we'll use predefined coordinates
            // In a real application, you would use a geocoding service
            const startCoords = getCoordinatesForLocation(startLocation);
            const endCoords = getCoordinatesForLocation(endLocation);

            if (startCoords && endCoords) {
                displayRoute(startCoords, endCoords, startLocation, endLocation);
            } else {
                // Use random coordinates for demo
                const randomStart = [40.7128 + (Math.random() - 0.5) * 0.1, -74.0060 + (Math.random() - 0.5) * 0.1];
                const randomEnd = [48.8566 + (Math.random() - 0.5) * 0.1, 2.3522 + (Math.random() - 0.5) * 0.1];
                displayRoute(randomStart, randomEnd, startLocation, endLocation);
            }
        } catch (error) {
            console.error('Error calculating route:', error);
            alert('Error calculating route. Please try again.');
        } finally {
            // Reset button state
            calculateBtn.innerHTML = originalText;
            calculateBtn.disabled = false;
        }
    }, 2000);
}

// Get coordinates for a location (simplified for demo)
function getCoordinatesForLocation(location) {
    const locationMap = {
        // USA
        'new york': [40.7128, -74.0060],
        'los angeles': [34.0522, -118.2437],
        'miami beach': [25.7617, -80.1918],
        'las vegas': [36.1699, -115.1398],
        
        // Europe
        'paris': [48.8566, 2.3522],
        'london': [51.5074, -0.1278],
        'rome': [41.9028, 12.4964],
        'madrid': [40.4168, -3.7038],
        'berlin': [52.5200, 13.4050],
        'vienna': [48.2082, 16.3738],
        
        // Asia
        'tokyo': [35.6762, 139.6503],
        'hong kong': [22.3193, 114.1694],
        'singapore': [1.3521, 103.8198],
        'bangkok': [13.7563, 100.5018],
        
        // Middle East
        'dubai': [25.2048, 55.2708],
        'mecca': [21.4225, 39.8262],
        
        // Oceania
        'sydney': [-33.8688, 151.2093],
        'melbourne': [-37.8136, 144.9631],
        'auckland': [-36.8485, 174.7633]
    };

    const normalizedLocation = location.toLowerCase();
    return locationMap[normalizedLocation] || null;
}

// Display route on the map
function displayRoute(startCoords, endCoords, startName, endName) {
    // Clear existing route
    if (routingControl) {
        map.removeControl(routingControl);
    }

    // Add markers for start and end points
    const startMarker = L.marker(startCoords, {
        icon: L.divIcon({
            className: 'custom-div-icon',
            html: '<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(map);

    const endMarker = L.marker(endCoords, {
        icon: L.divIcon({
            className: 'custom-div-icon',
            html: '<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(map);

    // Add popups to markers
    startMarker.bindPopup(`<b>Start:</b> ${startName}`);
    endMarker.bindPopup(`<b>Destination:</b> ${endName}`);

    // Draw a simple line between the points
    const routeLine = L.polyline([startCoords, endCoords], {
        color: '#2563eb',
        weight: 4,
        opacity: 0.7
    }).addTo(map);

    // Fit map to show the entire route
    map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });

    // Calculate and display route information
    const distance = calculateDistance(startCoords, endCoords);
    const eta = calculateETA(distance);

    displayRouteInfo(distance, eta, startName, endName);

    // Store current route
    currentRoute = {
        start: startCoords,
        end: endCoords,
        startName: startName,
        endName: endName,
        distance: distance,
        eta: eta
    };
}

// Calculate distance between two points using Haversine formula
function calculateDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Calculate estimated time of arrival
function calculateETA(distance) {
    // Assume average speed of 80 km/h for car travel
    const averageSpeed = 80; // km/h
    const timeInHours = distance / averageSpeed;
    
    if (timeInHours < 1) {
        return Math.round(timeInHours * 60) + ' minutes';
    } else if (timeInHours < 24) {
        const hours = Math.floor(timeInHours);
        const minutes = Math.round((timeInHours - hours) * 60);
        return `${hours}h ${minutes}m`;
    } else {
        const days = Math.floor(timeInHours / 24);
        const hours = Math.floor(timeInHours % 24);
        return `${days}d ${hours}h`;
    }
}

// Display route information
function displayRouteInfo(distance, eta, startName, endName) {
    const routeInfo = document.getElementById('route-info');
    const distanceElement = document.getElementById('distance');
    const etaElement = document.getElementById('eta');
    const travelModeElement = document.getElementById('travel-mode');

    // Format distance
    let distanceText;
    if (distance < 1) {
        distanceText = Math.round(distance * 1000) + ' m';
    } else {
        distanceText = distance.toFixed(1) + ' km';
    }

    distanceElement.textContent = distanceText;
    etaElement.textContent = eta;
    travelModeElement.textContent = 'Car';

    // Show the route info section
    routeInfo.style.display = 'block';

    // Add animation
    routeInfo.style.opacity = '0';
    routeInfo.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        routeInfo.style.transition = 'all 0.5s ease';
        routeInfo.style.opacity = '1';
        routeInfo.style.transform = 'translateY(0)';
    }, 100);
}

// Set destination from map popup
function setDestination(name, lat, lng) {
    document.getElementById('end-location').value = name;
    
    // Center map on the destination
    map.setView([lat, lng], 12);
    
    // If we have a start location, calculate the route
    const startLocation = document.getElementById('start-location').value.trim();
    if (startLocation) {
        calculateRoute(startLocation, name);
    }
}

// Add scroll effects
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.destination-card, .feature, .info-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (diff > 0 && navMenu.classList.contains('active')) {
            // Swipe left - close menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
}

// Add error handling for map loading
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        e.target.parentElement.innerHTML += '<div style="background: #f3f4f6; height: 250px; display: flex; align-items: center; justify-content: center; color: #6b7280;">Image not available</div>';
    }
});

// Export functions for global access
window.setDestination = setDestination;
window.calculateRoute = calculateRoute; 