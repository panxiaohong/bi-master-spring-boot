package com.yunat.bi.domain;

import com.google.common.collect.Lists;
import com.yunat.bi.mapper.MenuItemMapper;
import com.yunat.bi.spring.ApplictionContextHolder;
import com.yunat.bi.util.ObjectUtils;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class MenuCatalog {
    private int id;
    private String name;
    private int orderNum;
    private int status;

    public List<MenuItem> fetchChildren() {
        MenuItemMapper menuItemMapper = ApplictionContextHolder.getBean(MenuItemMapper.class);
        List<MenuItem> menuItems = menuItemMapper.listByCatalogId(this.id);
        return null == menuItems ? Lists.newArrayList() : menuItems;
    }
}
