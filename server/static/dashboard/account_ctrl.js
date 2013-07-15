function AccountCtrl($scope){
    //TODO accounts should be query from server
    $scope.accounts = [
        {name: '@sinaweibo', image: {src: '/images/Sina_Weibo_Logo_RGB_C_E80.png', width: '80px', heigth: '80px'}, type: 'Sina Weibo'}, 
        {name: '@tecentweibo', image: {src: '/images/Tecent_Weibo_Logo80.gif', width: '80px', heigth: '80px'}, type: 'Tecent Weibo'}
    ];
    $scope.newAccount = {email: '', password: ''};

    $scope.user = {name: '', eamil: ''};

    $scope.sourceMetaData = [
        {type: 'Sina Weibo', image: {src: '/images/Sina_Weibo_Logo_RGB_C_E80.png'}, dispName: '新浪微博'},
        {type: 'Tecent Weibo', image: {src: '/images/Tecent_Weibo_Logo80.gif'}, dispName: '腾讯微博'}
    ];

}