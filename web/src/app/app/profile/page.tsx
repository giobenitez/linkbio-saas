import ProfileForm from "./profile-form";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <p className="mt-2 text-white/70">
        Edita tu perfil (username, bio, avatar).
      </p>

      <div className="mt-6">
        <ProfileForm />
      </div>
    </div>
  );
}
