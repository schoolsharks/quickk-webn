
import TicketWinnerService from "./functions/winnerSelection.job";

const ticketService=new TicketWinnerService()


// schedules the job to execute at 00:00 (midnight) daily.
ticketService.initializeWinnerSelectionCron("28 15 * * *");

// ticketService.processLiveRewardsForWinnerSelection()