(function () {
    window.ualUrlPrefix = "http://ual.fenxibao.com/bi";

    var $ccmsAuth = window.ccmsSdk && ccmsSdk.$ccmsAuth;
    var requestCredential = $ccmsAuth.getRequestCredential();
    $ccmsAuth.setRequestCredential(requestCredential);
    $ccmsAuth.setRefreshTokenUrl(ualUrlPrefix + "/passport/v10/credentials/refresh");
    $ccmsAuth.setAuthFailedBehavior(function () {
        window.top.postMessage('authReject', '*');
    });
    $.ajaxSetup(ccmsSdk.tokenRefreshInterceptor);
})();

