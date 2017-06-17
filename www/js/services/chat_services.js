
app.service('ChatService', function($http, DEALERSHIP_API, store) {

	function saveNewMessage(msg) {
		var currentUser = store.get('localUser');
		console.log(currentUser);

		var _options = {
			headers: {
				'Authorization' : currentUser.auth_token
			}
		};
		console.log(msg);
		//  if(msg.recipient)
		var data = {
			"message":{
				"body": msg.text
			},
			"recipient_id": msg.recipient_id
			// "conversation_id": msg.conversation_id
		}

		return $http.post(DEALERSHIP_API.url + '/messages', data, _options).then(function(result){
			console.log(result);
			return{data:result}
        });
	}

	function saveMessage(msg) {
		var currentUser = store.get('localUser');
		console.log(currentUser);

		var _options = {
			headers: {
				'Authorization' : currentUser.auth_token
			}
		};
		console.log(msg);
		//  if(msg.recipient)
		var data = {
			"message":{
				"body": msg.text
			},
			"recipient_id": msg.recipient_id,
			"conversation_id": msg.conversation_id
		}
		console.log(data, "this one");

		return $http.post(DEALERSHIP_API.url + '/messages', data, _options).then(function(result){
			console.log(result);
			return{data:result}
        });
	}

    function getMessages() {
        var currentUser = store.get('localUser');
        console.log(currentUser);

		var _options = {
			headers: {
				'Authorization' : currentUser.auth_token
			}
		};
		// console.log(params);
		return $http.get(DEALERSHIP_API.url + "/conversations", _options).then(function(result) {
			console.log(result);
			return {data: result};
		})
	}

	function getAllMessages(x) {
		var currentUser = store.get('localUser');
        console.log(currentUser);

		var _options = {
			headers: {
				'Authorization' : currentUser.auth_token
			}
		};
        console.log(x);

        var data = {
           "conversation_id": x
        }
		// console.log(params);
		return $http.get(DEALERSHIP_API.url + "/messages?conversation_id=" + x , _options).then(function(result) {
			console.log(result);
			return {data: result};
		})
	}

    return {
        saveMessage: saveMessage,
        saveNewMessage: saveNewMessage,
        getMessages: getMessages,
        getAllMessages: getAllMessages
    }
})
