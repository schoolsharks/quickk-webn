import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  Grid,
  IconButton,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Code as CodeIcon,
  School as LearningIcon,
  BarChart as AnalyticsIcon,
  Today as DailyPulseIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { DailyPulseData, Message, ModuleData } from "../types/interfaces";
import { FeatureType, ModuleType } from "../types/enums";
import { useCreateAIModuleMutation } from "../../learning/service/learningApi";
import { useCreateAIDailyPulseMutation } from "../../dailyPulse/dailyPulseApi";
import LearningModal from "./LearningModal";
import ChatHistoryDrawer from "./ChatHistoryDrawer";

import {
  useGetChatByIdQuery,
  useGetChatsByAdminQuery,
  useUpdateChatOnCompletionMutation,
  useDeleteChatMutation,
  useSearchChatsMutation,
} from "../services/QuickkAi.api";

const QuickkAI: React.FC = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [CreateAIModule] = useCreateAIModuleMutation();
  const [CreateAIDailyPulse] = useCreateAIDailyPulseMutation();
  const [updateChatOnCompletion] = useUpdateChatOnCompletionMutation();
  const [deleteChat] = useDeleteChatMutation();
  const [triggerSearch, { data: searchChatsData, isLoading: isSearching }] =
    useSearchChatsMutation();

  // Chat-related queries
  const { data: currentChatData, isLoading: isChatLoading } =
    useGetChatByIdQuery(chatId!, {
      skip: !chatId,
    });
  // console.log(currentChatData);
  const { data: chatsData, isLoading: isChatsLoading } =
    useGetChatsByAdminQuery({}, { refetchOnMountOrArgChange: true });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      content:
        "Welcome to Quickk AI! 🚀 I'm here to help you create engaging learning modules and daily pulses quickly and efficiently. Let's get started!",
      timestamp: new Date(),
    },
    {
      id: "2",
      sender: "bot",
      content: "What would you like to create today?",
      timestamp: new Date(),
      options: ["Learning Module", "Daily Pulse"],
      questionType: "options",
    },
  ]);

  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [moduleData, setModuleData] = useState<ModuleData>({});
  const [dailyPulseData, setDailyPulseData] = useState<DailyPulseData>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [currentFeature, setCurrentFeature] = useState<FeatureType | null>(
    null
  );
  const [createdModuleId, setCreatedModuleId] = useState<string>("");
  const [_createdDailyPulseId, setCreatedDailyPulseId] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat data when chatId changes
  useEffect(() => {
    const currentChat = currentChatData?.data.chat;
    // console.log(currentChat);
    if (chatId && currentChat && currentChat.messages.length) {
      setMessages(
        currentChat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      );

      // Set other states based on chat data
      if (currentChat.createdModuleId) {
        setCreatedModuleId(currentChat.createdModuleId.toString());
      }
      if (currentChat.createdDailyPulseId) {
        setCreatedDailyPulseId(currentChat.createdDailyPulseId.toString());
      }
    } else {
      // Reset to initial state for new chat
      setMessages([
        {
          id: "1",
          sender: "bot",
          content:
            "Welcome to Quickk AI! 🚀 I'm here to help you create engaging learning modules and daily pulses quickly and efficiently. Let's get started!",
          timestamp: new Date(),
        },
        {
          id: "2",
          sender: "bot",
          content: "What would you like to create today?",
          timestamp: new Date(),
          options: ["Learning Module", "Daily Interaction"],
          questionType: "options",
        },
      ]);
      setCurrentStep(1);
      setCurrentFeature(null);
      setModuleData({});
      setDailyPulseData({});
      setCreatedModuleId("");
      setCreatedDailyPulseId("");
    }
  }, [chatId, currentChatData]);

  const aiFeatures = [
    { icon: <LearningIcon />, label: "Create Module", active: true },
    { icon: <DailyPulseIcon />, label: "Daily Interaction", active: true },
    { icon: <AnalyticsIcon />, label: "Analytics", active: false },
    { icon: <CodeIcon />, label: "Custom Content", active: false },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const hasActiveOptions =
    messages.length > 0 &&
    messages[messages.length - 1].options &&
    messages[messages.length - 1].sender === "bot";

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const handleOptionSelect = (option: string) => {
    addMessage({ sender: "user", content: option });
    simulateTyping();

    setTimeout(() => {
      processUserResponse(option);
    }, 1500);
  };

  const handleTextSubmit = () => {
    if (!currentInput.trim() || hasActiveOptions) return;

    addMessage({ sender: "user", content: currentInput });
    simulateTyping();

    setTimeout(() => {
      processUserResponse(currentInput);
    }, 1500);

    setCurrentInput("");
  };

  const resetToMainMenu = () => {
    setCurrentStep(1);
    setCurrentFeature(null);
    setModuleData({});
    setDailyPulseData({});

    addMessage({
      sender: "bot",
      content: "What would you like to create next?",
      options: ["Learning Module", "Daily Interaction"],
      questionType: "options",
    });
  };

  const handleGoToModule = () => {
    setIsModalOpen(true);
  };

  const handleGoToDailyPulse = (dailyPulseId: string) => {
    window.open(`/admin/learnings/dailyInteraction/review/${dailyPulseId}`);
  };

  const renderMessageContent = (message: Message) => {
    if (message.elementType === "button" && message.elementData) {
      const { elementData } = message;

      if (elementData.moduleId) {
        return (
          <span>
            {message.content}&nbsp;
            <Button
              variant="outlined"
              size="small"
              sx={{ ml: 1 }}
              onClick={() => handleGoToModule()}
            >
              {elementData.text || "Go to Module"}
            </Button>
          </span>
        );
      } else if (elementData.dailyPulseId) {
        return (
          <span>
            {message.content}&nbsp;
            <Button
              variant="outlined"
              size="small"
              sx={{ ml: 1 }}
              onClick={() =>
                handleGoToDailyPulse(elementData.dailyPulseId!.toString())
              }
            >
              {elementData.text || "Go to Daily Interaction"}
            </Button>
          </span>
        );
      }
    }

    return message.content;
  };

  const processUserResponse = (response: string) => {
    // Step 1: Feature selection
    if (currentStep === 1) {
      if (response === "Learning Module") {
        setCurrentFeature(FeatureType.MODULE);
        setCurrentStep(2);
        addMessage({
          sender: "bot",
          content:
            "Great! Let's create a learning module. What type of module would you like to create?",
          options: ["Question Module"],
          questionType: "options",
        });
      } else if (response === "Daily Interaction") {
        setCurrentFeature(FeatureType.DAILY_PULSE);
        setCurrentStep(2);
        addMessage({
          sender: "bot",
          content:
            "Excellent choice! Let's create a daily interaction. How many pulses would you like to create?",
          options: ["1 interaction", "3 interactions", "4 interactions", "5 interactions"],
          questionType: "options",
        });
      }
      return;
    }

    // Handle Module Creation Flow
    if (currentFeature === FeatureType.MODULE) {
      switch (currentStep) {
        case 2:
          const selectedType =
            response === "Video Module"
              ? ModuleType.VIDEO
              : ModuleType.QUESTION;
          setModuleData((prev) => ({ ...prev, type: selectedType }));
          setCurrentStep(3);

          addMessage({
            sender: "bot",
            content:
              "Great choice! Now, what would you like to name this module?",
            questionType: "text",
          });
          break;

        case 3:
          setModuleData((prev) => ({ ...prev, title: response }));
          setCurrentStep(4);

          addMessage({
            sender: "bot",
            content: "Perfect! How long should this module take to complete?",
            options: ["5 minutes", "10 minutes", "15 minutes", "20 minutes"],
            questionType: "options",
          });
          break;

        case 4:
          setModuleData((prev) => ({ ...prev, duration: response }));
          setCurrentStep(5);

          if (moduleData.type === ModuleType.QUESTION) {
            addMessage({
              sender: "bot",
              content:
                "How many questions would you like in the content section?",
              options: [
                "3 questions",
                "5 questions",
                "8 questions",
                "10 questions",
              ],
              questionType: "options",
            });
          } else {
            addMessage({
              sender: "bot",
              content:
                "How many assessment questions would you like for this video module?",
              options: [
                "3 questions",
                "5 questions",
                "8 questions",
                "10 questions",
              ],
              questionType: "options",
            });
          }
          break;

        case 5:
          const count = parseInt(response.split(" ")[0]) || 5;
          if (moduleData.type === ModuleType.QUESTION) {
            setModuleData((prev) => ({ ...prev, questionsCount: count }));
            setCurrentStep(6);

            addMessage({
              sender: "bot",
              content: "And how many assessment questions would you like?",
              options: [
                "3 questions",
                "5 questions",
                "8 questions",
                "10 questions",
              ],
              questionType: "options",
            });
          } else {
            setModuleData((prev) => ({ ...prev, assessmentCount: count }));
            const modifiedModuleData = {
              ...moduleData,
              assessmentCount: count,
            };
            finalizeModule(modifiedModuleData);
          }
          break;

        case 6:
          const assessmentCount = parseInt(response.split(" ")[0]) || 3;
          setModuleData((prev) => ({
            ...prev,
            assessmentCount: assessmentCount,
          }));

          const modifiedModuleData = {
            ...moduleData,
            assessmentCount: assessmentCount,
          };
          finalizeModule(modifiedModuleData);
          break;
      }
    }

    // Handle Daily Pulse Creation Flow
    if (currentFeature === FeatureType.DAILY_PULSE) {
      switch (currentStep) {
        case 2:
          const pulseCount = parseInt(response.split(" ")[0]) || 1;
          setDailyPulseData((prev) => ({ ...prev, pulseCount }));
          setCurrentStep(3);

          addMessage({
            sender: "bot",
            content:
              "How many stars will be awarded for completing the daily interaction?",
            options: ["10 star", "20 stars", "30 stars", "50 stars"],
            questionType: "options",
          });
          break;

        case 3:
          const starsAwarded = parseInt(response.split(" ")[0]) || 1;
          setDailyPulseData((prev) => ({ ...prev, starsAwarded }));
          setCurrentStep(4);

          addMessage({
            sender: "bot",
            content: "What topic would you like the daily interaction to focus on?",
            questionType: "text",
          });
          break;

        case 4:
          setDailyPulseData((prev) => ({ ...prev, topic: response }));
          const modifiedDailyPulseData = { ...dailyPulseData, topic: response };
          finalizeDailyPulse(modifiedDailyPulseData);
          break;
      }
    }
  };

  const finalizeModule = (moduleData: ModuleData) => {
    const localMessages = [...messages];
    const userResponse: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: moduleData.title || "Topic",
      timestamp: new Date(),
    };
    localMessages.push(userResponse);

    const summaryMessage: Message = {
      id: Date.now().toString(),
      sender: "bot",
      content: `Excellent! I have all the information I need to create your "${
        moduleData.title
      }" module. Here's what I'll prepare for you:

📋 **Module Summary:**
- Type: ${moduleData.type === ModuleType.VIDEO ? "Video" : "Question"} Module
- Title: ${moduleData.title}
- Duration: ${moduleData.duration}
${
  moduleData.questionsCount
    ? `• Content Questions: ${moduleData.questionsCount}`
    : ""
}
- Assessment Questions: ${moduleData.assessmentCount}

🤖 **AI Magic in Progress:**
I'm now generating engaging content, relevant questions, and assessment materials tailored to your specifications. Your module will be ready within the next 48 hours!

You'll receive a notification once your module is complete and ready for review. Thank you for using Quickk AI! 🎉`,
      timestamp: new Date(),
    };

    setTimeout(() => {
      localMessages.push(summaryMessage);
      setMessages([...localMessages]); // Update UI
    }, 2000);

    CreateAIModule(moduleData)
      .unwrap()
      .then((result) => {
        const moduleId = result?.data?.moduleId;
        setCreatedModuleId(moduleId);

        const finalMessage: Message = {
          id: new Date().toISOString(),
          sender: "bot",
          content: "✅ Your module has been successfully created!",
          elementType: "button",
          elementData: {
            moduleId: moduleId,
            text: "Go to Module",
            action: "navigate",
          },
          timestamp: new Date(),
        };

        localMessages.push(finalMessage);
        setMessages([...localMessages]); // Update UI

        // Update chat on completion
        updateChatOnCompletion({
          chatId: chatId || "Temp", // Handle new chat case
          body: {
            title: moduleData.title || "New Learning Module",
            createdModuleId: moduleId,
            chatType: "module",
            status: "completed",
            messages: localMessages.map((msg) => ({
              ...msg,
              timestamp: msg.timestamp.toISOString(),
            })),
          },
        })
          .unwrap()
          .then((result) => {
            navigate(`/admin/quickk-ai/${result?.data.chat._id}`);
          });

        setTimeout(() => {
          resetToMainMenu();
        }, 3000);
      })
      .catch(() => {
        const errorMessage: Message = {
          id: Date.now().toString(),
          sender: "bot",
          content:
            "❌ Sorry, there was an error creating your module. Please try again later.",
          timestamp: new Date(),
        };

        localMessages.push(errorMessage);
        setMessages([...localMessages]); // Update UI
      });
  };

  const finalizeDailyPulse = (dailyPulseData: DailyPulseData) => {
    const localMessages = [...messages];
    const userResponse: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: dailyPulseData.topic || "Topic",
      timestamp: new Date(),
    };
    localMessages.push(userResponse);
    // Create first message manually and add to local array
    const firstMessage: Message = {
      id: Date.now().toString(),
      sender: "bot",
      content: `Perfect! I have all the information needed to create your daily interaction. Here's what I'll prepare for you:

🌟 **Daily Interaction Summary:**
- Number of Interactions: ${dailyPulseData.pulseCount}
- Stars Awarded: ${dailyPulseData.starsAwarded} ⭐
- Topic: ${dailyPulseData.topic}

🚀 **AI Magic in Progress:**
I'm now generating engaging daily interaction content focused on "${dailyPulseData.topic}". Your daily interaction will include:
- Bite-sized learning content
- Interactive elements to keep users engaged
- Star rewards system for completion
- Progress tracking capabilities

You'll receive a notification once it's complete and ready for deployment. Thank you for using Quickk AI! ✨`,
      timestamp: new Date(),
    };

    localMessages.push(firstMessage);
    setMessages([...localMessages]); // Update UI

    CreateAIDailyPulse(dailyPulseData)
      .unwrap()
      .then((result) => {
        const dailyPulseId = result?.data?.dailyPulseId;
        console.log("Daily Pulse ID:", dailyPulseId);
        setCreatedDailyPulseId(dailyPulseId);

        const finalMessage: Message = {
          id: new Date().toString(),
          sender: "bot",
          content: "✅ Your Daily Interaction has been successfully created!",
          elementType: "button",
          elementData: {
            dailyPulseId: dailyPulseId,
            text: "Go to Daily Interaction",
            action: "navigate",
          },
          timestamp: new Date(),
        };

        localMessages.push(finalMessage);
        setMessages([...localMessages]); // Update UI

        // Update chat on completion
        updateChatOnCompletion({
          chatId: chatId || "Temp", // Handle new chat case
          body: {
            title: dailyPulseData.topic || "New Daily Interaction",
            createdDailyPulseId: dailyPulseId,
            chatType: "dailyPulse",
            status: "completed",
            messages: localMessages.map((msg) => ({
              ...msg,
              timestamp: msg.timestamp.toISOString(),
            })),
          },
        });

        setTimeout(() => {
          resetToMainMenu();
        }, 3000);
      })
      .catch(() => {
        const errorMessage: Message = {
          id: Date.now().toString(),
          sender: "bot",
          content:
            "❌ Sorry, there was an error creating your Daily Interaction. Please try again later.",
          timestamp: new Date(),
        };

        localMessages.push(errorMessage);
        setMessages([...localMessages]); // Update UI
      });
  };

  const handleFeatureClick = (feature: any) => {
    if (feature.label === "Create Module") {
      setCurrentFeature(FeatureType.MODULE);
      setCurrentStep(2);
      addMessage({
        sender: "bot",
        content:
          "Let's create a learning module! What type of module would you like to create?",
        options: ["Question Module"],
        questionType: "options",
      });
    } else if (feature.label === "Daily Pulse") {
      setCurrentFeature(FeatureType.DAILY_PULSE);
      setCurrentStep(2);
      addMessage({
        sender: "bot",
        content:
          "Let's create a daily interaction! How many interactions would you like to create?",
        options: ["1 interaction", "3 interactions", "4 interactions", "5 interactions"],
        questionType: "options",
      });
    } else if (!feature.active) {
      addMessage({
        sender: "bot",
        content: `The ${feature.label} feature is coming soon! Currently, I can help you create learning modules and daily interactions. Stay tuned for more AI-powered features! 🚀`,
      });
    }
  };

  const handleChatSelect = (selectedChatId: string) => {
    navigate(`/admin/quickk-ai/${selectedChatId}`);
  };

  const handleNewChat = () => {
    navigate("/admin/quickk-ai");
  };

  const handleDeleteChat = async (chatIdToDelete: string) => {
    try {
      await deleteChat(chatIdToDelete).unwrap();
      if (chatId === chatIdToDelete) {
        navigate("/admin/quickk-ai");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleArchiveChat = async (chatIdToArchive: string) => {
    try {
      await updateChatOnCompletion({
        chatId: chatIdToArchive,
        body: {
          status: "archived",
        },
      }).unwrap();
    } catch (error) {
      console.error("Failed to archive chat:", error);
    }
  };

  const handleSearchChats = async (searchTerm: string) => {
    setSearchTerm(searchTerm);
    if (!searchTerm) return;
    try {
      await triggerSearch({ q: searchTerm }).unwrap();
    } catch (error) {
      console.error("Failed to archive chat:", error);
    }
  };

  if (isChatLoading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        color: "#e6edf3",
      }}
    >
      {/* Header with Logo */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid #30363d",
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ color: "#e6edf3", fontWeight: 600 }}>
            {currentFeature === FeatureType.MODULE
              ? "Create Learning Module"
              : currentFeature === FeatureType.DAILY_PULSE
              ? "Create Daily Pulse"
              : "AI Assistant"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#8b949e", mt: 0.5 }}>
            {currentFeature === FeatureType.MODULE
              ? "Let AI do the heavy lifting—create engaging modules with smart suggestions"
              : currentFeature === FeatureType.DAILY_PULSE
              ? "Create engaging daily interactions to keep your team motivated and learning"
              : "Choose what you'd like to create with AI assistance"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => setIsChatDrawerOpen(true)}
            sx={{
              color: "primary.main",
              "&:hover": {
                bgcolor: "primary.main20",
              },
            }}
          >
            <HistoryIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BotIcon sx={{ color: "primary.main", fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              Quickk AI
            </Typography>
          </Box>
        </Box>
      </Box>

      <LearningModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        CreatedModuleId={createdModuleId}
      />

      <ChatHistoryDrawer
        open={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        chats={
          searchTerm
            ? searchChatsData?.data?.chats || []
            : chatsData?.data?.chats || []
        }
        loading={isChatsLoading || isSearching}
        onDeleteChat={handleDeleteChat}
        onArchiveChat={handleArchiveChat}
        onSearchChats={handleSearchChats}
      />

      {/* Main Chat Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {messages.map((message) => (
          <Fade in key={message.id} timeout={500}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: message.sender === "bot" ? "primary.main" : "#238636",
                  width: 32,
                  height: 32,
                }}
              >
                {message.sender === "bot" ? (
                  <BotIcon fontSize="small" sx={{ color: "#000" }} />
                ) : (
                  <PersonIcon fontSize="small" />
                )}
              </Avatar>

              <Box sx={{ flexGrow: 1, maxWidth: "70%" }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#e6edf3",
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {renderMessageContent(message)}
                </Typography>

                {message.options && (
                  <Box
                    sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}
                  >
                    {message.options.map((option, index) => (
                      <Chip
                        key={index}
                        label={option}
                        onClick={() => handleOptionSelect(option)}
                        sx={{
                          bgcolor: "#21262d",
                          color: "#e6edf3",
                          border: "1px solid #30363d",
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: "primary.main20",
                            borderColor: "primary.main",
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Fade>
        ))}

        {isTyping && (
          <Fade in timeout={300}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                <BotIcon fontSize="small" sx={{ color: "#000" }} />
              </Avatar>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "#8b949e",
                }}
              >
                <CircularProgress size={16} sx={{ color: "primary.main" }} />
                <Typography variant="body2">AI is thinking...</Typography>
              </Box>
            </Box>
          </Fade>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 3,
          borderTop: "1px solid #30363d",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "flex-end",
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !hasActiveOptions) {
                e.preventDefault();
                handleTextSubmit();
              }
            }}
            placeholder={
              hasActiveOptions
                ? "Please select from the options above..."
                : "Type your message..."
            }
            disabled={hasActiveOptions}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: hasActiveOptions ? "#6b7280" : "#e6edf3",
                "& fieldset": {
                  borderColor: hasActiveOptions ? "#374151" : "#30363d",
                },
                "&:hover fieldset": {
                  borderColor: hasActiveOptions ? "#374151" : "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: hasActiveOptions ? "#374151" : "primary.main",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: hasActiveOptions ? "#6b7280" : "#8b949e",
                opacity: 1,
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#6b7280",
              },
            }}
          />

          <IconButton
            disabled={hasActiveOptions}
            sx={{
              color: hasActiveOptions ? "#6b7280" : "#8b949e",
              "&:hover": { color: hasActiveOptions ? "#6b7280" : "#e6edf3" },
            }}
          >
            <AttachFileIcon />
          </IconButton>

          <Button
            variant="contained"
            onClick={handleTextSubmit}
            disabled={!currentInput.trim() || hasActiveOptions}
            sx={{
              bgcolor: "primary.main",
              color: "#000",
              minWidth: "auto",
              px: 2,
              "&:hover": {
                bgcolor: "#7dd636",
              },
              "&:disabled": {
                bgcolor: "#374151",
                color: "#6b7280",
              },
            }}
          >
            <SendIcon fontSize="small" />
          </Button>
        </Box>
      </Box>

      {/* AI Features Panel */}
      <Box
        sx={{
          p: 3,
          borderTop: "1px solid #30363d",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: "#8b949e",
            mb: 2,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          What can I help you with?
        </Typography>

        <Grid container spacing={1}>
          {aiFeatures.map((feature, index) => (
            <Grid size={1.7} key={index}>
              <Paper
                onClick={() => handleFeatureClick(feature)}
                sx={{
                  p: 1,
                  bgcolor: feature.active ? "primary.main20" : "#21262d",
                  border: feature.active
                    ? "1px solid primary.main"
                    : "1px solid #30363d",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  opacity: feature.active ? 1 : 0.6,
                  "&:hover": {
                    bgcolor: feature.active ? "primary.main30" : "#30363d",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"space-around"}
                  alignItems={"center"}
                >
                  <Box
                    sx={{
                      color: feature.active ? "primary.main" : "#8b949e",
                      mb: 1,
                      display: "flex",
                      justifyContent: "center",
                      my: "auto",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "center",
                      color: feature.active ? "#e6edf3" : "#8b949e",
                      fontWeight: 500,
                    }}
                  >
                    {feature.label}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default QuickkAI;
