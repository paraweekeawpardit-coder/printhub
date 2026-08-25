"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";


type RegisFormProps = {
  setRegis: React.Dispatch<React.SetStateAction<boolean>>;
};


export default function LoginFormCustomer({ setRegis }: RegisFormProps) {

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const [logindata, setData] = useState({
    contact: "",
    password: ""
  });


  async function handleSubmit() {

    try {

      const res = await axios.post(
        "http://localhost:5000/auth/login",
        logindata
      );


      if (res.data.token && res.data.id && res.data.name) {

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("username", res.data.name);

        setMessage(res.data.message || "Login success");

        console.log("login success");

        router.push("/customer");

      } else {

        console.log("cannot login");

        setMessage(
          res.data.error || "Username หรือ Password ไม่ถูกต้อง"
        );

      }


    } catch (err:any) {

      console.log(err);

      setMessage(
        err.response?.data?.error || "เกิดข้อผิดพลาด"
      );

    }

  }



  return (
    <section className="w-full bg-white px-8 py-10">

      <div className="w-full max-w-sm">

        <h2 className="mb-7 text-center text-2xl font-semibold tracking-tight text-navy">
          เข้าสู่ระบบ
        </h2>


        <form
          className="space-y-4"
          onSubmit={(e)=>{
            e.preventDefault();
            handleSubmit();
          }}
        >


          <input
            type="tel"
            placeholder="Tel"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"

            onChange={(e)=>{

              setData({
                ...logindata,
                contact:e.target.value
              })

            }}
          />



          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"

              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"

              onChange={(e)=>{

                setData({
                  ...logindata,
                  password:e.target.value
                })

              }}

            />


            <button
              type="button"

              onClick={() =>
                setShowPassword(!showPassword)
              }

              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >

              {
                showPassword 
                ? <EyeOff size={17}/> 
                : <Eye size={17}/>
              }

            </button>


          </div>




          <div className="text-right">

            <Link
              href="/forgot-password"
              className="text-xs text-gray-400 hover:text-primary"
            >
              ลืมรหัสผ่าน?
            </Link>

          </div>




          <button
            type="submit"

            className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white transition hover:bg-[#005FA3]"
          >

            เข้าสู่ระบบ

          </button>



        </form>





        <div className="my-7 flex items-center gap-3">

          <div className="h-px flex-1 bg-gray-100" />

        </div>




        <div className="space-y-3">


          <button
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 py-3 text-sm font-medium text-navy transition hover:bg-gray-50"
          >

            <GoogleIcon />

            Continue with Google

          </button>


        </div>



        {
          message && (

            <div className="mt-4 text-center text-sm text-red-500">
              {message}
            </div>

          )
        }





        <p className="mt-8 text-center text-sm text-gray-400">

          ยังไม่มีบัญชี?{" "}

          <span
            onClick={() => setRegis(true)}

            className="cursor-pointer text-blue-600 hover:underline"
          >

            สมัครสมาชิกที่นี่

          </span>

        </p>



      </div>


    </section>
  );

}




function GoogleIcon() {

  return (

    <svg width="18" height="18" viewBox="0 0 24 24">

      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />

      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.99 10.99 0 0 0 12 23z" />

      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.06H2.18A10.99 10.99 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.85z" />

      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 2.47 2.18 7.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z" />

    </svg>

  );

}