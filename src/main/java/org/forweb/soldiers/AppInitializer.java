package org.forweb.soldiers;


import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;

import javax.servlet.ServletContext;

public class AppInitializer implements WebApplicationInitializer {


    public static final String BASE_PACKAGE = "org.forweb.soldiers";

    @Override
    public void onStartup(ServletContext container) {
        System.out.println("on startup");

        AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
        rootContext.register(SpringConfiguration.class);

        container.addListener(new ContextLoaderListener(rootContext));
    }

}
