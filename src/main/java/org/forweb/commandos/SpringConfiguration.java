package org.forweb.commandos;

import org.forweb.commandos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@ComponentScan(basePackages = {
        AppInitializer.BASE_PACKAGE,
        AppInitializer.BASE_PACKAGE + ".controller",
        "org.forweb.database",
        "org.forweb.spring.support",
        AppInitializer.WORD_PACKAGE,
})
@EnableWebSecurity
@EnableJpaRepositories({AppInitializer.BASE_PACKAGE + ".dao", AppInitializer.WORD_PACKAGE + ".dao"})
public class SpringConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    UserService userService;

    @Autowired
    public void configureGlobalSecurity(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .headers().frameOptions().disable()
                .headers().xssProtection().disable()
                .headers().httpStrictTransportSecurity().disable()

                .authorizeRequests().antMatchers("/protected/**").access("hasRole('ROLE_ADMIN')");
    }
}
