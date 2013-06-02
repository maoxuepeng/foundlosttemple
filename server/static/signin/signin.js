function UserCtrl($scope, $http){
    $scope.user = {email: '', password: '', remember: false};
    $scope.signinError = '';

    $scope.signin = function(){
        var sendData = {username: $scope.user.email, password: $scope.user.password, remember: $scope.user.remember};
        $http({
            url: '/auth', 
            data: $.param( sendData ),
            method: 'POST',
            //Content-Type should be application/x-www-form-encoded
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            headers: {'Content-Type': 'application/x-www-form-encoded'}
        }).
            success( function ( data, status ){
                //data is an json object
                if ( data.statusCode === 0 ){
                    window.location.href = '/dashboard';
                }else{
                    $scope.signinError = 'User name or password is wrong.';
                }
                
            } ).
            error( function ( data, status ){
                $scope.signinError = 'Sorry i was wrong bcoz of code: ' + status;
            } );

        
    }
}