import mongoose, { Schema } from 'mongoose';
import { ITicket } from '../types/interface';
import { TicketStatus } from '../types/enums';


// Schema for the Ticket model
const TicketSchema: Schema = new Schema<ITicket>({
    status: {
        type: String,
        enum: Object.values(TicketStatus),
        default: TicketStatus.NULL,
    }, 
    tokenNumber: {
        type: Number,
    },
    ticketCode: {
        type: String,
        required: true,
    },
    reward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});



// // Auto-increment tokenNumber before saving
// TicketSchema.pre('save', async function (next) {
//     if (this.isNew) {
//         const lastTicket = await mongoose
//             .model<ITicket>('Ticket')
//             .findOne({ reward: this.reward })
//             .sort({ tokenNumber: -1 });

//         this.tokenNumber = lastTicket ? lastTicket.tokenNumber + 1 : 100;
//     }
//     next();
// });



// Export the Ticket model
const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);
export default Ticket;