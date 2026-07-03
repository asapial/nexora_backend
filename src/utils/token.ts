import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { cookieUtils } from "./cookie";
import { CookieOptions, Response } from "express";
import { envVars } from "../config/env";

const isProd = envVars.NODE_ENV === "production";
export const ACCESS_TOKEN_EXPIRES_IN = "1d" as const;
export const REFRESH_TOKEN_EXPIRES_IN = "7d" as const;
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;
export const REFRESH_TOKEN_MAX_AGE_SECONDS = ACCESS_TOKEN_MAX_AGE_SECONDS * 7;

const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};

const createAccessToken = (payload: JwtPayload) => {

  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    } as SignOptions
  );
  return accessToken;
};



const createRefreshToken = (payload: JwtPayload) => {

  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN
    } as SignOptions
  );
  return refreshToken;
};

const setAccessTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, 'accessToken', token, {
    ...authCookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS * 1000,
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, 'refreshToken', token, {
    ...authCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS * 1000,
  });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, cookieUtils.betterAuthSessionCookieName, token, {
    ...authCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS * 1000,
  });
};

const clearAccessTokenCookie = (res: Response) => {
  cookieUtils.clearCookie(res, "accessToken", authCookieOptions);
};

const clearRefreshTokenCookie = (res: Response) => {
  cookieUtils.clearCookie(res, "refreshToken", authCookieOptions);
};

const clearBetterAuthSessionCookie = (res: Response) => {
  cookieUtils.clearCookie(res, cookieUtils.betterAuthSessionCookieName, authCookieOptions);
  cookieUtils.clearCookie(res, "better-auth.session_token", authCookieOptions);
  cookieUtils.clearCookie(res, "__Secure-better-auth.session_token", authCookieOptions);
};

const clearAuthCookies = (res: Response) => {
  clearAccessTokenCookie(res);
  clearRefreshTokenCookie(res);
  clearBetterAuthSessionCookie(res);
};

export const tokenUtils = {
  createAccessToken,
  createRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
  clearBetterAuthSessionCookie,
  clearAuthCookies
};
