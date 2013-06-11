function ContentCtrl($scope){
    //TODO data should query from server
    $scope.accountMetaData = [
        {type: 'Sina Weibo', image: {src: '/images/Sina_Weibo_Logo_RGB_C_E80.png'}, dispName: '新浪微博'},
        {type: 'Tecent Weibo', image: {src: '/images/Tecent_Weibo_Logo80.gif'}, dispName: '腾讯微博'}
    ];
}