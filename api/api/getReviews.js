import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Only GET requests are allowed"
    });
  }

  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("review_results")
    .select("*")
    .lte("next_review_date", today)
    .order("next_review_date", { ascending: true })
    .limit(10);

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  return res.status(200).json({
    reviews: data
  });
}
