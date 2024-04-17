import Image from "next/image";
import { Inter } from "next/font/google";
import { FaSignal } from 'react-icons/fa'
import Link from "next/link";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "@/components/firebase";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: '',
    name: '',
    // Add more form fields as needed
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
};
const handleSubmit = async(e) => {
  e.preventDefault()
  try {
    setErrorMessage("Loading ...");

    await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    ).then((user) => {
      console.log("User signed in", user, user.user.uid);
      router.push("/home")
    });
  } catch (error) {
    handleAuthError(error);

    console.error("Error signing in:", error.message);
  }
}

const handleAuthError = (error) => {
  switch (error.code) {
    case "auth/email-already-in-use":
      setErrorMessage(
        "Email is already in use. Please choose another email."
      );
      break;
    case "auth/invalid-email":
      setErrorMessage("Invalid email address.");
      break;
    case "auth/weak-password":
      setErrorMessage(
        "Password is too weak. Please choose a stronger password."
      );
      break;
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      setErrorMessage("Invalid email or password.");
      break;
    default:
      setErrorMessage(
        "An error occurred during authentication. Please try again later."
      );
      break;
  }
};

  return (<div>
    <header className="my-10 flex justify-center">
      <FaSignal size={40} />
      <h1 className="text-4xl font-bold">Pyscheme</h1>
    </header>
    <main>
        <form className=" mx-auto flex gap-2 flex-col" style={{ width: "min(350px, 90vw)",}} onSubmit={handleSubmit}>
          <label htmlFor="email" className="label" style={{ alignSelf: "left" }}>Email Address</label>
          <input type="email" name="email" onChange={handleChange} className="mb-3 inputField focus:focus" />
          <label htmlFor="password" className="label">Password</label>
          <input type="password" name="password" onChange={handleChange} className="inputField focus:focus" />
          {<div className="text-red-500 mt-2 font-bold">{errorMessage}</div>}
          <p className="text-center my-2 text-lg">Don't have an account? <Link className="text-blue-600" href={"signup"}>Sign Up</Link></p>
          <input type="submit" value="Sign In" className="cursor-pointer inputField text-center bg-black text-white "/>
        </form>
    </main>
  </div>
  )
}
