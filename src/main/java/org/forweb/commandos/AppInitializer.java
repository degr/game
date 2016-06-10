package org.forweb.commandos;


import org.forweb.database.HibernateSupport;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.Servlet;
import javax.servlet.ServletContext;
import javax.servlet.ServletRegistration;

public class AppInitializer implements WebApplicationInitializer {


    static final String BASE_PACKAGE = "org.forweb.commandos";
    public static String ROOT;
    public static Boolean DEV = true;
    @Override
    public void onStartup(ServletContext container) {
        System.out.println("on startup");
        if(DEV) {
            HibernateSupport.init("127.0.0.1:3306", "root", "", "commandos", BASE_PACKAGE + ".entity");
        } else {
            HibernateSupport.init("mysql35801-env-0391540.mycloud.by", "root", "XPMikf51734", "commandos", BASE_PACKAGE + ".entity");
        }
        HibernateSupport.setDebug(DEV);
        AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
        rootContext.register(SpringConfiguration.class);
        ROOT = container.getRealPath("").trim();
        addServlet(new DispatcherServlet(rootContext), "dispatcher", "/server/*", container);
        container.addListener(new ContextLoaderListener(rootContext));
        container.addListener(new RequestContextListener());
    }

    private void addServlet(Servlet servlet, String servletName, String mapping, ServletContext container) {
        ServletRegistration.Dynamic dynamic = container.addServlet(servletName, servlet);
        dynamic.setLoadOnStartup(1);
        dynamic.addMapping(mapping);
    }

}
