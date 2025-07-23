import { useAuth } from "@/auth/AuthContext";
import { updateProfile } from "@/services/Profile";
import { useState } from "react";

export default function AccountSettings() {
  const { user } = useAuth();
  const [nomPrenom, setNomPrenom] = useState(user?.nomPrenom || "");
  const [telephone, setTelephone] = useState(user?.telephone || "");
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    user?.profilePictureUrl || ""
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Paramètres du compte</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setSuccess(null);
          setError(null);
          try {
            await updateProfile({ nomPrenom, telephone, profilePictureUrl });
            setSuccess("Profil mis à jour avec succès !");
          } catch (err) {
            setError("Erreur lors de la mise à jour du profil.");
          } finally {
            setLoading(false);
          }
        }}
        className="space-y-4 max-w-md"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Nom complet</label>
          <input
            type="text"
            value={nomPrenom}
            onChange={(e) => setNomPrenom(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <input
            type="text"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Photo de profil (URL)
          </label>
          <input
            type="text"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="inwi_btn px-4 py-2 rounded text-white"
          disabled={loading}
        >
          {loading ? "Mise à jour..." : "Enregistrer"}
        </button>
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
      {/* ... autres paramètres statiques ... */}
    </div>
  );
}
