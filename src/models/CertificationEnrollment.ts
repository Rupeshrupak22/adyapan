/**
 * CertificationEnrollment Model
 * Stores leads from the "Earn Certificate" form on certification detail pages.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificationEnrollment extends Document {
  name: string;
  phone: string;
  email: string;
  college: string;
  city: string;
  examDate: Date | null;
  certificationName: string;
  companyName: string;
  source: string;
  status: 'new' | 'contacted' | 'enrolled' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const CertificationEnrollmentSchema = new Schema<ICertificationEnrollment>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name too long'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      maxlength: [20, 'Phone too long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
      index: true,
    },
    college: {
      type: String,
      default: '',
      trim: true,
      maxlength: [200, 'Company name too long'],
    },
    city: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, 'City name too long'],
    },
    examDate: {
      type: Date,
      default: null,
    },
    certificationName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [300, 'Certification name too long'],
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'College name too long'],
    },
    source: {
      type: String,
      default: 'certification-modal',
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'enrolled', 'rejected'],
      default: 'new',
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'certificationEnrollments',
  }
);

CertificationEnrollmentSchema.index({ createdAt: -1 });
CertificationEnrollmentSchema.index({ status: 1, createdAt: -1 });
CertificationEnrollmentSchema.index({ email: 1, certificationName: 1, createdAt: -1 });
CertificationEnrollmentSchema.index({ phone: 1, certificationName: 1, createdAt: -1 });

const CertificationEnrollment: Model<ICertificationEnrollment> =
  mongoose.models.CertificationEnrollment ||
  mongoose.model<ICertificationEnrollment>(
    'CertificationEnrollment',
    CertificationEnrollmentSchema
  );

export default CertificationEnrollment;
