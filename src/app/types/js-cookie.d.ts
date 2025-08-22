declare module "js-cookie" {
  interface CookieAttributes {
    path?: string;
    expires?: number | Date;
    domain?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  }

  interface CookiesStatic {
    get(name: string): string | undefined;
    set(name: string, value: string, options?: CookieAttributes): void;
    remove(name: string, options?: CookieAttributes): void;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
}
