/**
 * Filters
 * @param {type} param1
 * @param {type} param2
 */
angular.module('SeeWeather.filters', [])
    .filter('windspeed', function () {
        return function (mps, unit) {
            switch (unit) {
                case 'bft':
                    return 1.12684 * Math.pow(mps, (2 / 3))
                case 'kph':
                    return mps * 3.6
                default:
                    return mps
            }
        }
    })
    .filter('temperature', function () {
        return function (kelvin, unit) {
            switch (unit) {
                case 'celsius':
                    return kelvin - 273.15
                case 'fahrenheit':
                    return (kelvin - 273.15) * 1.8 + 32
                default:
                    return kelvin
            }

        }
    })
    .filter('unit', function () {
        return function (unit) {
            switch (unit) {
                case 'bft':
                    return "Bft"
                case 'kph':
                    return "km/u"
                case 'mps':
                    return "m/s"
                case 'celsius':
                    return '°C'
                case 'kelvin':
                    return 'K'
                case 'fahrenheit':
                    return '°F'
            }
        }
    })    
