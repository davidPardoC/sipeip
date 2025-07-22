import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(
  "https://gwhlixlbyueccwugjoev.supabase.co",
  key
);
