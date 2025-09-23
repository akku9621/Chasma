import { NextResponse } from "next/server";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Backend needs username, password (not email)
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: body.email, // map email -> username
        password: body.password,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const data = await res.json();

    // ✅ Set cookie for middleware
    const response = NextResponse.json({ success: true, token: data.token });
    response.cookies.set("isAdmin", "true", {
      path: "/",
      httpOnly: false, // middleware can read, client also can
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
