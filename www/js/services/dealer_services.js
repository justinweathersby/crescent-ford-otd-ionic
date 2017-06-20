app.service('currentDealerService', function(){
	this.id =
	this.name =
	this.phone =
	this.location =
	this.primary_color =
	this.new_cars_url =
	this.used_cars_url =
	this.service_url =
	this.specials_url =
	this.service_specials_url =
	this.parts_url =
	this.financing_url =
	this.service_email =
	this.sales_email =
	this.facebook_url =
	this.twitter_url =
	this.logo_url =
	this.background_image_url =
	this.iframeFriendly = null;
	this.sales_reps = [];
	this.service_reps = [];
});

app.service('currentDealerSvc', function(store){
	var dealership = {};

	function getDealership() {
		return dealership;
	}

	function setDealership(currentDealer) {
		store.set('localDealership', currentDealer);
		dealership = currentDealer;
	}

	return {
		getDealership: getDealership,
		setDealership: setDealership
	};
});

app.service('dealerService', function($http, $ionicLoading, currentUserService, currentDealerService, userSvc, currentDealerSvc, DEALERSHIP_API, store){
	this.resetCurrent = function (){
		currentDealerService.id =
		currentDealerService.name =
		currentDealerService.location =
		currentDealerService.primary_color =
		currentDealerService.new_cars_url =
		currentDealerService.used_cars_url =
		currentDealerService.specials_url =
		currentDealerService.service_url =
		currentDealerService.service_specials_url =
		currentDealerService.parts_url =
		currentDealerService.financing_url =
		currentDealerService.service_email =
		currentDealerService.sales_email =
		currentDealerService.facebook_url =
		currentDealerService.twitter_url =
		currentDealerService.logo_url =
		currentDealerService.background_image_url =
		currentDealerService.iframeFriendly = null;
	};

	this.getSalesReps = function(){
		var currentUser = store.get('localUser');
		var currentDealer = store.get('localDealership');

		return $http({
			method: 'GET',
			url: DEALERSHIP_API.url + "/dealerships/" + currentUser.dealership_id + "/sales_reps",
			headers: {
				'Authorization' : currentUser.auth_token
			}
		}).success( function(data){
			console.log("INFO::services::getSalesReps::data::" + JSON.stringify(data));
			currentDealer.sales_reps = [];
			var newData = angular.copy(data);
			currentDealer.sales_reps.push(newData);
		}).error( function(error){
			console.log("ERROR GET SALES REPS:: " + JSON.stringify(error));
		});
	};

	this.getServiceReps = function(){
		var currentUser = store.get('localUser');
		var currentDealer = store.get('localDealership');

		return $http({
			method: 'GET',
            url: DEALERSHIP_API.url + "/dealerships/" + currentUser.dealership_id + "/service_reps",
            headers: {
				'Authorization' : currentUser.auth_token
			}
        }).success( function(data){
			currentDealer.service_reps = [];
            var newData = angular.copy(data);
            currentDealer.service_reps.push(newData);

            console.log("1_) returned service reps: " + JSON.stringify(data));
            console.log("2_) currentDealerService.service_reps: " + JSON.stringify(currentDealer.service_reps));
        }).error( function(error){
			console.log("ERROR GET SERVICE REPS:: " + JSON.stringify(error));
		});
	};

	// this.getServiceRep = function(){
	// 	var currentUser = store.get('localUser');
	// 	var currentDealer = store.get('localDealership');
	//
	// 	return $http({
	// 		method: 'GET',
  //           url: DEALERSHIP_API.url + "/dealerships/" + currentUser.dealership_id + "/service_reps?id=6",
  //           headers: {
	// 			'Authorization' : currentUser.auth_token
	// 		}
  //       }).success( function(data){
	// 		currentDealer.service_reps = [];
	// 		var newData = angular.copy(data);
	// 		currentDealer.service_reps.push(newData);
	//
	// 		console.log("1_) returned service reps: " + JSON.stringify(data));
	// 		console.log("2_) currentDealerService.service_reps: " + JSON.stringify(currentDealer.service_reps));
  //       }).error( function(error){
	// 		console.log("ERROR GET SERVICE REPS:: " + JSON.stringify(error));
  //       });
	// };

	this.getDealership = function(){
		var dealership_id = store.get('selected_dealership_id');

		return $http({ method: 'GET',
			url: DEALERSHIP_API.url + "/dealerships/" + dealership_id
		});
	};

	this.getDealerships = function(){
		var currentUser = store.get('localUser');

		return $http({ method: 'GET',
			url: DEALERSHIP_API.url + "/dealerships/"
		});
	};

  this.resetCurrent = function(){
    currentUserService.id =
    currentUserService.token =
    currentUserService.name =
    currentUserService.email =
    currentUserService.dealership_id = null;
  };
});
