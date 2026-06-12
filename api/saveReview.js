import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed"
    });
  }

  const {
    japanese_sentence,
    model_answer,
    user_answer,
    result,
    mistake_note,
    ease_level,
    next_review_date,
    review_count,
    topic
  } = req.body;

  const { data, error } = await supabase
    .from("review_results")
    .insert([
      {
        japanese_sentence,
        model_answer,
        user_answer,
        result,
        mistake_note,
        ease_level,
        next_review_date,
        review_count,
        topic
      }
    ])
    .select();

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  return res.status(200).json({
    message: "Review saved successfully",
    data
  });
}
