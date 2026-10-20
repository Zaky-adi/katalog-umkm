import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Proxy / Middleware (Next.js 16) untuk memproteksi rute admin.
 * Semua rute /admin kecuali /admin/login wajib terautentikasi via Supabase Auth.
 * Pengunjung yang belum login akan dialihkan ke /admin/login.
 */
export async function proxy(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  const pathname = request.nextUrl.pathname;
  const normalizedPath =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  const isProtectedAdminRoute =
    normalizedPath.startsWith("/admin") && normalizedPath !== "/admin/login";

  if (!supabaseUrl || !supabasePublishableKey) {
    if (isProtectedAdminRoute) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedAdminRoute && !user) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export default proxy;

export const config = {
  matcher: ["/admin/:path*"],
};

