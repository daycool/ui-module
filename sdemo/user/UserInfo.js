define('user/UserInfo', [
    'user/UserInfoCtrl',
    'user/UserInfoDirective',
    'user/UserInfoService',
    'text!user/UserInfo.html'
], function(
    ctrl,
    directive,
    service,
    html) {

    return function(app, elem, attrs, scope) {
        ctrl(app, elem, attrs, scope);
        directive(app, elem, attrs, scope);
        service(app, elem, attrs, scope);
        elem.append(html);
    }
});