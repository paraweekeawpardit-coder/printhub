import { Request, Response } from "express";
import supabase from "../../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import multer from "multer";

// interface MulterRequest extends Request {
//   files?: {
//     [fieldname: string]: Express.Multer.File[];
//   };
// }

export const Regis = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { Fname, Lname, contact, password } = req.body;
    if (!Fname || !Lname || !contact || !password) {
      return res.status(400).json({ error: "Please enter all information" });
    }

    console.log("information you get :", req.body);

    const { data: haveUser, error: findError } = await supabase
      .from("customer")
      .select("id")
      .eq("contact", contact)
      .maybeSingle();

    if (findError) {
      console.log(findError);
      return res.status(500).json({ error: "Server Error" });
    }

    if (haveUser) {
      console.log(haveUser);
      return res.status(400).json({ message: "Account already exists. Please log in" });
    }

    const Passwd = await bcrypt.hash(password, 10);

    const { data: newCustomer, error: insertError } = await supabase
      .from("customer")
      .insert([
        {
          first_name: Fname,
          last_name: Lname,
          contact: contact,
          password: Passwd,
        },
      ])
      .select()
      .single();

    console.log("information you insert", newCustomer);

    if (insertError) {
      console.log(insertError);
      return res.status(500).json({ error: "Server Error" });
    }

    return res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const Login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { contact, password } = req.body;
    console.log("information you get in login :", req.body);

    if (!contact || !password) {
      return res.status(400).json({
        error: "Please enter contact and password",
      });
    }

    const { data: user, error: findError } = await supabase
      .from("customer")
      .select("*")
      .eq("contact", contact)
      .maybeSingle();

    if (findError) {
      console.log(findError);
      return res.status(500).json({
        error: "Server Error",
      });
    }

    if (!user) {
      console.log("User not registered");
      return res.status(400).json({
        error: "User not registered",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Wrong password",
      });
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const payload = {
      id: user.id,
      name: user.first_name,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });

    return res.status(200).json({
      message: "Login successful",
      token: token,
      id: user.id,
      name: user.first_name,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Server Error",
    });
  }
};