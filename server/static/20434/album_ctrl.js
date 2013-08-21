angular.module('albumApp', [])
.directive('colorboxDirective', function($timeout){
    return function(scope, element, attrs){
    };
})
.directive('mainDirective', function($timeout){
    return function(scope, element, attrs){
        if ( scope.$last ){
            $timeout( function(){
                var group = 'colorbox-' + scope.album.name;
                $('a[colorbox-data="' + group + '"]').colorbox({
                    rel: group,
                    height: '100%'
                });
            } );
        }
    };
} );

function AlbumsCtrl($scope, $http){
    $scope.albumList = [];

    $scope.newAlbumName = '';

    $scope.loadAlbums = function(){
        //get all albums
        $http({
            url: '/albums/meta',
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-encoded;charset=UTF-8'}
        }).success( function ( data, status ){
            //get files from each albums
            //server return data format is: {status: 0, error: '', albumNameList: []}
            //where albumNameList is an array of string

            if ( data.status != 0 ){
                alert(data.error);
            }else{
                //clear the existing albums
                $scope.albumList = [];
                //get photos inside each album
                var albumNames = data.albumNameList;
                for ( var i = 0; i < albumNames.length; i++ ){
                    $scope.loadPhotoOfAlbum( albumNames[i] );
                }
            }
        } ).error( function ( data, status ){
            //do nothing
        } );//end http
        
    };//end loadAlbums

    $scope.loadPhotoOfAlbum = function(albumName){
        $http({
            url: '/upload/?album=' + encodeURIComponent(albumName),
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-encoded;charset=UTF-8'}
        }).success( function ( data, status ){
            //the server return data format is same as the jQuery file upload
            //{files:[ {name: '', originalName: '', size: 0, delete_type: '', url: '', delete_url: ''} ]}
            var oneAlbum = {name: '', files: {}, coverImage: ''};
            oneAlbum.name = albumName;
            oneAlbum.files = data.files;
            if ( oneAlbum.files.length === 0 ){
                oneAlbum.coverImage = '/protected/weifusion.png';
            }else{
                oneAlbum.coverImage = data.files[0].url;
            }
            $scope.albumList.push(oneAlbum);
            
        } ).error( function ( data, status ){
            //do nothing
        } );//end http
    };

    $scope.newAlbum = function(){
        var sendData = {newAlbumName: $scope.newAlbumName};
         $http({
            url: '/albums/new', 
            data: sendData,
            method: 'POST',
            //Content-Type should be application/x-www-form-encoded
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            //headers: {'Content-Type': 'application/x-www-form-encoded;charset=UTF-8'}
            headers: {'Content-Type': 'application/json'}
        }).
            success( function ( data, status ){
                //data is an json object
                if ( data.status === 0 ){
                    window.location.href = '/albums';
                }else{
                    alert(data.error);
                }
                
            } ).
            error( function ( data, status ){
                alert('Sorry i was wrong bcoz of code: ' + status);
            } );//end http       
    };
}