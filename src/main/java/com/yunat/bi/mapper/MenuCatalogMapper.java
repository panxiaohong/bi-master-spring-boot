package com.yunat.bi.mapper;

import com.yunat.bi.domain.MenuCatalog;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface MenuCatalogMapper {

    @Select("SELECT * FROM t_bi_menu_catalog")
    List<MenuCatalog> list();

}
