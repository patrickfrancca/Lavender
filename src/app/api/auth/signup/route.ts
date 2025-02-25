import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '../../../models/user';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request: Request) {
    const { name, email, password } = await request.json();

    console.log("Received data:", { name, email, password });

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    if (!name || !email || !password) {
        console.log("Validation error: All fields are required");
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
        console.log("Validation error: Invalid email format");
        return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 6) {
        console.log("Validation error: Password must be at least 6 characters long");
        return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Validation error: Email already registered, try another one");
            return NextResponse.json({ message: "Email already registered, try another one" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            name,
            password: hashedPassword,
        });
        await newUser.save();
        console.log("User created successfully");
        return NextResponse.json({ message: "User created" }, { status: 201 });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}