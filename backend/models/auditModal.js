import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ipAddress: { type: String },
  location: { type: String },
  deviceInfo: { type: String },
  refreshTokenHash: { type: String },
  isRevoked: { type: Boolean, default: false },
  type: {
    type: String,
    enum: [
      "login",
      "logout",
      "password_change",
      "refresh_token",
      "profile_access",
      "get_all_users",
      "update_profile",
      "profile_update",
      "role_change",
      "account_deletion",
    ],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Audit = mongoose.model("Audit", auditSchema);

export default Audit;
