// controllers/auth.controller.ts
import type { Request, Response } from "express";
import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";

const jwtSecret = process.env.JWT_SECRET!;

// ---------------------- SIGNUP ----------------------
export const signup = async (req: Request, res: Response) => {
    const { name, email, password, country, city, phone, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                country,
                city,
                phone,
                role: "USER"
            }
        });

        const token = jwt.sign(
            { userId: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
            jwtSecret,
            { expiresIn: "7d" }
        );


        res.status(201).json({
            message: "Signup successful",

            user: { id: user.id, name: user.name, email: user.email, token }
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ---------------------- LOGIN ----------------------
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
            jwtSecret,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
    const id = req.user?.userId;
    if (!id) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                country: true,
                city: true,
                avatarUrl: true,
                role: true

                // Add any other fields you want to include
            }
        });
        res.status(200).json(user);

    } catch (error) {
        console.error("get error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};