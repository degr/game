package org.forweb.commandos;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.servlet.resource.AppCacheManifestTransformer;

@Configuration
@ComponentScan(basePackages = {
        AppInitializer.BASE_PACKAGE,
        AppInitializer.BASE_PACKAGE + ".controller",
        "org.forweb.database",
        "org.forweb.spring.support",
        AppInitializer.WORD_PACKAGE,
})
@EnableJpaRepositories({AppInitializer.BASE_PACKAGE + ".dao", AppInitializer.WORD_PACKAGE + ".dao"})
public class SpringConfiguration {
}
