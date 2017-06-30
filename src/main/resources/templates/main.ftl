<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <title>预置报表</title>
    <link rel="stylesheet" href="${request.contextPath}/css/main.css?v=0.0.1" type="text/css">
</head>
<body>
<div class="sidebar">
    <ul class="sideNav">
    <#--循环展示一级菜单-->
    <#list menus as catalog>
        <li>
            <#--level 1-->
            <a href="#" class="sideNavNosec sbCurrent">${catalog.menuCatalog.name}<i class="sideNavArrow"></i></a>
            <ol style="display:none;">
                <#list catalog.children as item>
                    <li>
                        <#--level 2-->
                        <a href="<#if item.children?size == 0>${request.contextPath}${item.url}${item.id}<#else>#</#if>"
                           class="<#if item.children?size == 0>menu</#if>">
                            <i class="<#if item.children?size gt 0>iconadd</#if>"></i> ${item.name}
                        </a>
                        <dl style="display:none;">
                            <#--level 3-->
                            <#list item.children as it>
                                <dd class="menu"><a href="javascript:showMainPage('${request.contextPath}${it.url}${it.id}');">${it.name}</a>
                                </dd>
                            </#list>
                        </dl>
                    </li>
                </#list>
            </ol>
        </li>
    </#list>
    </ul>
</div>

<div class="spfx_main clearfix">
    <div class="spfx_maincontainer clearfix" style="height: 100%;">
        <iframe name="mainFrame" src="" style="width:100%; height:99%;border:none;"></iframe>
    </div>
</div>
</body>

<#--页面处理-->
<script src="${request.contextPath}/js/jquery-1.11.3.min.js?v=0.0.1"></script>
<script src="${request.contextPath}/js/main.js"></script>

<#--UAL验证模块-->
<#--<script type="text/javascript" src="${request.contextPath}/js/angular.min.js?v=1.1.4"></script>-->
<#--<script type="text/javascript" src="${request.contextPath}/js/interceptor-jq.js?v=1.1.4"></script>-->
<#--<script type="text/javascript" src="${request.contextPath}/js/x-token.js?v=1.1.4"></script>-->

</html>