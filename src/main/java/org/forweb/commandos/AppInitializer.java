package org.forweb.commandos;


import org.forweb.database.HibernateSupport;
import org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;
import org.tuckey.web.filters.urlrewrite.UrlRewriteFilter;

import javax.servlet.*;
import java.util.EnumSet;

public class AppInitializer extends AbstractSecurityWebApplicationInitializer {


    static final String BASE_PACKAGE = "org.forweb.commandos";
    static final String WORD_PACKAGE = "org.forweb.word";
    public static String ROOT;
    public static Boolean DEV = true;

    @Override
    public void afterSpringSecurityFilterChain(ServletContext servletContext) {
        super.afterSpringSecurityFilterChain(servletContext);

        if (DEV) {
            HibernateSupport.init("127.0.0.1:3306", "root", "", "commandos", new String[]{BASE_PACKAGE + ".entity", WORD_PACKAGE});
        } else {
            HibernateSupport.init("localhost", "root", "PG5ckEMZ", "commandos", new String[]{BASE_PACKAGE + ".entity", WORD_PACKAGE});
        }
        HibernateSupport.setDebug(DEV);

        AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
        rootContext.register(SpringConfiguration.class);
        ROOT = servletContext.getRealPath("").trim();
        addServlet(new DispatcherServlet(rootContext), "dispatcher", "/server/*", servletContext);
        servletContext.addListener(new ContextLoaderListener(rootContext));
        servletContext.addListener(new RequestContextListener());
        //addFilter("UrlRewriteFilter", new UrlRewriteFilter(), servletContext);
    }

    private <T extends Filter> void addFilter(String filterName, Filter filterP, ServletContext servletContext) {
        servletContext.addFilter(filterName, filterP);
        FilterRegistration f = servletContext.getFilterRegistration(filterName);
        f.addMappingForUrlPatterns(EnumSet.of(DispatcherType.FORWARD), true, "/*");
    }

    //
    private void addServlet(Servlet servlet, String servletName, String mapping, ServletContext container) {
        ServletRegistration.Dynamic dynamic = container.addServlet(servletName, servlet);
        dynamic.setLoadOnStartup(1);
        dynamic.addMapping(mapping);
    }

}