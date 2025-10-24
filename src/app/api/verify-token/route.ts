// src/app/api/verify-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json({ message: "Email and token are required." }, { status: 400 });
    }

    // Cari pengguna berdasarkan email
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ message: "Invalid user." }, { status: 400 });
    }

    // Periksa apakah token cocok dan belum kedaluwarsa
    if (user.verification_token !== token) {
      return NextResponse.json({ message: "Invalid verification token." }, { status: 400 });
    }

    if (new Date() > new Date(user.verification_token_expires_at)) {
      return NextResponse.json({ message: "Token has expired." }, { status: 400 });
    }

    // Jika semua valid, verifikasi pengguna dan hapus token
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        is_verified: true, 
        verification_token: null, 
        verification_token_expires_at: null 
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ message: "Account verified successfully! You can now log in." }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}