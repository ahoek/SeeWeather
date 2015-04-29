/**
 * Locations service
 */
services.service('Locations', function (
    localStorageService,
    $filter) {
    return {
        activeLocation: null,
        all: function () {
            return localStorageService.get('locations') || [];
        },
        get: function (locationId) {
            return $filter('filter')(this.all(), {id: locationId}, true);
        },
        save: function (locations) {
            localStorageService.set('locations', locations);
        },
        getActiveLocation: function () {
            var location;
            if (this.activeLocation) {
                location = this.activeLocation;
            } else {
                location = localStorageService.get('lastActiveLocation');
            }
            //if (!location) {
            //    location = {};
            //}
            return location;
        },
        setActiveLocation: function (location) {
            this.activeLocation = location;
            localStorageService.set('lastActiveLocation', this.activeLocation);
        }
    };
});

