import React, { useEffect } from "react";
import BuyConfiramtionLayout from "../../features/biding/components/BuyConfiramtionLayout";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { clearPurchasedTickets } from "../../features/biding/service/bidingSlice";

const BuyConfiramtionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { purchasedTickets, lastPurchaseSuccess } = useSelector((state :RootState) => state.biding);
  const navigate = useNavigate();
   useEffect(() => {
    if (!lastPurchaseSuccess || purchasedTickets.length === 0) {
      navigate(`/user/dashboard`);
    }
    
    // Clear the purchased tickets when leaving this page
    return () => {
      dispatch(clearPurchasedTickets());
    };
  }, [lastPurchaseSuccess, purchasedTickets, navigate, dispatch]);

  return <BuyConfiramtionLayout purchasedTickets={purchasedTickets} lastPurchaseSuccess={lastPurchaseSuccess}/>;
};

export default BuyConfiramtionPage;
