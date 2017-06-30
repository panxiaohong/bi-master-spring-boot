$(function () {
    /**
     * open url
     * */
    function showMainPage(url) {
        //默认打开其它页面
        if (url.indexOf("/app/") !== -1) {
            window.frames["mainFrame"].location = url;
            return;
        }

        $.get(url, function (pageUrl) {
            window.frames["mainFrame"].location = pageUrl;
        });
    }

    /**
     * default open one page
     * */
    showMainPage("/rest/customer2?m=rfm");

    /**
     * show sub menu
     */

    $("ol:has(li)").prev().bind('click', function () {
        $(this).next("ol").toggle();
        return false;
    });

    $(".menu").mouseover(function () {
        $(".menu").parent().css({"background-color":"#FFFFFF","color":"#000000)"})
        $(this).parent().css({"background-color": "#21f2e8","color":"#636363"});
    });

});