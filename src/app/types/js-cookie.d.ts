// Type declaration shim for js-cookie
// This tells TypeScript to treat "js-cookie" as any type
declare module "js-cookie" {
  interface CookieAttributes {
    path?: string;
    domain?: string;
    expires?: number | Date;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  }

  interface CookiesStatic {
    get(name: string): string | undefined;
    getJSON(name: string): any;
    set(name: string, value: string | object, options?: CookieAttributes): void;
    remove(name: string, options?: CookieAttributes): void;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
}
