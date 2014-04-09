angular.module('starter.controllers', [])

	.controller('FriendsCtrl', function($scope, Friends) {

		$scope.friends = Friends.all();
	})

	.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
		$scope.friend = Friends.get($stateParams.friendId);
	//alert($scope.friend.id);
		console.log($scope.friend, $scope.friend.weather);
	})
