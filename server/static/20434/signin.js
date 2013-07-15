function SigninCtrl($scope, $http){
    $scope.auth = {
        teacherName: '', 
        femaleNum: '', 
        name: '',
        mountain: ''
    };
    $scope.signinError = '';

    $scope.signin = function(){
        var sendData = {
            teacherName: $scope.auth.teacherName, 
            femaleNum: $scope.auth.femaleNum, 
            name: $scope.auth.name,
            mountain: $scope.auth.mountain
        };

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
                    window.location.href = '/';
                }else{
                    $scope.signinError = 'Sorry, we can not let you enter in.';
                }
                
            } ).
            error( function ( data, status ){
                $scope.signinError = 'Sorry i was wrong bcoz of code: ' + status;
            } );

        
    }
}