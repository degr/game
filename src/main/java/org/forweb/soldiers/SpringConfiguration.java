package org.forweb.soldiers;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = {
        AppInitializer.BASE_PACKAGE
})
public class SpringConfiguration {
    
}
