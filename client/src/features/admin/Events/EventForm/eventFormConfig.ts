import { FieldConfig } from '../../../../components/ui/FromBuilder';

export const eventFormFields: FieldConfig[] = [
    {
        name: 'title',
        label: 'Event Title',
        type: 'text',
        required: true,
        placeholder: 'Enter event title'
        
    },
    {
        name: 'description',
        label: 'Event Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the event...',
        rows: 4
    },
    {
        name: 'eventDate',
        label: 'Event Date',
        type: 'date',
        required: true
    },
    {
        name: 'eventTime',
        label: 'Event Time',
        type: 'text',
        required: true,
        placeholder: 'HH:MM (24-hour format)'
    },
    {
        name: 'duration',
        label: 'Duration (minutes)',
        type: 'number',
        required: true,
        placeholder: '120',
        validation: { min: 15, max: 480 }
    },
    {
        name: 'eventType',
        label: 'Event Type',
        type: 'select',
        required: true,
        options: [
            { value: 'ONLINE', label: 'Online' },
            { value: 'OFFLINE', label: 'Offline' },
            { value: 'HYBRID', label: 'Hybrid' }
        ]
    },
    {
        name: 'location',
        label: 'Location',
        type: 'text',
        required: false,
        placeholder: 'Event location or online meeting link'
    },
    {
        name: 'maxParticipants',
        label: 'Maximum Participants',
        type: 'number',
        required: true,
        placeholder: '100',
        validation: { min: 1, max: 10000 }
    },
    {
        name: 'registrationDeadline',
        label: 'Registration Deadline',
        type: 'date',
        required: true
    },
    {
        name: 'status',
        label: 'Event Status',
        type: 'select',
        required: true,
        options: [
            { value: 'DRAFT', label: 'Draft' },
            { value: 'PUBLISHED', label: 'Published' },
            { value: 'CANCELLED', label: 'Cancelled' },
            { value: 'COMPLETED', label: 'Completed' }
        ]
    },
    {
        name: 'eventImage',
        label: 'Event Image',
        type: 'image',
        required: false
    },
    {
        name: 'tags',
        label: 'Tags',
        type: 'array',
        required: false,
        arrayConfig: {
            maxItems: 10,
            itemLabel: 'Tag',
            itemPlaceholder: 'Enter tag name'
        }
    },
    {
        name: 'requiresApproval',
        label: 'Requires Approval',
        type: 'checkbox',
        required: false
    },
    {
        name: 'isPublic',
        label: 'Public Event',
        type: 'checkbox',
        required: false,
        defaultValue: true
    },
    {
        name: 'allowWaitlist',
        label: 'Allow Waitlist',
        type: 'checkbox',
        required: false
    }
];

// Sponsors will be handled separately with a custom component
export const sponsorFormFields: FieldConfig[] = [
    {
        name: 'name',
        label: 'Sponsor Name',
        type: 'text',
        required: true,
        placeholder: 'Enter sponsor name'
    },
    {
        name: 'logo',
        label: 'Sponsor Logo',
        type: 'image',
        required: false
    }
];
