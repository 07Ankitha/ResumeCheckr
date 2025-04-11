// import { withAuth } from 'next-auth/middleware';

// export default withAuth({
//   pages: {
//     signIn: '/auth/signin',
//   },
// });

// export const config = {
//   matcher: [
//     '/analyze-resume/:path*',
//     '/api/analyze-resume/:path*',
//   ],
// }; 

// middleware.ts

import { NextResponse } from 'next/server';

export function middleware() {
  // This middleware does nothing, just lets the request pass through
  return NextResponse.next();
}

export const config = {
  matcher: [], // No routes matched, so nothing gets processed
};
