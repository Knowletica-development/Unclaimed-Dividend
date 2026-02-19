import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },
    phone: { type: String, unique: true, sparse: true },
    avatar: { type: String },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: function () {
        return this.role === "user";
      },
    },

    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    googleAuth: { type: Boolean, default: false },
    microsoftAuth: { type: Boolean, default: false },
    refreshTokenHash: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    isTwoFactorEnabled: { type: Boolean, default: false },
    twoFactorMethod: { type: String, enum: ["email", "sms"] },
    twoFactorToken: { type: String },
    twoFactorExpires: { type: Date },
    mfaRecoveryCodes: [{ type: String }],

    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    emailVerificationAttempts: { type: Number, default: 0 },

    failedOTPAttempts: { type: Number, default: 0 },
    passwordChangedAt: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockDate: { type: Date },
    lastActive: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

userSchema.methods.incrementLoginAttempts = function () {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.lockDate = Date.now() + 30 * 60 * 1000;
  }
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2h" }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "3d" }
  );
};

const User = mongoose.model("User", userSchema);
export default User;
