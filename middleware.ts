// middleware.ts
export const config = {
  matcher: ["/"],
};

export default function middleware(req: Request) {
  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const [scheme, encoded] = basicAuth.split(" ");
    if (scheme === "Basic" && encoded) {
      const [user, password] = atob(encoded).split(":");

      if (
        user === process.env.BASIC_AUTH_USER &&
        password === process.env.BASIC_AUTH_PASS
      ) {
        // 認証OK → そのまま通す
        return new Response(null, { status: 200 });
      }
    }
  }

  // 認証NG → ダイアログを出す
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}