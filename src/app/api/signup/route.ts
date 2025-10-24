// src/app/api/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import bcrypt from 'bcryptjs';
import { Resend } from "resend";
import { readFileSync } from "fs";
import { join } from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateVerificationToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    console.log("Step 1: Creating user in Supabase...");

    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        name, 
        email, 
        phone: phone || null, 
        password: hashedPassword,
        verification_token: verificationToken,
        verification_token_expires_at: expiresAt.toISOString(),
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: "User already exists" }, { status: 400 });
      }
      throw error;
    }

    console.log("Step 2: User created. Preparing to send email...");

    try {
      const emailTemplatePath = join(process.cwd(), 'src', 'emails', 'verification-email.html');
      let emailTemplate = readFileSync(emailTemplatePath, 'utf8');
      emailTemplate = emailTemplate.replace('{{verificationCode}}', verificationToken);

      console.log("Step 3: Sending email via Resend...");
      console.log("API Key exists:", !!process.env.RESEND_API_KEY); // Akan mencetak true atau false

      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev', // Pastikan ini sudah verified
        to: [email],
        subject: 'Verify Your PersonalAI Organizer Account',
        html: emailTemplate,
      });

      if (error) {
        console.error("Resend API Error:", error);
        throw new Error(error.message);
      }

      console.log(`Step 4: SUCCESS! Verification email sent to ${email}`);

    } catch (emailError: any) {
      console.error("Failed to send verification email:", emailError);
      return NextResponse.json({ message: "Account created, but we couldn't send the verification email. Please check the server console.", error: emailError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Account created successfully! Please check your email for the verification token.", 
      user: { id: data.id, email: data.email }
    }, { status: 201 });

  } catch (error: any) {
    console.error("General Signup Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}