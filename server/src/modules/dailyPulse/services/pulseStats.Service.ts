import mongoose from 'mongoose';
import QuestionResponse from '../../questions/model/question.response';
import QuestionService from '../../questions/service/question.service';

interface PulseStatsResult {
  pulseItemId: string;
  optionType: string;
  totalResponses: number;
  results: Array<{
    option: string;
    count: number;
    percentage: number;
  }>;
}

class PulseStatsService {
  private questionService = new QuestionService();

  async calculateQuestionPulseStats(
    questionId: string,
    companyId: string
  ): Promise<PulseStatsResult | null> {
    try {
      // Get question details first
      const question = await this.questionService.getQuestionById(questionId);
      if (!question) {
        return null;
      }

      // Only calculate stats for supported option types
      if (question.optionType !== 'text' && question.optionType !== 'correct-incorrect' && question.optionType !== 'yes-no' && question.optionType !== 'agree-disagree') {
        return null;
      }

      // Get all users in the company first
      const User = mongoose.model('User');
      const companyUsers = await User.find({
        company: new mongoose.Types.ObjectId(companyId)
      }, { _id: 1 });

      const companyUserIds = companyUsers.map(user => user._id);

      // Aggregate responses for this question from company users only
      const responseStats = await QuestionResponse.aggregate([
        {
          $match: {
            question: new mongoose.Types.ObjectId(questionId),
            user: { $in: companyUserIds }
          }
        },
        {
          $group: {
            _id: '$response',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      // Calculate total responses
      const totalResponses = responseStats.reduce((sum, stat) => sum + stat.count, 0);

      if (totalResponses === 0) {
        return null;
      }

      // Format results based on option type
      let results: Array<{ option: string; count: number; percentage: number }> = [];

      if (question.optionType === 'correct-incorrect') {
        // Ensure we have data for both right and wrong
        const rightStat = responseStats.find(stat => stat._id === 'right') || { _id: 'right', count: 0 };
        const wrongStat = responseStats.find(stat => stat._id === 'wrong') || { _id: 'wrong', count: 0 };

        results = [
          {
            option: 'right',
            count: rightStat.count,
            percentage: Math.round((rightStat.count / totalResponses) * 100)
          },
          {
            option: 'wrong',
            count: wrongStat.count,
            percentage: Math.round((wrongStat.count / totalResponses) * 100)
          }
        ];
      } else if (question.optionType === 'text' || question.optionType === 'yes-no' || question.optionType === 'agree-disagree') {
        // For text options, use the actual question options
        const optionA = question.options[0] || '';
        const optionB = question.options[1] || '';

        const optionAStat = responseStats.find(stat => stat._id[0] === optionA) || { _id: optionA, count: 0 };
        const optionBStat = responseStats.find(stat => stat._id[0] === optionB) || { _id: optionB, count: 0 };

        results = [
          {
            option: optionA,
            count: optionAStat.count,
            percentage: Math.round((optionAStat.count / totalResponses) * 100)
          },
          {
            option: optionB,
            count: optionBStat.count,
            percentage: Math.round((optionBStat.count / totalResponses) * 100)
          }
        ];
      }

      return {
        pulseItemId: questionId,
        optionType: question.optionType,
        totalResponses,
        results
      };

    } catch (error) {
      console.error('Error calculating pulse stats:', error);
      return null;
    }
  }
}

export default PulseStatsService;
