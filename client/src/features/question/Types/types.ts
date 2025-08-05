export interface QuestionProps {
  questionSubText?: string;
  questionSubHeading?: string;
  questionText: string;
  image?: string | File | null;
  optionType: OptionType;
  questionOptions?: string[];
  options?: string[] | File[];
  explanation?: string;
  response?: string;
  correctAnswer?: string | string[];
  onAnswer?: (answer: string | string[], id: string) => void;
  sx?: object;
  id: string;
  onOptionClick?: (answer: string | string[], id: string) => void;
  smallSize?: boolean;
}


export type OptionType = "text" | "image" | "correct-incorrect" | "mcq" | "drag-order";