import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../server";
//     👆 **type-only** import
// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3434",
      transformer: superjson,
    }),
  ],
});

// Inferred types
const users = await trpc.user.list.query();
console.log("Users:", users);

const createdUser = await trpc.user.create.mutate({
  name: "sachinraja",
  hobbies: new Map([
    ["cricket", 5],
    ["football", 4],
  ]),
});
console.log("Created user:", createdUser);

const user = await trpc.user.byId.query("1");
console.log("User 1:", user);
