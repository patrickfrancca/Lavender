import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '../../../models/user';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request: Request) {
    const { name, email, password, confirmPassword } = await request.json();

    console.log("Received data:", { name, email, password, confirmPassword });

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    if (!name || !email || !password || !confirmPassword) {
        console.log("Validation error: All fields are required");
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
        console.log("Validation error: Invalid email format");
        return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    if (confirmPassword !== password) {
        console.log("Validation error: Passwords do not match");
        return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    if (password.length < 6) {
        console.log("Validation error: Password must be at least 6 characters long");
        return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Validation error: User already exists");
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
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