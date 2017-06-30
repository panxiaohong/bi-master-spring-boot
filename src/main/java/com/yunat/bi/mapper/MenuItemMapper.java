package com.yunat.bi.mapper;

import com.yunat.bi.domain.MenuItem;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface MenuItemMapper {

    @Select("SELECT * FROM t_bi_menu_item where catalog_id = #{catalogId}")
    List<MenuItem> listByCatalogId(@Param("catalogId") int catalogId);

    @Select("SELECT * FROM t_bi_menu_item where parent_id = #{parentId}")
    List<MenuItem> listByParent(@Param("parentId") int parentId);

}
