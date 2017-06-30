package com.yunat.bi.controller;

import com.yunat.bi.domain.MenuCatalog;
import com.yunat.bi.domain.MenuItem;
import com.yunat.bi.domain.vo.MenuCatalogVO;
import com.yunat.bi.service.MenuCatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.stream.Collectors;

/**
 * created on 2017/6/29.
 *
 * @author liangliang
 */
@RestController
@RequestMapping("/oauth2")
public class MenuController {

    @Autowired
    private MenuCatalogService menuCatalogService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView list() {
        ModelAndView main = new ModelAndView("main");

        List<MenuCatalog> list = menuCatalogService.list();
        List<MenuCatalogVO> menuCatalogVOS = list.stream().map(menuCatalog -> {
            List<MenuItem> children = menuCatalog.fetchChildren();
            children.forEach(MenuItem::fetchChildren);
            return new MenuCatalogVO(menuCatalog, children);
        }).collect(Collectors.toList());

        main.addObject("menus", menuCatalogVOS);

        return main;
    }

}
