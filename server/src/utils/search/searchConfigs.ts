import DailyPulse from "../../modules/dailyPulse/model/dailyPulse.model";
import LearningModel from "../../modules/learning/model/learning.model";
import User from "../../modules/user/model/user.model";


export const searchConfigs = {
    user: {
        model: User,
        searchableFields: ['name', 'companyMail', 'contact', 'businessCategory', 'designation', 'specialisation'],
        populateFields: ['company', 'avatar']
    },
    dailyPulse: {
        model: DailyPulse,
        searchableFields: [],
        dateFields: ['publishOn'],
        populateFields: ['company']
    },
    learning: {
        model: LearningModel,
        searchableFields: ['title'],
        populateFields: ['modules', 'company']
    }
};