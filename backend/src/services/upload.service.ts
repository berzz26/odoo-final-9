// The service handles the core logic for interacting with Supabase Storage.
import { createClient } from "@supabase/supabase-js";

// if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
//   throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be defined in environment variables');
// }

const supabaseUrl = "https://ydidkzndnksvghtdzmql.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkaWRrem5kbmtzdmdodGR6bXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4ODc3NTYsImV4cCI6MjA3MDQ2Mzc1Nn0.af7jcn-MYrOD--BzUOLht0-lkYUVpBJJNqFS6blQIVM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadProfilePhoto = async (file: any, userId: string) => {
  const fileExt = file.originalname.split(".").pop();
  const filePath = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file.buffer, {
      upsert: true,
      contentType: file.mimetype,
    });
  console.log(data);

  if (error) {
    throw new Error("Failed to upload file to Supabase: " + error.message);
  }

  // Get the public URL to return
  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
