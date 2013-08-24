function AlbumsUploadCtrl($scope, $http){
    $scope.albumName = '';
    $scope.getAlbumName = function(){
        $scope.albumName = encodeURIComponent( getURLParameter('album') );
    }
}