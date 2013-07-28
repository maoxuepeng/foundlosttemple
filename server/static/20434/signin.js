angular.module('signinApp', ['ngCookies']);

function SigninCtrl($scope, $http, $cookies){
    $scope.auth = {
        teacherName: '', 
        femaleNum: '', 
        name: '',
        mountain: ''
    };
    $scope.signinError = '';

    $scope.autoSignin = function(){
        var sendData = {
            teacherName: typeof $cookies.authInfo_teacherName === 'undefined' ? '' : Base64.decode($cookies.authInfo_teacherName), 
            femaleNum: typeof $cookies.authInfo_femaleNum === 'undefined' ? '' : Base64.decode($cookies.authInfo_femaleNum), 
            name: typeof $cookies.authInfo_name === 'undefined' ? '' : Base64.decode($cookies.authInfo_name),
            mountain: typeof $cookies.authInfo_mountain === 'undefined' ? '' : Base64.decode($cookies.authInfo_mountain)
        };
        $scope.signin(sendData);
    };

    $scope.signinAction = function(){
        var sendData = {
            teacherName: $scope.auth.teacherName, 
            femaleNum: $scope.auth.femaleNum, 
            name: $scope.auth.name,
            mountain: $scope.auth.mountain
        };
        $scope.signin(sendData);
    };

    $scope.signin = function(sendData){
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
                    $scope.signinError = 'Signin failed, please try again.';
                }
                
            } ).
            error( function ( data, status ){
                $scope.signinError = 'Sorry i was wrong bcoz of code: ' + status;
            } );
    }
}