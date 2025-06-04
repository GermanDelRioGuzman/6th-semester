import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./Login.css";

export default function Login() {
  const loginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const email = (e.target as any).email.value;
      const password = (e.target as any).password.value;
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      localStorage.setItem('user', JSON.stringify({
        name: result.user.email
      }));

      alert("Login successful!");
    } catch (err: any) {
      alert(`Login failed: ${err.message}`);
      console.error(err);
    }
  };

  const loginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;

      const userDoc = doc(db, "users", uid);
      const snap = await getDoc(userDoc);

      if (!snap.exists()) {
        await setDoc(userDoc, {
          firstName: result.user.displayName?.split(" ")[0] || "",
          lastName: result.user.displayName?.split(" ").slice(1).join(" ") || "",
          email: result.user.email,
          bio: ""
        });
      }

      localStorage.setItem('user', JSON.stringify({
        name: result.user.displayName || result.user.email
      }));

      alert("Login with Google successful!");
    } catch (err: any) {
      alert(`Google login failed: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <form className="login-form" onSubmit={loginEmail}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <button type="button" onClick={loginGoogle}>Login with Google</button>
    </form>
  );
}
