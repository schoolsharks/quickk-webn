import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  id: string;
  sender: 'bot' | 'user';
  content: string;
  timestamp: Date;
  options?: string[];
  questionType?: 'text' | 'options' | 'date';
  // For storing React elements metadata
  elementType?: 'button' | 'link' | 'component';
  elementData?: {
    moduleId?: mongoose.Types.ObjectId;
    dailyPulseId?: mongoose.Types.ObjectId;
    text?: string;
    action?: string;
    href?: string;
  };
}

export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;
  adminId: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
  createdModuleId?: mongoose.Types.ObjectId;
  createdDailyPulseId?: mongoose.Types.ObjectId;
  chatType: 'module' | 'dailyPulse' | 'general';
  status: 'active' | 'completed' | 'archived';
  company: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  id: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ['bot', 'user'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  options: [{
    type: String,
  }],
  questionType: {
    type: String,
    enum: ['text', 'options', 'date'],
  },
  elementType: {
    type: String,
    enum: ['button', 'link', 'component'],
  },
  elementData: {
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
    },
    dailyPulseId: {
      type: Schema.Types.ObjectId,
      ref: 'DailyPulse',
    },
    text: String,
    action: String,
    href: String,
  },
});

const ChatSchema = new Schema<IChat>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'New Chat',
    },
    messages: [MessageSchema],
    createdModuleId: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
    },
    createdDailyPulseId: {
      type: Schema.Types.ObjectId,
      ref: 'DailyPulse',
    },
    chatType: {
      type: String,
      enum: ['module', 'dailyPulse', 'general'],
      default: 'general',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ChatSchema.index({ adminId: 1, createdAt: -1 });
ChatSchema.index({ company: 1, createdAt: -1 });

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);