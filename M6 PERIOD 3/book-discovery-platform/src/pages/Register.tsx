import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    bio:""
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      if (!user?.uid) throw new Error("No user ID returned from Firebase.");

      await setDoc(doc(db, "users", user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        bio: form.bio,
      });

      alert("User registered!");
    } catch (err: any) {
      console.error("Registration error:", err.message);
      alert("Error registering. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="First Name"
          required
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />

        <input
          type="text"
          placeholder="Last Name"
          required
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="text"
          placeholder="bio"
          required
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
