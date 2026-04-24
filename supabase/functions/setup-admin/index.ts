import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Lista de credenciais oficiais do painel administrativo.
// Todas terão papel "admin" garantido e senha redefinida em cada execução.
const ADMIN_CREDENTIALS: { email: string; password: string }[] = [
  { email: "contato@gaivotahotelpara.com.br", password: "gaivota2015*" },
  { email: "gaivotahotelpara@gmail.com", password: "gaivota2015*" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const results: Array<Record<string, unknown>> = [];

    for (const cred of ADMIN_CREDENTIALS) {
      const existing = existingUsers?.users?.find(
        (u) => u.email?.toLowerCase() === cred.email.toLowerCase()
      );

      let userId: string;

      if (existing) {
        userId = existing.id;
        // Garante senha correta + email confirmado
        const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { password: cred.password, email_confirm: true }
        );
        if (updateErr) throw updateErr;
      } else {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: cred.email,
          password: cred.password,
          email_confirm: true,
        });
        if (error) throw error;
        userId = data.user.id;
      }

      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .upsert(
          { user_id: userId, role: "admin" },
          { onConflict: "user_id,role" }
        );
      if (roleError) throw roleError;

      results.push({ email: cred.email, userId, status: existing ? "updated" : "created" });
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
