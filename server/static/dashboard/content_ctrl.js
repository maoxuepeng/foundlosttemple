function ContentCtrl($scope){
    //TODO data should query from server
    $scope.sourceMetaData = [
        {type: 'Sina Weibo', image: {src: '/images/Sina_Weibo_Logo_RGB_C_E80.png'}, dispName: '新浪微博'},
        {type: 'Tecent Weibo', image: {src: '/images/Tecent_Weibo_Logo80.gif'}, dispName: '腾讯微博'}
    ];

    $scope.contents = [
        {
            id: 1,
            isRead: false, creationDateTime: '2013-6-15 07:10:45', source: 'Sina Weibo',
            content: 
            '云何得长寿　　金刚不坏身<br>复以何因缘　　得大坚固力<br>云何以此经　　究竟到彼岸<br>愿佛开微密　　广为众生说'
        },
        {
            id: 2,
            isRead: false, creationDateTime: '2013-6-14 05:20:01', source: 'Tecent Weibo',
            content: 'i am feeling happy too...'
        }
    ];

    $scope.getSourceNameByType = function(sourceType){
        var i, tmp;
        for( i = 0; i < $scope.sourceMetaData.length; i++ ){
            tmp = $scope.sourceMetaData[i];
            if ( sourceType == tmp.type ){
                return tmp.dispName;
            }
        }
        return sourceType;
    };

    $scope.getContentById = function(){
        var id = getURLParameter('id');
        return $scope.contents[id - 1];
    };
}