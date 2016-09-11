package org.forweb.commandos;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.forweb.commandos.dto.CreateUserDto;
import org.forweb.commandos.entity.GameProfile;
import org.forweb.commandos.entity.User;
import org.forweb.commandos.service.GameProfileService;
import org.forweb.commandos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.session.HttpSessionEventPublisher;

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
    GameProfileService gameProfileService;

    @Autowired
    public void configureGlobalSecurity(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
    }

    private AuthenticationSuccessHandler successHandler() {
        return (httpServletRequest, httpServletResponse, authentication) -> {
            User user = (User) authentication.getAuthorities().iterator().next();
            CreateUserDto out = new CreateUserDto();
            out.setUserId(user.getId());
            out.setUserName(user.getUsername());
            GameProfile profile = gameProfileService.findArenaProfile(user.getId());
            out.setArenaUserName(profile.getUsername());
            ObjectMapper mapper = new ObjectMapper();
            httpServletResponse.getWriter().append(mapper.writeValueAsString(out));
            httpServletResponse.setStatus(200);
        };
    }

    private AuthenticationFailureHandler failureHandler() {
        return (httpServletRequest, httpServletResponse, e) -> {
            httpServletResponse.getWriter().append("FAIL");
            httpServletResponse.setStatus(401);
        };
    }

    private LogoutSuccessHandler successLogoutHandler() {
        return (httpServletRequest, httpServletResponse, e) -> {
            httpServletResponse.getWriter().append("true");
            httpServletResponse.setStatus(200);
        };
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .headers().frameOptions().disable()
                .headers().xssProtection().disable()
                .headers().httpStrictTransportSecurity().disable()
               // .addFilterBefore(usernamePasswordAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .httpBasic().disable()
                    .formLogin()
                    .loginProcessingUrl("/server/login")
                    .successHandler(successHandler())
                    .failureHandler(failureHandler())
                .and()
                    .sessionManagement()
                    .sessionFixation().migrateSession()
                    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)

                .and()
                    .logout()
                    .logoutUrl("/server/logout")
                    .deleteCookies("JSESSIONID")
                    .logoutSuccessHandler(successLogoutHandler())
                    .invalidateHttpSession(true)
                .and()

                .authorizeRequests().antMatchers("/protected/**").access("hasRole('ROLE_ADMIN')");
    }



    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }
}
