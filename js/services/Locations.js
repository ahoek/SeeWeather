/**
 * Locations service
 */

class Locations {
    constructor(localStorageService) {
        this.localStorageService = localStorageService
    }
    
    all() {
        return this.localStorageService.get('locations') || []
    }

    save(locations) {
        this.localStorageService.set('locations', locations)
    }

    getActiveLocation() {
        var location
        if (this.activeLocation) {
            location = this.activeLocation
        } else {
            location = this.localStorageService.get('lastActiveLocation')
        }
        return location
    }

    setActiveLocation(location) {
        this.activeLocation = location
        this.localStorageService.set('lastActiveLocation', this.activeLocation)
    }   
}

app.services.service('Locations', Locations);
