
export enum QuestionType {
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
    TWO_CHOICE = 'TWO_CHOICE', 
    DRAG_ORDER = "DRAG_ORDER",
    MEMORY_MATCH = "MEMORY_MATCH",
    ADVERTISEMENT = "ADVERTISEMENT",
}

export enum OptionType {
    TEXT = "text",
    IMAGE = "image",
    CORRECT_INCORRECT = "correct-incorrect",
    MCQ = "mcq",
    DRAG_ORDER = "drag-order",
}

export enum FeedbackType {
    GOOD = "good",
    AVERAGE = "average",
    BAD = "bad",
}