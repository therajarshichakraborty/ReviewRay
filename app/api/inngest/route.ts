import { serve } from "inngest/next";
import { inngest } from "@/features/inngest/client";
import { processTask, greetFunc } from "./function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask, greetFunc],
});