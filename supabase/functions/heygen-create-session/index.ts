import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const HEYGEN_API_KEY = Deno.env.get("HEYGEN_API_KEY")!;
const HEYGEN_AVATAR_ID = Deno.env.get("HEYGEN_AVATAR_ID")!;
const HEYGEN_VOICE_ID = Deno.env.get("HEYGEN_VOICE_ID")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { driveId, studentId } = await req.json();
    
    if (!driveId || !studentId) {
      return new Response(
        JSON.stringify({ error: "driveId and studentId are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch drive details with company
    const { data: drive, error: driveError } = await supabase
      .from("placement_drives")
      .select(`
        *,
        company:companies(*),
        tpo:tpos(*, profiles(full_name))
      `)
      .eq("id", driveId)
      .single();

    if (driveError || !drive) {
      return new Response(
        JSON.stringify({ error: "Drive not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch student details
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select(`
        *,
        profiles(full_name, avatar_url)
      `)
      .eq("id", studentId)
      .single();

    if (studentError || !student) {
      return new Response(
        JSON.stringify({ error: "Student not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch student's latest resume for context
    const { data: resume } = await supabase
      .from("resumes")
      .select("parsed_data")
      .eq("student_id", studentId)
      .order("version", { ascending: false })
      .limit(1)
      .single();

    // Create HeyGen streaming session
    const heygenResponse = await fetch("https://api.heygen.com/v1/streaming.create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HEYGEN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar_id: HEYGEN_AVATAR_ID,
        voice_id: HEYGEN_VOICE_ID,
        quality: "high",
        version: "v2",
      }),
    });

    const heygenData = await heygenResponse.json();

    if (!heygenResponse.ok) {
      console.error("HeyGen API error:", heygenData);
      return new Response(
        JSON.stringify({ error: "Failed to create HeyGen session", details: heygenData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create interview record
    const { data: interview, error: interviewError } = await supabase
      .from("interviews")
      .insert({
        student_id: studentId,
        drive_id: driveId,
        heygen_session_id: heygenData.session_id,
        status: "pending",
      })
      .select()
      .single();

    if (interviewError) {
      console.error("Failed to create interview record:", interviewError);
      // Don't fail the request, just log
    }

    // Return session info to frontend
    return new Response(
      JSON.stringify({
        sessionId: heygenData.session_id,
        token: heygenData.token,
        url: heygenData.url,
        interviewId: interview?.id,
        expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
        driveContext: {
          company: drive.company?.name,
          role: drive.role,
          requiredSkills: drive.required_skills,
        },
        studentContext: {
          name: student.profiles?.full_name,
          resumeSummary: resume?.parsed_data ? generateResumeSummary(resume.parsed_data) : "",
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateResumeSummary(parsedData: any): string {
  const parts = [];
  if (parsedData.education?.[0]) {
    const edu = parsedData.education[0];
    parts.push(`${edu.degree} from ${edu.institution}`);
  }
  if (parsedData.skills?.length) {
    parts.push(`Skills: ${parsedData.skills.slice(0, 8).join(", ")}`);
  }
  if (parsedData.experience?.[0]) {
    const exp = parsedData.experience[0];
    parts.push(`${exp.role} at ${exp.company}`);
  } else if (parsedData.internships?.[0]) {
    const exp = parsedData.internships[0];
    parts.push(`${exp.role} at ${exp.company}`);
  }
  if (parsedData.projects?.[0]) {
    parts.push(`Key Project: ${parsedData.projects[0].name}`);
  }
  return parts.join(". ");
}