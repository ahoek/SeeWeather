/**
 * Locations service
 */
app.services.service('Locations', (localStorageService, $filter) => {
    activeLocation: null,
    
    all() {
        return localStorageService.get('locations') || []
    },
    
    get(locationId) {
        return $filter('filter')(this.all(), {id: locationId}, true)
    },
    
    save(locations) {
        localStorageService.set('locations', locations)
    },
    
    getActiveLocation() {
        var location
        if (this.activeLocation) {
            location = this.activeLocation
        } else {
            location = localStorageService.get('lastActiveLocation')
        }
        return location
    },
    
    setActiveLocation(location) {
        this.activeLocation = location
        localStorageService.set('lastActiveLocation', this.activeLocation)
    }
})

