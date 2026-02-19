import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between bg-white p-6 rounded-xl shadow-lg mb-6">
          {/* User Avatar */}
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-3xl font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                user?.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user?.isActive ? "Active" : "Inactive"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                user?.isEmailVerified
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {user?.isEmailVerified ? "Email Verified" : "Email Not Verified"}
            </span>
          </div>
        </div>

        {/* Info Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Info</h2>
            <div className="flex flex-col gap-3 text-gray-700">
              <p><span className="font-semibold">Name:</span> {user?.name}</p>
              <p><span className="font-semibold">Email:</span> {user?.email}</p>
              <p><span className="font-semibold">Role:</span> {user?.role}</p>
              <p><span className="font-semibold">Created At:</span> {new Date(user?.createdAt).toLocaleString()}</p>
              <p><span className="font-semibold">Last Active:</span> {new Date(user?.lastActive).toLocaleString()}</p>
            </div>
          </div>

          {/* Security & Account */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Security & Account</h2>
            <div className="flex flex-col gap-3 text-gray-700">
              <p><span className="font-semibold">Email Verified:</span> {user?.isEmailVerified ? "Yes" : "No"}</p>
              <p><span className="font-semibold">Two Factor Enabled:</span> {user?.isTwoFactorEnabled ? "Yes" : "No"}</p>
              <p><span className="font-semibold">Google Auth:</span> {user?.googleAuth ? "Enabled" : "Disabled"}</p>
              <p><span className="font-semibold">Microsoft Auth:</span> {user?.microsoftAuth ? "Enabled" : "Disabled"}</p>
              <p><span className="font-semibold">Login Attempts:</span> {user?.loginAttempts}</p>
              <p><span className="font-semibold">Lock Date:</span> {user?.lockDate ? new Date(user.lockDate).toLocaleString() : "Not Locked"}</p>
              <p><span className="font-semibold">Failed OTP Attempts:</span> {user?.failedOTPAttempts}</p>
              <p><span className="font-semibold">Email Verification Attempts:</span> {user?.emailVerificationAttempts}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
