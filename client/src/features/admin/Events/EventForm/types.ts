export interface EventFormData {
    title: string;
    description: string;
    eventDate: string;
    eventTime: string;
    duration: number;
    location: string;
    eventType: 'ONLINE' | 'OFFLINE' | 'HYBRID';
    status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
    maxParticipants: number;
    registrationDeadline: string;
    tags: string[];
    sponsors: (string | { name: string; logo?: string })[];
    eventImage: File | null;
    requiresApproval: boolean;
    isPublic: boolean;
    allowWaitlist: boolean;
}

export interface SponsorFormData {
    name: string;
    logo?: File | null;
}
