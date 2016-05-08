package org.forweb.soldiers;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@ComponentScan(basePackages = {
        AppInitializer.BASE_PACKAGE,
        AppInitializer.BASE_PACKAGE + ".controller"
})
@EnableWebMvc
public class SpringConfiguration {
    
}
