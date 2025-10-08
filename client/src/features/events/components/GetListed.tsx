import {
  Box,
  Typography,
  useTheme,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowBack, FiberManualRecord } from "@mui/icons-material";
import { useState, useEffect } from "react";
import GlobalButton from "../../../components/ui/button";
import GetListedImg from "../../../assets/images/Events/GetListed.webp";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../../payment/api/paymentApi";

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

const GetListed = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [verifyPayment, { isLoading: isVerifyingPayment }] =
    useVerifyPaymentMutation();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    script.onerror = () => {
      setSnackbar({
        open: true,
        message: "Failed to load payment gateway. Please try again.",
        severity: "error",
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handlePayClick = async () => {
    if (!isRazorpayLoaded) {
      setSnackbar({
        open: true,
        message: "Payment gateway is still loading. Please wait...",
        severity: "info",
      });
      return;
    }

    try {
      // Create order
      const orderResponse = await createOrder({
        amount: 399,
        currency: "INR",
        purpose: "listing",
      }).unwrap();

      const { orderId, amount, currency } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Quickk WebnClub",
        description: "Get Listed - Community Directory Listing Fee",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on client side for immediate feedback
            // Note: Webhook will be the final source of truth
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }).unwrap();

            setSnackbar({
              open: true,
              message: "🎉 Payment successful! You are now listed member.",
              severity: "success",
            });

            // Redirect after success
            setTimeout(() => {
              navigate("/user/dashboard");
            }, 2000);
          } catch (error: any) {
            console.error("Payment verification failed:", error);
            // Even if client verification fails, webhook will update the status
            setSnackbar({
              open: true,
              message:
                "Payment initiated successfully. We're confirming your payment...",
              severity: "info",
            });
            
            // Still redirect, webhook will update status
            setTimeout(() => {
              navigate("/user/dashboard");
            }, 3000);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: theme.palette.primary.main,
        },
        modal: {
          ondismiss: function () {
            setSnackbar({
              open: true,
              message: "Payment cancelled",
              severity: "info",
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      setSnackbar({
        open: true,
        message:
          error?.data?.message ||
          "Failed to initiate payment. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isProcessing = isCreatingOrder || isVerifyingPayment;

  const benefits = [
    "Appear in our community directory.",
    "Reach entrepreneurs, investors, and business owners.",
    "Build trust and credibility within the network.",
    "Get discovered by potential customers & collaborators.",
  ];

  return (
    <>
      <Box
        sx={{
          maxWidth: "480px",
          margin: "0 auto",
          minHeight: "100vh",
          backgroundColor: "#FFFFFF",
          position: "relative",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "16px 0",
            marginBottom: "32px",
            px: "24px",
          }}
        >
          <IconButton
            onClick={handleBackClick}
            sx={{
              marginRight: "16px",
            }}
            disabled={isProcessing}
          >
            <ArrowBack sx={{ color: "#000" }} />
          </IconButton>
          <Typography
            variant="h2"
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#000",
            }}
          >
            Get Listed
          </Typography>
        </Box>

        <Box
          component="img"
          src={GetListedImg}
          alt="Get Listed"
          sx={{
            width: "100%",
            objectFit: "cover",
            borderRadius: "0px",
            marginBottom: "60px",
          }}
        />

        {/* Main Content */}
        <Box sx={{ marginBottom: "40px", px: "24px" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#000",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            Want to Get Listed on Our Platform?
          </Typography>

          <Typography
            sx={{
              fontSize: "16px",
              color: theme.palette.text.secondary,
              lineHeight: "18px",
              marginBottom: "32px",
            }}
          >
            Showcase yourself or your business to our entire community. Getting
            listed means more visibility, more connections, and more
            opportunities.
          </Typography>
        </Box>

        {/* Benefits Section */}
        <Box sx={{ marginBottom: "40px", px: "24px" }}>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              color: theme.palette.primary.main,
              marginBottom: "16px",
            }}
          >
            Benefits of Listing
          </Typography>

          <List sx={{ padding: 0 }}>
            {benefits.map((benefit, index) => (
              <ListItem
                key={index}
                sx={{
                  padding: "2px 0",
                  alignItems: "flex-start",
                }}
              >
                <ListItemIcon sx={{ minWidth: "20px", marginTop: "8px" }}>
                  <FiberManualRecord
                    sx={{
                      fontSize: "8px",
                      color: "#000",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={benefit}
                  sx={{
                    margin: 0,
                    "& .MuiListItemText-primary": {
                      fontSize: "16px",
                      color: "#000",
                      lineHeight: 1.5,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Listing Fee Section */}
        <Box sx={{ marginBottom: "60px", px: "24px" }}>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              color: theme.palette.primary.main,
              marginBottom: "8px",
            }}
          >
            Listing Fee
          </Typography>

          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#000",
            }}
          >
            ₹399 only (GST included)
          </Typography>
        </Box>

        {/* Pay Button */}
        <Box px={"24px"}>
          <GlobalButton
            onClick={handlePayClick}
            fullWidth={true}
            disabled={isProcessing || !isRazorpayLoaded}
            sx={{
              backgroundColor: "#4A4A4A",
              color: "#FFFFFF",
              marginBottom: "30px",
              "&:hover": {
                backgroundColor: "#3A3A3A",
              },
              "&:disabled": {
                backgroundColor: "#CCCCCC",
                color: "#666666",
              },
            }}
          >
            {isProcessing ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: "#fff" }} />
                Processing...
              </>
            ) : !isRazorpayLoaded ? (
              "Loading..."
            ) : (
              "Pay ₹399"
            )}
          </GlobalButton>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GetListed;
