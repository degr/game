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
            HibernateSupport.init("localhost", "root", "PG5ckEMZ", "commandos", BASE_PACKAGE + ".entity");
        }
        HibernateSupport.setDebug(DEV);
        AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
        rootContext.register(SpringConfiguration.class);
        ROOT = container.getRealPath("").trim();
        addServlet(new DispatcherServlet(rootContext), "dispatcher", "/server/*", container);
        container.addListener(new ContextLoaderListener(rootContext));
        container.addListener(new RequestContextListener());
    }
//
    private void addServlet(Servlet servlet, String servletName, String mapping, ServletContext container) {
        ServletRegistration.Dynamic dynamic = container.addServlet(servletName, servlet);
        dynamic.setLoadOnStartup(1);
        dynamic.addMapping(mapping);
    }

}
/*
java.lang.reflect.InvocationTargetException
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at org.apache.tomcat.websocket.pojo.PojoEndpointBase.onError(PojoEndpointBase.java:134)
        at org.apache.tomcat.websocket.WsFrameBase.handleThrowableOnSend(WsFrameBase.java:561)
        at org.apache.tomcat.websocket.WsFrameBase.sendMessagewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwdadsText(WsFrameBase.java:397)
        at org.apache.tomcat.websocket.WsFrameBase.processDataText(WsFrameBase.java:494)
        at org.apache.tomcat.websocket.WsFrameBase.processData(WsFrameBase.java:289)
        at org.apache.tomcat.websocket.WsFrameBase.processInputBuffer(WsFrameBase.java:130)
        at org.apache.tomcat.websocket.server.WsFrameServer.onDataAvailable(WsFrameServer.java:60)
        at org.apache.tomcat.websocket.server.WsHttpUpgradeHandler$WsReadListener.onDataAvailable(WsHttpUpgradeHandler.java:183)
        at org.apache.coyote.http11.upgrade.AbstractServletInputStream.onDataAvailable(AbstractServletInputStream.java:198)
        at org.apache.coyote.http11.upgrade.AbstractProcessor.upgradeDispatch(AbstractProcessor.java:96)
        at org.apache.coyote.AbstractProtocol$AbstractConnectionHandler.process(AbstractProtocol.java:669)
        at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1500)
        at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.run(NioEndpoint.java:1456)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(Thread.java:745)
        Caused by: java.lang.NullPointerException
        at org.forweb.commandos.service.ProjectileService.calculateInstantImpacts(ProjectileService.java:219)
        at org.forweb.commandos.service.ProjectileService.onProjectileInstantiation(ProjectileService.java:458)
        at org.forweb.commandos.service.ProjectileService.fire(ProjectileService.java:428)
        at org.forweb.commandos.service.ProjectileService.handleFire(ProjectileService.java:341)
        at org.forweb.commandos.service.ProjectileService.doShot(ProjectileService.java:321)
        at org.forweb.commandos.service.SpringDelegationService.doShot(SpringDelegationService.java:202)
        at org.forweb.commandos.controller.PersonWebSocketEndpoint.onTextMessage(PersonWebSocketEndpoint.java:88)
        at sun.reflect.GeneratedMethodAccessor95.invoke(Unknown Source)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at org.apache.tomcat.websocket.pojo.PojoMessageHandlerWholeBase.onMessage(PojoMessageHandlerWholeBase.java:80)
        at org.apache.tomcat.websocket.WsFrameBase.sendMessageText(WsFrameBase.java:393)
        ... 14 more



        java.lang.reflect.InvocationTargetException
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at org.apache.tomcat.websocket.pojo.PojoEndpointBase.onError(PojoEndpointBase.java:134)
        at org.apache.tomcat.websocket.WsFrameBase.handleThrowableOnSend(WsFrameBase.java:561)
        at org.apache.tomcat.websocket.WsFrameBase.sendMessageText(WsFrameBase.java:397)
        at org.apache.tomcat.websocket.WsFrameBase.processDataText(WsFrameBase.java:494)
        at org.apache.tomcat.websocket.WsFrameBase.processData(WsFrameBase.java:289)
        at org.apache.tomcat.websocket.WsFrameBase.processInputBuffer(WsFrameBase.java:130)
        at org.apache.tomcat.websocket.server.WsFrameServer.onDataAvailable(WsFrameServer.java:60)
        at org.apache.tomcat.websocket.server.WsHttpUpgradeHandler$WsReadListener.onDataAvailable(WsHttpUpgradeHandler.java:183)
        at org.apache.coyote.http11.upgrade.AbstractServletInputStream.onDataAvailable(AbstractServletInputStream.java:198)
        at org.apache.coyote.http11.upgrade.AbstractProcessor.upgradeDispatch(AbstractProcessor.java:96)
        at org.apache.coyote.AbstractProtocol$AbstractConnectionHandler.process(AbstractProtocol.java:669)
        at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1500)
        at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.run(NioEndpoint.java:1456)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(Thread.java:745)
        Caused by: java.lang.NullPointerException
*/