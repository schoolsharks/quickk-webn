import React from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBlankDailyPulseMutation } from "../../dailyPulseApi";
import DailyPulseSearchToolbar from "./DailyPulseSearchToolbar";

interface DailyPulseToolbarProps {
  onDateChange: (date: Date | null) => void;
  onStatusChange: (status: string) => void;
  searchDate: Date | null;
  searchStatus: string;
}

const DailyPulseToolbar: React.FC<DailyPulseToolbarProps> = ({
  onDateChange,
  onStatusChange,
  searchDate,
  searchStatus,
}) => {
  const [CreateBlankDailyPulse] = useCreateBlankDailyPulseMutation();
  const navigate = useNavigate();

  const handleCreateDP = () => {
    CreateBlankDailyPulse({})
      .unwrap()
      .then((data) => {
        const id = data?.data;
        if (id) {
          navigate(`/admin/learnings/dailyPulse/review/${id}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <DailyPulseSearchToolbar
      buttonTitle="Create New Pulse"
      onButtonClick={handleCreateDP}
      onDateChange={onDateChange}
      onStatusChange={onStatusChange}
      searchDate={searchDate}
      searchStatus={searchStatus}
    />
  );
};

export default DailyPulseToolbar;
