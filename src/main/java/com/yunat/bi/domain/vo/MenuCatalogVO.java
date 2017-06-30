package com.yunat.bi.domain.vo;

import com.yunat.bi.domain.MenuCatalog;
import com.yunat.bi.domain.MenuItem;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * created on 2017/6/29.
 *
 * @author liangliang
 */
@Getter
@Setter
public class MenuCatalogVO {

    /** 菜单 */
    private MenuCatalog menuCatalog;
    /** 子菜单 */
    private List<MenuItem> children;

    public MenuCatalogVO(MenuCatalog menuCatalog, List<MenuItem> children) {
        this.menuCatalog = menuCatalog;
        this.children = children;
    }
}
