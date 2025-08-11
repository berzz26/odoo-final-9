import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;

if (!SUPABASE_ANON_KEY || !SUPABASE_URL) {
  throw new Error("Supabase keys not found in env");
}
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const uploadProfilePhoto = async (file: File) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    throw new Error("User not logged in.");
  }

  const fileExt = file.name.split(".").pop();
  const filePath = `${userData.user.id}/avatar.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
    });

  if (error) {
    console.error("Error uploading file:", error.message);
    return null;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);
  return publicUrlData?.publicUrl || null;
};
