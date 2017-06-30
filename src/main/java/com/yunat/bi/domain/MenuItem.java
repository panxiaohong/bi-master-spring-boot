package com.yunat.bi.domain;

import com.yunat.bi.mapper.MenuItemMapper;
import com.yunat.bi.spring.ApplictionContextHolder;
import com.yunat.bi.util.ObjectUtils;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class MenuItem {

    private int id;
    private String name;
    private int resourceId;
    private String resourceType;
    private String url;
    private int parentId;
    private int catalogId;
    private int orderNum;
    private int status;

    private List<MenuItem> children;

    public void fetchChildren() {
        MenuItemMapper menuItemMapper = ApplictionContextHolder.getBean(MenuItemMapper.class);
        this.children = menuItemMapper.listByParent(this.parentId);

        if(ObjectUtils.isNotNullOrEmpty(children)) {
            children.forEach(item -> fetchChildren());
        }
    }
}
