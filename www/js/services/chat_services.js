



app.service('ChatService', function($http, DEALERSHIP_API, store) {

   var currentUser = store.get('localUser');
   console.log(currentUser);

  var _options = {
    headers: {
      //'Content-Type': 'application/json',
      //'Access-Control-Allow-Origin' : '*',
      'Authorization' : currentUser.auth_token
    }
  };

  function saveMessage(msg) {
    console.log(msg);
  //  if(msg.recipient)
    var data = {
       "message":{
       "body": msg.text
       },
       "recipient_id": msg.recipient_id,
       "conversation_id": msg.conversation_id 
     }

      return $http.post(DEALERSHIP_API.url + '/messages', data, _options).then(function(result){
        console.log(result);

        return{data:result}
        });
  }

      function getMessages() {
      // console.log(params);
       return $http.get(DEALERSHIP_API.url + "/conversations", _options).then(function(result) {
       console.log(result);

       return {data: result};

})
}

// $http({ method: 'GET',
//                       url: DEALERSHIP_API.url + "/conversations",
//                       headers: {'Authorization' : currentUserService.token}
//               }).success( function( data ){
//                       console.log("Data from conversations: ", JSON.stringify(data, null, 4));
//                       $scope.conversations = data.conversations;


      return {
        saveMessage: saveMessage,
        getMessages: getMessages
      }



})
