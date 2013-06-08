function AccountCtrl($scope){
    //TODO accounts should be query from server
    $scope.accounts = [
        {name: '@sinaweibo', image: {src: '/images/Sina_Weibo_Logo_RGB_C_E.png', width: '80px', heigth: '80px'}, type: 'Sina Weibo'}, 
        {name: '@tecentweibo', image: {src: '/images/Tecent_Weibo_Logo.gif', width: '80px', heigth: '80px'}, type: 'Tecent Weibo'}
    ];
    $scope.newAccount = {email: '', password: ''};
    $scope.accountMetaData = [
        {type: 'Sina Weibo', image: {src: '/images/sina_weiboicon1616.png'}, dispName: '新浪微博'},
        {type: 'Tecent Weibo', image: {src: '/images/tecent_weiboicon1616.png'}, dispName: '腾讯微博'}
    ];
}