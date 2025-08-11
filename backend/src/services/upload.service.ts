import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use the service role key here

// Create a Supabase client instance with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export const uploadProfilePhoto = async (file: Express.Multer.File, userId: string) => {
  // Your upload logic remains the same, but the client now has elevated permissions.
  const fileExt = file.originalname.split('.').pop();
  const filePath = `avatars/${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('user-profiles')
    .upload(filePath, file.buffer, {
      upsert: true,
      contentType: file.mimetype,
    });

  if (error) {
    throw new Error('Failed to upload file to Supabase: ' + error.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from('user-profiles')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};