package com.college.dto;

public class JwtAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private RoleResponse user;

    public JwtAuthResponse(String accessToken, RoleResponse user) {
        this.accessToken = accessToken;
        this.user = user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public RoleResponse getUser() {
        return user;
    }

    public void setUser(RoleResponse user) {
        this.user = user;
    }
}
