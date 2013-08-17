function ArticalNewCtrl($scope, $http){
    $scope.artical = {title: '', articalHTML: '', articalMD: ''};

    $scope.updateArtical = function(){
        //check the user input
        titleLen = $scope.artical.title.length;
        articleLen = $scope.artical.articalMD.length;

        if ( titleLen === 0 || titleLen > 50 ){
            alert('请输入标题。');
            return;
        }
        if ( titleLen > 50 ){
            alert('标题太长啦（不超过50字）。');
            return;
        }
        if ( articleLen < 50 ){
            alert('内容太少啦（不少于50字）。');
            return;
        }


        //save the artical to server
        var sendData = {title: $scope.artical.title, artical: $scope.artical.articalMD};
        $http({
            url: '/artical/new/json',
            method: 'POST',
            data: sendData,
            //headers: {'Content-Type': 'application/x-www-form-encoded; charset=UTF-8'}
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).success( function( data, status ){
            if ( data.status === 0 ){
                //succeed redirect to home page
                window.location.href = '/';
            }else{
                alert(data.error);
            }
        } ).error( function( data, status ){
            alert('请求失败，请重试。');
        });
    };

    $scope.getArticalContent = function(){
        var title = getURLParameter('title');
        //if not edit but new artical, then no title param in html
        if ( ! title || title == null || 'null' == title || '' == title ){
            return;
        }

        $scope.artical.title = title;
        $http({
            url: '/artical/content/?title=' + encodeURIComponent(title),
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-encoded; charset=UTF-8'}
        }).success( function( data, status ){
            $scope.artical.articalHTML = data.articalHTML;
            $scope.artical.articalMD = data.articalMD;
        } ).error( function( data, status ){
            $scope.artical.articalHTML = '<p>server error ' + status + '</p>';
        });
    }

}