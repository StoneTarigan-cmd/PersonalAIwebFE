import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    // !!! PENTING: Di sinilah Anda akan terhubung ke database Anda
    // untuk menyimpan pengguna baru. Contoh dengan Prisma:
    // const user = await prisma.user.create({
    //   data: { name, email, phone, password: hashedPassword },
    // });

    // Untuk contoh ini, kita hanya akan mencetak data ke console server
    console.log('New user sign up attempt:', { name, email, phone });

    // Kembalikan respons sukses
    return NextResponse.json({ message: "User created successfully!" }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}