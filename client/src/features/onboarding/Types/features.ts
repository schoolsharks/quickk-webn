export enum FeatureKeys {
    MODULES='modules',
    DAILYPULSE='dailyPulse',
    QUICKKAI='quickkAI',
    REWARDS = 'rewards',
    ANALYTICS = 'analytics',
}

export interface Feature {
    id: FeatureKeys;
    name: string;
    description: string;
    routes: string[];
    icon: React.ReactNode;
    enabled: boolean;
}