import cron from 'node-cron';
import { RewardStatus } from '../../types/enums'; 
import Reward from '../../models/reward.model';
import getRandomInt from '../../../../utils/getRandomInt';
import RewardService from '../../services/reward.service';

const rewardService = new RewardService();

class TicketWinnerService {
    /**
     * Initializes the cron job for selecting winners
     * @param schedule - Cron schedule expression (e.g., '0 0 * * *' for daily at midnight)
     */
    public initializeWinnerSelectionCron(schedule: string = '0 0 * * *') {
        console.log(`Setting up ticket winner cron job with schedule: ${schedule}`);
        
        cron.schedule(schedule, async () => {
            try {
                console.log('Running ticket winner selection cron job...');
                await this.processLiveRewardsForWinnerSelection();
            } catch (error: any) {
                console.error('Error in ticket winner cron job:', error.message);
            }
        });
    }

   
    public async processLiveRewardsForWinnerSelection() {
        try {
            // Find all live rewards that have ended
            const endedLiveRewards = await Reward.find({
                status: RewardStatus.LIVE,
                endTime: { $lte: new Date() }
            });

            console.log(endedLiveRewards);
            console.log(`Found ${endedLiveRewards.length} ended live rewards to process`);

            for (const reward of endedLiveRewards) {
                try {
                    await this.selectWinnerForReward(reward.id.toString());
                } catch (error: any) {
                    console.error(`Failed to process reward ${reward._id}: ${error.message}`);
                }
            }
        } catch (error: any) {
            console.error(`Error processing live rewards: ${error.message}`);
        }
    }

    /**
     * Selects a winner for a specific reward
     * @param rewardId - The ID of the reward
     */
    private async selectWinnerForReward(rewardId: string) {
        try {
            console.log(`Selecting winner for reward: ${rewardId}`);
            
            // Step 1: Get the last token number for this reward
            const lastTokenNumber = await rewardService.getLastTokenNumber(rewardId);
            console.log(`Last token number for reward ${rewardId}: ${lastTokenNumber}`);
            
            // Step 2: Fetch the live reward
            const { liveReward } = await rewardService.getLiveReward(rewardId);
            console.log(`Processing live reward: ${liveReward.name}`);
            
            // Step 3: Generate a random winning token number between 1 and lastTokenNumber
            const winningToken = getRandomInt(100, lastTokenNumber);
            console.log(`Selected winning token number: ${winningToken}`);
            
            // Step 4: Update the winner using the winning token and reward ID
            const result = await rewardService.updateWinnerTicket(winningToken, rewardId);
            console.log(`Winner update result: ${JSON.stringify(result)}`);
            
            return result;
        } catch (error: any) {
            console.error(`Failed to select winner for reward ${rewardId}: ${error.message}`);
            throw error;
        }
    }
}


export default TicketWinnerService;