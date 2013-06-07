###User managment related interface
####user sign in
1. URL  
/auth
2. method  
Post
3. request data  
{username: $scope.user.email, password: $scope.user.password, remember: $scope.user.remember}
4. response data  
{statusCode: 0, err: ''}