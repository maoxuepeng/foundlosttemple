function ArticalContentCtrl($scope, $http){
    $scope.artical = {title: '', articalHTML: '', articalMD: ''};
    $scope.getArticalContent = function(){
        var title = getURLParameter('title');
        $scope.artical.title = title;
        $http({
            url: '/artical/content/?title=' + encodeURIComponent(title),
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-encoded; charset=UTF-8'}
        }).success( function( data, status ){
            $scope.artical.articalHTML = data.articalHTML;
            angular.element('article').append($scope.artical.articalHTML);
        } ).error( function( data, status ){
            $scope.artical.articalHTML = '<p>server error ' + status + '</p>';
        });
    }
}