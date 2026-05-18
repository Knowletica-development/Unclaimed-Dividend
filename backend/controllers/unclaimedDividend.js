import mongoose from "mongoose";
import fs from "fs";
import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { UnclaimedDividend } from "../models/unclaimedDividendModal.js";

const uploadToCloudinary = async (localPath, folder) => {
  return cloudinary.uploader.upload(localPath, {
    folder,
    resource_type: "auto",
  });
};

export const createUnclaimedDividend = CatchAsyncError(
  async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const tempFiles = [];

    try {
      const {
        folioOrDpId,
        panNumber,
        aadharNumber,
        fullName,
        address,
        companyName,
        CIN,
        dividendYear,
        amount,
        bankIFSC,
      } = req.body;

      if (!folioOrDpId)
        return next(new ErrorHandler("Folio No / DP ID is required", 400));
      if (!panNumber)
        return next(new ErrorHandler("PAN number is required", 400));
      if (!aadharNumber)
        return next(new ErrorHandler("Aadhar number is required", 400));
      if (!fullName)
        return next(new ErrorHandler("Full name is required", 400));
      if (!address) return next(new ErrorHandler("Address is required", 400));
      if (!companyName)
        return next(new ErrorHandler("Company name is required", 400));
      if (!CIN) return next(new ErrorHandler("CIN is required", 400));
      if (!dividendYear)
        return next(new ErrorHandler("Dividend year is required", 400));
      if (!amount) return next(new ErrorHandler("Amount is required", 400));
      if (!bankIFSC)
        return next(new ErrorHandler("Bank IFSC is required", 400));

      const files = req.files;

      if (!files?.idProof)
        return next(new ErrorHandler("ID Proof is required", 400));
      if (!files?.shareCertificate)
        return next(new ErrorHandler("Share Certificate is required", 400));
      if (!files?.cancelCheque)
        return next(new ErrorHandler("Cancelled Cheque is required", 400));
      if (!files?.indemnityBond)
        return next(new ErrorHandler("Indemnity Bond is required", 400));

      Object.values(files)
        .flat()
        .forEach((f) => tempFiles.push(f.path));

      const idProof = await uploadToCloudinary(
        files.idProof[0].path,
        "unclaimed-dividend/id-proof"
      );
      const shareCert = await uploadToCloudinary(
        files.shareCertificate[0].path,
        "unclaimed-dividend/share-certificate"
      );
      const cheque = await uploadToCloudinary(
        files.cancelCheque[0].path,
        "unclaimed-dividend/cancelled-cheque"
      );
      const bond = await uploadToCloudinary(
        files.indemnityBond[0].path,
        "unclaimed-dividend/indemnity-bond"
      );

      const documents = [
        { type: "ID Proof", fileUrl: idProof.secure_url },
        { type: "Share Certificate", fileUrl: shareCert.secure_url },
        { type: "Cancelled Cheque", fileUrl: cheque.secure_url },
        { type: "Indemnity Bond", fileUrl: bond.secure_url },
      ];

      const claim = await UnclaimedDividend.create(
        [
          {
            submittedBy: req.user._id,
            lastUpdatedBy: req.user._id,
            folioOrDpId,
            panNumber,
            aadharNumber,
            fullName,
            address,
            companyName,
            CIN,
            dividendYear,
            amount,
            bankIFSC,
            documents,
          },
        ],
        { session }
      );

      await session.commitTransaction();

      res.status(201).json({
        success: true,
        message: "Unclaimed dividend claim submitted successfully",
        data: claim[0],
      });
    } catch (error) {
      await session.abortTransaction();
      return next(error);
    } finally {
      session.endSession();

      tempFiles.forEach((filePath) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
  }
);

export const updateUnclaimedDividend = CatchAsyncError(
  async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const tempFiles = [];

    try {
      const claimId = req.params.id;

      const claim = await UnclaimedDividend.findOne({
        _id: claimId,
        user: req.user._id,
      }).session(session);

      if (!claim)
        return next(new ErrorHandler("Unclaimed dividend not found", 404));

      const allowedFields = [
        "folioOrDpId",
        "panNumber",
        "aadharNumber",
        "fullName",
        "address",
        "companyName",
        "CIN",
        "dividendYear",
        "amount",
        "bankIFSC",
      ];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          claim[field] = req.body[field];
        }
      });

      const files = req.files;

      if (files && Object.keys(files).length > 0) {
        Object.values(files)
          .flat()
          .forEach((f) => tempFiles.push(f.path));
      }

      const updatedDocuments = [...claim.documents];

      const replaceDocument = async (type, file, folder) => {
        const upload = await uploadToCloudinary(file.path, folder);

        const index = updatedDocuments.findIndex((doc) => doc.type === type);

        if (index !== -1) {
          updatedDocuments[index].fileUrl = upload.secure_url;
          updatedDocuments[index].uploadedAt = new Date();
        } else {
          updatedDocuments.push({
            type,
            fileUrl: upload.secure_url,
          });
        }
      };

      if (files?.idProof) {
        await replaceDocument(
          "ID Proof",
          files.idProof[0],
          "unclaimed-dividend/id-proof"
        );
      }

      if (files?.shareCertificate) {
        await replaceDocument(
          "Share Certificate",
          files.shareCertificate[0],
          "unclaimed-dividend/share-certificate"
        );
      }

      if (files?.cancelCheque) {
        await replaceDocument(
          "Cancelled Cheque",
          files.cancelCheque[0],
          "unclaimed-dividend/cancelled-cheque"
        );
      }

      if (files?.indemnityBond) {
        await replaceDocument(
          "Indemnity Bond",
          files.indemnityBond[0],
          "unclaimed-dividend/indemnity-bond"
        );
      }

      claim.documents = updatedDocuments;

      claim.status = "Claim Initiated";

      await claim.save({ session });

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: "Unclaimed dividend updated successfully",
        data: claim,
      });
    } catch (error) {
      await session.abortTransaction();
      return next(error);
    } finally {
      session.endSession();

      tempFiles.forEach((filePath) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
  }
);

export const getMyUnclaimedDividends = CatchAsyncError(
  async (req, res, next) => {
    const userId = req.user._id;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const query = { submittedBy: userId };

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), "i");
      query["Investor Name"] = { $regex: searchRegex };
    }

    if (req.query.pincode) {
      query["Pincode"] = Number(req.query.pincode);
    }

    if (req.query.company) {
      query["Company Name"] = { $regex: new RegExp(req.query.company.trim(), "i") };
    }

    const [claims, total, analytics] = await Promise.all([
      UnclaimedDividend.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      UnclaimedDividend.countDocuments(query),

      UnclaimedDividend.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalUnclaimedAmount: { $sum: { $ifNull: ["$Amount", 0] } },
            totalSharesTracked: { $sum: { $ifNull: ["$No. Of Shares", 0] } },
            totalEstimatedValue: { $sum: { $ifNull: ["$Value", 0] } },
            uniqueCompanies: { $addToSet: "$Company Name" }
          }
        }
      ])
    ]);

    const summary = analytics[0] ? {
      totalUnclaimedAmount: Number(analytics[0].totalUnclaimedAmount.toFixed(2)),
      totalSharesTracked: analytics[0].totalSharesTracked,
      totalEstimatedValue: Number(analytics[0].totalEstimatedValue.toFixed(2)),
      totalUniqueCompanies: analytics[0].uniqueCompanies.length
    } : {
      totalUnclaimedAmount: 0,
      totalSharesTracked: 0,
      totalEstimatedValue: 0,
      totalUniqueCompanies: 0
    };

    res.status(200).json({
      success: true,
      meta: {
        totalRecords: total,
        currentPage: page,
        limit,
        totalPages: Math.ceil(total / limit),
        analyticsSummary: summary 
      },
      data: claims 
    });
  }
);
