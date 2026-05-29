/**
 * ContactMessage Model
 * Stores "Get In Touch" messages submitted via the /contact page.
 */
import mongoose, { Schema, model, models } from 'mongoose';

export interface ContactMessageDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  source: string;
  ip?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ContactMessageDocument>(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, lowercase: true, trim: true, index: true },
    phone:   { type: String, default: '', trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status:  {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
      index: true,
    },
    source: { type: String, default: 'get-in-touch', trim: true, index: true },
    ip: { type: String, default: '' },
  },
  { timestamps: true, collection: 'getInTouch' }
);

schema.index({ createdAt: -1 });
schema.index({ status: 1, createdAt: -1 });

const ContactMessage = models.GetInTouchMessage
  || model<ContactMessageDocument>('GetInTouchMessage', schema);
export default ContactMessage;
