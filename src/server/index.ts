import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { db } from "./db.js";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create({
  transformer: superjson,
});

const router = t.router;
const publicProcedure = t.procedure;

const userSchema = z.object({
  name: z.string(),
  hobbies: z.map(z.string(), z.number().min(1).max(5)),
});

const appRouter = router({
  user: {
    list: publicProcedure.query(async () => {
      const users = await db.user.findMany();
      return users;
    }),
    byId: publicProcedure.input(z.string()).query(async (opts) => {
      const { input } = opts;
      const user = await db.user.findById(input);
      return user;
    }),
    create: publicProcedure.input(userSchema).mutation(async (opts) => {
      const { input } = opts;
      const user = await db.user.create(input);
      return user;
    }),
  },
});

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3434);
