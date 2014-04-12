
angular.module('starter.filters', []).filter('windspeed', function() {
	return function(mps, unit) {
		switch (unit) {
			case 'bft':
				return 1.12684 * Math.pow(mps, (2/3));
			case 'kph':
				return mps * 3.6;
			default:
				return mps;
		}
		
	};
});