function ArticalContentCtrl($scope, $http){

    $scope.getArticalContent = function(){
        var title = getURLParameter('title');
        $http({
            url: '/artical/content/?title=' + encodeURIComponent(title),
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-encoded; charset=UTF-8'}
        }).success( function( data, status ){
            $scope.content = data.articalHTML;
            angular.element('article').append($scope.content);
        } ).error( function( data, status ){
            $scope.content = '';
        });
    }
}