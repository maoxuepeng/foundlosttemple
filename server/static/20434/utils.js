function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
}

function stringEndWith(src, suffix){
    return src.indexOf(suffix, src.length - suffix.length) !== -1;
}

function createDropdownMenu(menuAry){
    var html = '';
    html = html + "<li class=\"dropdown\">";
    html = html + "<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><b class=\"caret\"></b></a>";
    html = html + "<ul class=\"dropdown-menu\">";

    for ( var i = 0; i < menuAry.length; i++ ){
        html = html + "<li><a href=\"#\">" + menuAry[i] + "</a></li>";
    }
    

    html = html + "</ul>";
    html = html + "</li>";

    return html;

}