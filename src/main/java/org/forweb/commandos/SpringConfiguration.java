package org.forweb.commandos;

import org.forweb.commandos.database.Db;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.annotation.PostConstruct;

@Configuration
@ComponentScan(basePackages = {
        AppInitializer.BASE_PACKAGE,
        AppInitializer.BASE_PACKAGE + ".controller"
})
@EnableWebMvc
public class SpringConfiguration {

    @PostConstruct
    public void postConstruct() {
        /*Db.init(
                "mysql35608-env-2464409.mycloud.by",
                "root",
                "QASsyb01289",
                "commandos"
        );*/
        Db.init("127.0.0.1:3306", "root", "", "commandos");
        (new Thread(){
            public void run() {
                while(true) {
                    try {
                        sleep(1000 * 60 * 60);
                        new Db().query("select 1;");
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();
    }
}
