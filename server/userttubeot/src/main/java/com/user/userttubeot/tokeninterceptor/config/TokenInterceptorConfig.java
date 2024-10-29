package com.user.userttubeot.tokeninterceptor.config;

import com.user.userttubeot.tokeninterceptor.interceptor.TokenInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class TokenInterceptorConfig implements WebMvcConfigurer {

    @Autowired
    private TokenInterceptor tokenInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // '/user/auth/**'경로만
        registry.addInterceptor(tokenInterceptor)
            .addPathPatterns("/user/auth**");
    }
}
