import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "ID Proof",
      "Share Certificate",
      "Cancelled Cheque",
      "Indemnity Bond",
    ],
    required: true,
  },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const unclaimedDividendSchema = new mongoose.Schema(
  {
    folioOrDpId: {
      type: String,
      required: [true, "Folio No / DP ID is required"],
      trim: true,
    },
    panNumber: {
      type: String,
      required: [true, "PAN Number is required"],
      uppercase: true,
      trim: true,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    },
    aadharNumber: {
      type: String,
      required: [true, "Aadhar Number is required"],
      trim: true,
      match: /^[0-9]{12}$/,
    },
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Company Name is required"],
      trim: true,
    },
    CIN: {
      type: String,
      required: [true, "CIN is required"],
      trim: true,
    },
    dividendYear: {
      type: String,
      required: [true, "Dividend Year is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0,
    },
    bankIFSC: {
      type: String,
      required: [true, "Bank IFSC code is required"],
      trim: true,
      uppercase: true,
      match: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    },
    documents: [documentSchema],
    status: {
      type: String,
      enum: [
        "Claim Initiated",
        "Documents Submitted",
        "Verification",
        "Payment Completed",
      ],
      default: "Claim Initiated",
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: [
      {
        message: { type: String },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const UnclaimedDividend = mongoose.model(
  "UnclaimedDividend",
  unclaimedDividendSchema
);
