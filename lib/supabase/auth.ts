import { supabase } from "@/lib/supabase/client";

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Erro ao buscar usuário:", error.message);
    return null;
  }

  return user;
}