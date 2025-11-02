import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const authServer = async () => {
  "use cache: private";
  return await auth.api.getSession({ headers: await headers() });
};
