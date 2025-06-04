import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const snap = await getDoc(doc(db, "users", uid));
        if (snap.exists()) {
          setProfile(snap.data() as any);
        }
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      await updateDoc(doc(db, "users", uid), profile);
      alert("Profile updated!");
    }
  };

  return (
    <div className="profile-container">
      <h2>Hola, {profile.firstName || "usuario"}!</h2>

      <input
        type="text"
        placeholder="First Name"
        value={profile.firstName}
        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
      />

      <input
        type="text"
        placeholder="Last Name"
        value={profile.lastName}
        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        value={profile.email}
        disabled
      />

      <textarea
        placeholder="Bio"
        value={profile.bio}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
      />

      <button onClick={handleSave}>Save</button>
    </div>
  );
}
