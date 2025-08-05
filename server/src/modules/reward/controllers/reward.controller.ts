import { Request, Response } from 'express';
import RewardService from '../services/reward.service';
import mongoose from 'mongoose';

const rewardService = new RewardService();

export const getAllRewards = async (req: Request, res: Response): Promise<void> => {
    try {
        const companyId = req.user?.companyId;
        const rewards = await rewardService.getAllRewards(companyId);
        res.status(200).json(rewards);
    } catch (error: any) {
        throw new Error(`Failed to fetch rewards: ${error.message}`);
    }
};

export const getAllTickets = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id; 
        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }
        console.log('User ID:', userId);
        const tickets = await rewardService.getAllTickets(userId);
        res.status(200).json(tickets);
    } catch (error: any) {
        res.status(500).json({ message: `Failed to fetch tickets: ${error.message}` });
    }
};

export const getLiveReward = async (req: Request, res: Response): Promise<void> => {
    try {
        const { rewardId } = req.params;
        // Add validation for MongoDB ObjectId format
        if (!rewardId || !mongoose.Types.ObjectId.isValid(rewardId)) {
            res.status(400).json({ message: 'Valid reward ID is required' });
            return;
        }
        
        const liveRewardDetails = await rewardService.getLiveReward(rewardId);
        res.status(200).json(liveRewardDetails);
    } catch (error: any) {
        res.status(500).json({ message: `Failed to fetch live reward: ${error.message}` });
    }
};

export const buyTicket = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const { rewardId, quantity } = req.body;
        
        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }
        
        if (!rewardId || !mongoose.Types.ObjectId.isValid(rewardId)) {
            res.status(400).json({ message: 'Valid reward ID is required' });
            return;
        }
        
        // Default to 1 if quantity is not provided or invalid
        const ticketQuantity = quantity && Number.isInteger(Number(quantity)) && Number(quantity) > 0 
            ? Number(quantity) 
            : 1;
        
        const result = await rewardService.buyTicket(userId, rewardId, ticketQuantity);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ message: `Failed to purchase ticket: ${error.message}` });
    }

};  

 export const getUpcomingReward = async (req: Request, res: Response): Promise<void> => {
        try {
            const upcomingReward = await rewardService.getUpcomingReward();
            res.status(200).json(upcomingReward);
        } catch (error: any) {
            res.status(500).json({ message: `Failed to fetch upcoming reward: ${error.message}` });
        }
    };


    export const updateWinnerTicket = async (req: Request, res: Response): Promise<void> => {
        try {
            const { tokenNumber, rewardId } = req.body;

            if (
                typeof tokenNumber !== 'number' ||
                !rewardId ||
                !mongoose.Types.ObjectId.isValid(rewardId)
            ) {
                res.status(400).json({ message: 'Valid tokenNumber (number) and rewardId are required' });
                return;
            }

            const result = await rewardService.updateWinnerTicket(tokenNumber, rewardId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: `Failed to update winner ticket: ${error.message}` });
        }
    };

    export const getWinnerTicket = async (req: Request, res: Response): Promise<void> => {
        try {
            const { rewardId } = req.params;
            if (!rewardId || !mongoose.Types.ObjectId.isValid(rewardId)) {
                res.status(400).json({ message: 'Valid reward ID is required' });
                return;
            }

            const result = await rewardService.getWinnerTicket(rewardId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: `Failed to fetch winner ticket: ${error.message}` });
        }
    };

    export const getLastPastReward = async (req: Request, res: Response): Promise<void> => {
        try {
            const companyId = req.user?.companyId;
            const lastPastReward = await rewardService.getLastPastReward(companyId);
            res.status(200).json(lastPastReward);
        } catch (error: any) {
            res.status(500).json({ message: `Failed to fetch last past reward: ${error.message}` });
        }
    };




