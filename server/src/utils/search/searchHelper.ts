import { Document } from 'mongoose';
import { SearchConfig, SearchQuery, SearchResult } from './types';

export class SearchHelper {
  static async search<T extends Document>(
    config: SearchConfig,
    query: SearchQuery,
    companyId: string,
  ): Promise<SearchResult<T>> {
    const { model, searchableFields, dateFields = [], populateFields = [] } = config;
    const { page = 1, limit = 20, ...searchParams } = query;

    // Build search conditions
    const searchConditions: any[] = [];

    // Handle text search fields
    Object.keys(searchParams).forEach(key => {
      const value = searchParams[key];
      if (!value) return;

      if (searchableFields.includes(key)) {
        // Case-insensitive partial match
        searchConditions.push({
          [key]: { $regex: value, $options: 'i' }
        });
      } else if (dateFields.includes(key)) {
        // Exact date match (considering timezone)
        const searchDate = new Date(value);
        const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

        searchConditions.push({
          [key]: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        });
      } else {
        // Exact match for other fields (like status, enums)
        searchConditions.push({ [key]: value });
      }
    });

    // Build final query
    const mongoQuery = searchConditions.length > 0
      ? {
        $and: [
          { company: companyId },
          { $or: searchConditions }
        ]
      }

      : {};
    // Calculate pagination
    const skip = (page - 1) * limit;
    // Execute queries
    const [data, totalCount] = await Promise.all([
      model
        .find(mongoQuery)
        .populate(populateFields)
        .skip(skip)
        .limit(limit)
        .lean(),
      model.countDocuments(mongoQuery)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }
}