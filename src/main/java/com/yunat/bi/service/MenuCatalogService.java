package com.yunat.bi.service;

import com.yunat.bi.domain.MenuCatalog;
import com.yunat.bi.mapper.MenuCatalogMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * created on 2017/6/29.
 *
 * @author liangliang
 */
@Service
public class MenuCatalogService {

    @Autowired
    private MenuCatalogMapper menuCatalogMapper;

    public List<MenuCatalog> list() {
        return menuCatalogMapper.list();
    }

}
