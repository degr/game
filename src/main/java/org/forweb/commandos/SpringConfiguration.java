package org.forweb.commandos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.annotation.PostConstruct;

@Configuration
@ComponentScan(basePackages = {
        AppInitializer.BASE_PACKAGE,
        AppInitializer.BASE_PACKAGE + ".controller",
        "org.forweb.database"
})
@EnableJpaRepositories(AppInitializer.BASE_PACKAGE + ".dao")
@EnableWebMvc
public class SpringConfiguration {

    @Bean(name="multipartResolver")
    public MultipartResolver multipartResolver() {
        CommonsMultipartResolver out = new CommonsMultipartResolver();
        out.setMaxUploadSize(10000000);
        return out;
    }
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.configure(MapperFeature.DEFAULT_VIEW_INCLUSION, true);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        return mapper;
    }
}
