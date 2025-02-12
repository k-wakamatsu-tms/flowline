import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const basicAuth = req.headers.get("authorization");

  // Production環境のみ適用
  if (process.env.NODE_ENV === "production") {
    // Basic認証が設定されている場合
    if (basicAuth) {
      const auth = basicAuth.split(" ")[1];
      const [username, password] = Buffer.from(auth as string, "base64")
        .toString()
        .split(":");

      // 認証情報が正しい場合
      if (
        username === process.env.BASIC_AUTH_USERNAME &&
        password === process.env.BASIC_AUTH_PASSWORD
      ) {
        return NextResponse.next();
      }

      // 認証情報が正しくない場合
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
          headers: {
            "WWW-Authenticate": 'Basic realm="Secure Area"',
          },
        },
      );
    }
  }
}
