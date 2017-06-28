package com.yunat.bi;

import com.yunat.bi.domain.MenuCatalog;
import com.yunat.bi.mapper.MenuCatalogMapper;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.embedded.EmbeddedServletContainerFactory;
import org.springframework.boot.context.embedded.jetty.JettyEmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@SpringBootApplication
@EnableAutoConfiguration
public class Application {

    @Value("${user.name}")
    private String name;

    @Autowired
    public MenuCatalogMapper menuCatalogMapper;

    @RequestMapping("/")
    public String index(){

        List<MenuCatalog> menuCatalogs = menuCatalogMapper.list();
        menuCatalogs.forEach(menuCatalog -> System.out.println(menuCatalog.getName()));

        return name + ",Welcome to use BI-Master!!";
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public EmbeddedServletContainerFactory servletContainer() {
        JettyEmbeddedServletContainerFactory factory = new JettyEmbeddedServletContainerFactory();
        factory.setPort(8080);
        factory.setSessionTimeout(300);
        return factory;
    }
}
