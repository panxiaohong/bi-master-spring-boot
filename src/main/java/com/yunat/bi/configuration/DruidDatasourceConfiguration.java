package com.yunat.bi.configuration;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.SQLException;

@Configuration
public class DruidDatasourceConfiguration {

    private static Logger logger = LoggerFactory.getLogger(DruidDatasourceConfiguration.class);
  
    @Bean
    public ServletRegistrationBean druidServlet(){
        return new ServletRegistrationBean(new StatViewServlet(), "/druid/*");
    }

    @Bean  
    public DataSource druidDataSource(
            @Value("${spring.datasource.driverClassName}") String driverClass,
            @Value("${spring.datasource.url}") String url,  
            @Value("${spring.datasource.username}") String username,  
            @Value("${spring.datasource.password}") String password){

        DruidDataSource ds = new DruidDataSource();
        ds.setDriverClassName(driverClass);  
        ds.setUrl(url);  
        ds.setUsername(username);  
        ds.setPassword(password);  
        try {  
            ds.setFilters("stat,wall");  
        } catch (SQLException e) {
            e.printStackTrace();  
            logger.error("druid err:{}", e);
        }

        logger.info("Init DataSource");

        return ds;  
    }

    @Bean   
    public FilterRegistrationBean filterRegistrationBean(){
        FilterRegistrationBean fb = new FilterRegistrationBean();  
        fb.setFilter(new WebStatFilter());
        fb.addUrlPatterns("/*");  
        fb.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");  
        return fb;  
    }  
}  