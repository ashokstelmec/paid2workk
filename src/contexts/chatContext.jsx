import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import * as signalR from "@microsoft/signalr";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

const ChatContext = createContext(null);

// Add debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export function ChatProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const roomId = location.state?.roomId || "";
  const userId = sessionStorage.getItem("NUserID") || "defaultUserId";
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [projectMilestones, setProjectMilestones] = useState(null);
  const [sideProfileDetails, setSideProfileDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [updateMsg, setUpdateMsg] = useState(false);
  const [loadingChat, setLoadingChat] = useState(true);
  const [inviteLoading, setInviteLoading] = useState({
    load: false,
    complete: false,
  });
  const [refetchMilestone, setRefetchMilestone] = useState(false);
  const lastFetchRef = useRef(0);
  const FETCH_COOLDOWN = 500; // Reduced cooldown for better realtime updates

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // 📨 Fetch Notifications
  const fetchNotifications = useCallback(
    async (conn) => {
      const currentConnection = conn || connection;
      if (!currentConnection) return;

      try {
        await currentConnection.invoke("GetNotifications", userId);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    },
    [connection, userId]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[activeContact])

  // 📨 Fetch Inbox Messages
  const fetchInboxMessages = useCallback(
    async (conn) => {
      const currentConnection = conn || connection;
      const now = Date.now();

      // Add cooldown check
      if (now - lastFetchRef.current < FETCH_COOLDOWN) {
        // console.log("🔄 Skipping fetch - cooldown active");
        return;
      }

      if (
        !currentConnection ||
        currentConnection.state !== signalR.HubConnectionState.Connected
      ) {
        console.warn("⚠️ SignalR not connected, skipping fetch");
        return;
      }

      lastFetchRef.current = now;

      try {
        // console.log("📥 Fetching inbox messages...");
        const inboxMessages = await currentConnection.invoke(
          "GetInboxMessages", // Changed from GetRealtimeInboxMessages to GetInboxMessages
          userId
        );
        // console.log("✅ Inbox messages received:", inboxMessages);
        // console.log(inboxMessages)
        // Handle the direct array structure
        setUnreadMessages(
          inboxMessages.filter(
            (m) => m.readtime === null && m.senderId !== userId
          ).length
        );
        if (Array.isArray(inboxMessages)) {
          const contactMap = {};
          inboxMessages.forEach((msg) => {
            
            
            // Determine the opposite user ID
            const oppositeUserId =
              msg.senderId === userId ? msg.receiverId : msg.senderId;

            // Sort the user IDs (current user and opposite user)
            const sortedUsers = [userId, oppositeUserId].sort();

            // Generate the uniqueKey with projectId (if present) and sorted user IDs
            const uniqueKey = msg.nProjectId
              ? `${msg.nProjectId}_${sortedUsers[0]}_${sortedUsers[1]}`
              : `${sortedUsers[0]}_${sortedUsers[1]}`;

            if (!contactMap[uniqueKey]) {
              contactMap[uniqueKey] = {
                id: uniqueKey,
                name: msg.oppositeUserName || `User ${oppositeUserId}`,
                avatar: msg.oppositeUserPhoto || "/default-avatar.png",
                projectId: msg.nProjectId,
                projectName: msg.projectName,
                lastMessage: msg.content,
                timestamp: msg.timestamp
                  ? new Date(msg.timestamp)
                  : new Date(0),
                unread: !msg.isRead,
                ReceiverId: oppositeUserId,
                SenderId: userId,
                freelancerId: msg.freelancerId,
                forwardto: oppositeUserId,
                button: msg.button,
                readTime: msg.readtime,
                type: msg.type,
                unreadCount: msg.unreadMessagesCount,
                feedbackId: msg.feedbackId,
                rating: msg.rating,
                description: msg.description,

              };
            } else {
              // Optional: Update lastMessage and unread if newer message arrives
              const existing = contactMap[uniqueKey];
              const existingTime = new Date(existing.timestamp);
              const newTime = msg.timestamp
                ? new Date(msg.timestamp)
                : new Date(0);
              if (newTime > existingTime) {
                existing.lastMessage = msg.content;
                existing.timestamp = newTime;
                existing.unread = !msg.isRead;
                existing.unreadCount = msg.unreadMessagesCount;
              }
            }
          });

          const sortedContacts = Object.values(contactMap).sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );

          setContacts(sortedContacts);
          // console.log("Processed Contacts:", sortedContacts);
        }
      } catch (error) {
        console.error("❌ Error fetching inbox messages:", error);
      }
    },
    [userId, connection, contacts, roomId]
  );

  // Create debounced version of fetchInboxMessages (only for non-critical operations)
  const debouncedFetchInboxMessages = useCallback(
    debounce((conn) => fetchInboxMessages(conn), 300), // Reduced debounce time
    [fetchInboxMessages]
  );

  // 🔄 Enhanced SignalR Connection Management
  const ensureConnection = useCallback(async () => {
    // Return existing connection if healthy
    if (connection?.state === signalR.HubConnectionState.Connected) {
      return connection;
    }

    // If already connecting, return the pending promise
    if (isConnecting) {
      return new Promise((resolve) => {
        const maxWaitTime = 10000; // 10 seconds max wait
        const startTime = Date.now();

        const checkConnection = setInterval(() => {
          if (connection?.state === signalR.HubConnectionState.Connected) {
            clearInterval(checkConnection);
            resolve(connection);
          } else if (Date.now() - startTime > maxWaitTime) {
            clearInterval(checkConnection);
            resolve(null);
          }
        }, 100);
      });
    }

    setIsConnecting(true);
    setConnectionStatus("connecting");

    try {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(
          `https://paid2workk.solarvision-cairo.com/chat?userId=${userId}`,
          {
            withCredentials: false,
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
          }
        )
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Exponential backoff with max delay of 10 seconds
            return Math.min(retryContext.previousRetryCount * 1000, 10000);
          },
        })
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      // Enhanced connection state handling
      newConnection.onclose((error) => {
        setConnectionStatus("disconnected");
        if (error) {
          console.warn("Connection closed with error:", error);
          // Attempt to reconnect if not already doing so
          if (!isConnecting) {
            setTimeout(() => ensureConnection(), 1000);
          }
        }
      });

      newConnection.onreconnecting((error) => {
        setConnectionStatus("reconnecting");
        console.warn("Connection lost, attempting to reconnect...", error);
      });

      newConnection.onreconnected((connectionId) => {
        setConnectionStatus("connected");
        // console.log("Reconnected with ID:", connectionId);
        // Refresh all data after reconnection
        Promise.all([
          fetchInboxMessages(newConnection),
          fetchNotifications(newConnection),
        ]).catch((err) =>
          console.error("Reconnection data refresh failed:", err)
        );
      });

      // Enhanced notification handling with deduplication
      newConnection.on("ReceiveNotificationList", (notificationList) => {
        setNotifications((prev) => {
          // Deduplicate notifications
          const uniqueNotifications = notificationList.filter(
            (newNotif) =>
              !prev.some((p) => p.nNotificationId === newNotif.nNotificationId)
          );
          return [...uniqueNotifications, ...prev];
        });
        setUnreadCount(notificationList.filter((n) => !n.isRead).length);
      });

      newConnection.on("ReceiveNotification", (notification) => {
        setNotifications((prev) => {
          // Check for duplicates before adding
          if (
            prev.some((n) => n.nNotificationId === notification.nNotificationId)
          ) {
            return prev;
          }
          return [notification, ...prev];
        });
        setUnreadCount((prev) => prev + 1);

        // Acknowledge receipt of notification
        if (newConnection.state === signalR.HubConnectionState.Connected) {
          newConnection
            .invoke("AcknowledgeNotification", notification.nNotificationId)
            .catch((err) =>
              console.error("Failed to acknowledge notification:", err)
            );
        }

        // Refresh notifications immediately
        fetchNotifications(newConnection);

        // Debounced inbox refresh
        setTimeout(() => fetchInboxMessages(newConnection), 100);
      });

      newConnection.on("NotificationRead", (notificationId) => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.nNotificationId === notificationId
              ? { ...n, isRead: true, status: "Read" }
              : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        fetchNotifications(newConnection);
      });

      await newConnection.start();
      // console.log("✅ SignalR connected successfully");
      setConnection(newConnection);
      setConnectionStatus("connected");
      setIsConnecting(false);

      await fetchInboxMessages(newConnection);
      await fetchNotifications(newConnection);
      return newConnection;
    } catch (error) {
      console.error("❌ SignalR connection failed:", error);
      setIsConnecting(false);
      setConnectionStatus("failed");
    }
  }, [
    userId,
    isConnecting,
    connection,
    debouncedFetchInboxMessages,
    fetchNotifications,
  ]);

  // 📡 Initialize Connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        await ensureConnection();
      } catch (error) {
        console.error("Failed to initialize connection:", error);
      }
    };
    initializeConnection();
    return () => {
      connection?.stop();
    };
  }, []);

  // 🔔 Setup Event Listeners
  useEffect(() => {
    if (!connection) return;

    connection.on("receiveInboxMessages", (inboxData) => {
      // console.log("📬 Inbox update received:", inboxData);
      // Optionally refresh or directly update state here
      fetchInboxMessages(connection);
    });

    // Handle inbox message updates - now immediate
    connection.on("ReceiveInboxUpdate", () => {
      fetchInboxMessages(connection);
    });

    // Initial fetch when the connection is established
    if (connection.state === signalR.HubConnectionState.Connected) {
      debouncedFetchInboxMessages(connection);
    }

    // Handle receiving messages
    connection.on(
      "ReceiveMessage",
      (senderId, receiverId, content, filePaths, projectId, type) => {
        if (
          activeContact?.forwardto === senderId ||
          activeContact?.forwardto === receiverId
        ) {
          fetchMessages(activeContact);
          ensureConnection()
            .then((conn) => {
              if (conn) {
                conn
                  .invoke(
                    "MarkMessagesAsRead",
                    userId || senderId,
                    activeContact?.forwardto || receiverId,
                    activeContact?.projectId || projectId
                  )
                  .catch((err) => {
                    console.error(
                      "❌ MarkMessagesAsRead invocation failed:",
                      err
                    );
                  });
              }
            })
            .catch((err) => {
              console.error("❌ ensureConnection failed:", err);
            });
          setUpdateMsg((prev) => !prev);
        } else {
          setUpdateMsg((prev) => !prev);
        }
        // Toggle updateMsg to trigger any necessary UI updates
        // setUpdateMsg((prev) => !prev);
      }
    );

    connection.on("ReceiveQutationUpdate", () => {
      handleContactClick(activeContact);
    });

    return () => {
      connection.off("ReceiveInboxUpdate");
      connection.off("receiveInboxMessages");
      connection.off("ReceiveMessage");
      connection.off("ReceiveQutationUpdate");
      connection.off("ReceiveNotificationList");
      connection.off("ReceiveNotification");
      connection.off("NotificationRead");
    };
  }, [
    connection,
    debouncedFetchInboxMessages,
    activeContact,
    fetchNotifications,
  ]);

  const markNotificationAsRead = useCallback(
    async (notificationId) => {
      if (!connection) return;
      try {
        await connection.invoke("MarkNotificationAsRead", notificationId);
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [connection]
  );

  // 💬 Fetch Chat Messages
  const fetchMessages = useCallback(
    async (contact) => {
      if (!contact?.id) return;

      try {
        const conn = await ensureConnection();
        if (!conn) throw new Error("No connection available");

        // Simplify parameters and ensure correct types
        const senderId = contact.SenderId;
        const receiverId = contact.ReceiverId;
        const projectId = contact.projectId || "0";

        // console.log("📨 Fetching chat messages with params:", {
        //   senderId,
        //   receiverId,
        //   projectId,
        // });
        if (!conn) throw new Error("No connection available");
        // Try invoking with simplified parameters
        const response = await conn.invoke(
          "GetChatMessages",
          senderId,
          receiverId,
          projectId
        );

        // console.log("📥 Raw response:", response);

        // Handle the response even if it's not an array
        const messageArray = Array.isArray(response) ? response : [];

        const formattedMessages = messageArray.map((msg) => ({
          id: String(msg?.messageId || Date.now()),
          sender: String(msg?.senderId || ""),
          receiver: String(msg?.receiverId || ""),
          content: String(msg?.content || ""),
          type: String(msg?.type),
          projectId: String(msg?.nProjectId),
          projectName: String(msg?.projectName),
          attachment: msg?.filePath ? [String(msg.filePath)] : null,
          timestamp: msg?.timestamp || new Date().toISOString(),
          milestoneId: msg?.milestoneId || "",
          freelancerId: msg?.freelancerId || "",
          feedbackId: msg?.feedbackId ||"",
          rating: msg?.rating || 0,
          description: msg?.description || "",
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("❌ Chat messages error:", {
          message: error.message,
          contact,
          userId,
          errorName: error.name,
          errorStack: error.stack,
        });
        setMessages([]);
      } finally {
        setLoadingChat(false);
      }
    },
    [userId, ensureConnection, updateMsg]
  );

  // 💬 Fetch Chat Quotation Details
  const fetchQuotationDetails = useCallback(
    async (contact) => {
      if (!contact?.id) return;

      try {
        const conn = await ensureConnection();
        if (!conn) throw new Error("No connection available");
        const role = sessionStorage.getItem("roleId") || "0";
        const userId = sessionStorage.getItem("NUserID");

        const clientId = role === "0" ? userId : contact.forwardto;
        const freelancerId = role === "1" ? userId : contact.forwardto;
        const projectId = contact.projectId;

        // Simplify parameters and ensure correct types

        if (!conn) throw new Error("No connection available");
        // Try invoking with simplified parameters
        const response = await conn.invoke(
          "GetMilestoneDetails",
          projectId,
          freelancerId,
          clientId
        );

        const selectedData = response[0];
        setProjectMilestones(selectedData);
        // console.log("📥 Quotation details:", selectedData);
      } catch (error) {
        console.error("❌ Chat messages error:", {
          message: error.message,
          contact,
          userId,
          errorName: error.name,
          errorStack: error.stack,
        });
      } finally {
        setLoadingChat(false);
      }
    },
    [userId, ensureConnection, updateMsg]
  );

  //  Fetch User Details
  const fetchUserDetails = useCallback(
    async (contact) => {
      if (!contact?.id) return;
      setLoadingChat(true);
      try {
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/GetUserPersonalDetails?nUserID=${contact?.forwardto}`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const selectedData = data[0];
        setSideProfileDetails(selectedData);

        if (!selectedData) {
          throw new Error("No data found for the given user ID");
        }
      } catch (error) {
        console.error("Error fetching freelancer details:", error);
      } finally {
        setLoadingChat(false);
      }
    },
    [userId, ensureConnection, updateMsg]
  );

  // First define handleContactClick
  const handleContactClick = useCallback(
    async (contact) => {
      if (!contact) return;

      try {
        const contactData = contact.fromNotification
          ? contact
          : contacts.find(
              (c) =>
                c.id === contact.id ||
                (c.forwardto === contact.forwardto &&
                  c.projectId === contact.projectId)
            ) || contact;

        setActiveContact(contactData);
        setMessages([]);
          
        console.log(contactData);
        const conn = await ensureConnection();
        if (conn) {
          await conn.invoke(
            "JoinChatRoom",
            userId,
            contactData.forwardto,
            contactData.projectId
          );
          await conn.invoke(
            "MarkMessagesAsRead",
            userId,
            contactData.forwardto,
            contactData.projectId
          );

          setLoadingChat(true);
          await Promise.all([
            fetchMessages(contactData),
            fetchQuotationDetails(contactData),
            fetchUserDetails(contactData),
          ]);
        }
      } catch (error) {
        console.error("Error in handleContactClick:", error);
        setMessages([]);
      }
    },
    [
      userId,
      contacts,
      ensureConnection,
      fetchMessages,
      fetchQuotationDetails,
      fetchUserDetails,
    ]
  );

  // Update handleNotificationClick
  const handleNotificationClick = useCallback(
    async (notification) => {
      try {
        // console.log("Processing notification:", notification);

        // Optimistically update UI first
        setNotifications((prev) =>
          prev.map((n) =>
            n.nNotificationId === notification.nNotificationId
              ? { ...n, isRead: true, status: "Read" }
              : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Mark as read on server
        if (!notification.isRead) {
          await markNotificationAsRead(notification.nNotificationId);
        }

        // Refresh notifications immediately
        await fetchNotifications();
        console.log(notification)
        console.log(contacts)
        const notificationContact = contacts.find(
          (c) => c.id === notification.link
        );

        if (
          notification.notificationType !== "milestoneCompleted" &&
          notification.notificationType !== "feedback" &&
          notification.notificationType !== "paymentReleased" &&
          notification.notificationType !== "releaseRequest"
        ) {
          if (notificationContact) {
            await handleContactClick(notificationContact);
            navigate("/messages", {
              state: {
                roomId: notificationContact.id || notificationContact.contactId,
              },
            });
          }
        } else {
          if(notification.notificationType === "feedback"){
            navigate(`/projects/details/${notification.link}`, {state: {tab: ""}});
          } else {
            navigate(`/projects/details/${notification.link}`);
          }
          
        }
      } catch (error) {
        console.error("Error in handleNotificationClick:", error, notification);
        // Revert optimistic update if error occurs
        setNotifications((prev) =>
          prev.map((n) =>
            n.nNotificationId === notification.nNotificationId
              ? {
                  ...n,
                  isRead: notification.isRead,
                  status: notification.status,
                }
              : n
          )
        );
        setUnreadCount((prev) => (notification.isRead ? prev : prev + 1));
      }
    },
    [
      userId,
      navigate,
      handleContactClick,
      markNotificationAsRead,
      fetchNotifications,
      contacts,
    ]
  );

  //? Sending Functions (Messages + Notifications)

  const sendMessage = async (content, type, attachment) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("❌ SignalR connection not established.");
      return;
    }

    if (!activeContact) {
      console.error("❌ No active contact selected.");
      return;
    }
    const params = {
      senderId: String(userId),
      receiverId: String(activeContact.forwardto),
      content,
      type,
      projectId: String(activeContact.projectId),
      projectName: String(activeContact.projectName || ""),
      freelancerId: String(activeContact.freelancerId || userId),
      filePaths: attachment ? [String(attachment)] : null,
      milestoneId: null,
    };

    try {
      await connection.invoke("SendMessage", ...Object.values(params));

      await connection.invoke(
        "GetInboxMessages",
        String(activeContact.forwardto)
      );
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  const sendMilestoneMessageFromDetails = async (
    content,
    type,
    sender,
    receiver,
    projectId,
    projectName,
    freelancerId,
    milestoneId
  ) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("❌ SignalR connection not established.");
      return;
    }

    const params = {
      senderId: sender,
      receiverId: receiver,
      content,
      type,
      projectId,
      projectName,
      freelancerId,
      filePaths: null,
      milestoneId,
    };

    try {
      await connection.invoke("SendMessage", ...Object.values(params));
    } catch (error) {
      console.error("❌ Error sending notification:", error);
    }
  };

  const paymentStatusMessage = async (content, type, attachment = null) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("❌ SignalR connection not established.");
      return;
    }

    if (!activeContact) {
      console.error("❌ No active contact selected.");
      return;
    }

    const clientId =
      sessionStorage.getItem("roleId") === "0"
        ? userId === activeContact.SenderId
          ? activeContact.SenderId
          : activeContact.ReceiverId
        : userId === activeContact.SenderId
        ? activeContact.ReceiverId
        : activeContact.SenderId;

    const params = {
      senderId: String(userId),
      receiverId: String(activeContact.forwardto),
      content,
      type,
      projectId: String(activeContact.projectId),
      projectName: String(activeContact.projectName || ""),
      freelancerId: String(activeContact.freelancerId || userId),
      filePaths: attachment ? [String(attachment)] : null,
      milestoneId: null,
    };

    const notificationParams = {
      senderId: String(userId),
      receiverId: String(activeContact.forwardto),
      content,
      notificationType: "paymentStatus",
      projectId: String(activeContact.projectId),
      link: `${activeContact.projectId}_${clientId}_${activeContact.freelancerId}`,
    };

    try {
      await connection.invoke("SendMessage", ...Object.values(params));

      await connection.invoke(
        "SendNotification",
        ...Object.values(notificationParams)
      );
      await handleContactClick(activeContact);
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  const requestQuotation = async (
    content,
    type = "quotation_request",
    attachment = null
  ) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("❌ SignalR connection not established.");
      return;
    }

    if (!activeContact) {
      console.error("❌ No active contact selected.");
      return;
    }

    const clientId =
      sessionStorage.getItem("roleId") === "0"
        ? userId === activeContact.SenderId
          ? activeContact.SenderId
          : activeContact.ReceiverId
        : userId === activeContact.SenderId
        ? activeContact.ReceiverId
        : activeContact.SenderId;

    const params = {
      senderId: String(userId),
      receiverId: String(activeContact.forwardto),
      content,
      type,
      projectId: String(activeContact.projectId),
      projectName: String(activeContact.projectName || ""),
      freelancerId: String(activeContact.freelancerId || userId),
      filePaths: attachment ? [String(attachment)] : null,
      milestoneId: null,
    };

    const notificationParams = {
      senderId: String(userId),
      receiverId: String(activeContact.forwardto),
      content: String(activeContact.projectName || ""),
      notificationType: "quotation_request",
      projectId: String(activeContact.projectId),
      link: `${activeContact.projectId}_${clientId}_${activeContact.freelancerId}`,
    };

    try {
      await connection.invoke("SendMessage", ...Object.values(params));
      await connection.invoke(
        "SendNotification",
        ...Object.values(notificationParams)
      );
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  const sendQuotation = async (
    quotationData, // contains title, type, currency, items, total
    type = "quotation",
    attachment = null
  ) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("❌ SignalR connection not established.");
      return;
    }

    if (!activeContact) {
      console.error("❌ No active contact selected.");
      return;
    }

    const clientId =
      sessionStorage.getItem("roleId") === "0"
        ? userId === activeContact.SenderId
          ? activeContact.SenderId
          : activeContact.ReceiverId
        : userId === activeContact.SenderId
        ? activeContact.ReceiverId
        : activeContact.SenderId;

    try {
      const apiData = {
        title: quotationData.title,
        paidBy: quotationData.type, // dynamically from form
        nProjectId: String(activeContact.projectId),
        freelancerId: String(activeContact.freelancerId || userId),
        clientId: String(clientId),
        currency: quotationData.currency,
        totalAmount: Number(quotationData.total.split(" ")[1]),
        totalTime: quotationData.total.split(" ")[0],
        createdBy: String(userId),
        updatedBy: String(userId),
        milestones: quotationData.items.map((item) => ({
          milestoneTitle: item.description,
          time: item.time,
          amount: Number(item.price),
        })),
      };

      // **IMPORTANT: Wrap in an array**
      const response = await axios.post(
        "https://paid2workk.solarvision-cairo.com/api/Quotation/CreateQuotationWithMilestones",
        [apiData], // <<=== Wrapping in array!
        { headers: { "Content-Type": "application/json" } }
      );

      // STEP 3: Notify client via SignalR
      const params = {
        senderId: String(userId),
        receiverId: String(activeContact.forwardto),
        content: quotationData.title,
        type,
        projectId: String(activeContact.projectId),
        projectName: String(activeContact.projectName || ""),
        freelancerId: String(activeContact.freelancerId || userId),
        filePaths: attachment ? [String(attachment)] : null,
        milestoneId: response.data.quotationId,
      };

      const notificationParams = {
        senderId: String(userId),
        receiverId: String(activeContact.forwardto),
        content: quotationData.title,
        notificationType: "quotation",
        projectId: String(activeContact.projectId),
        link: `${activeContact.projectId}_${clientId}_${activeContact.freelancerId}`,
      };

      await connection.invoke("SendMessage", ...Object.values(params));
      await connection.invoke(
        "SendNotification",
        ...Object.values(notificationParams)
      );
      fetchInboxMessages(activeContact);
    } catch (error) {
      console.error(
        "❌ Error sending quotation:",
        error?.response?.data || error.message
      );
    }
  };

  const awardedProject = async (
    data, // contains title, type, currency, items, total
    type = "projectAward",
    attachment = null
  ) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("❌ SignalR connection not established.");
      return;
    }

    try {
      // STEP 3: Notify client via SignalR
      const params = {
        senderId: String(userId),
        receiverId: String(data.forwardto),
        content: data.content,
        type,
        projectId: String(data.projectId),
        projectName: String(data.projectName || ""),
        freelancerId: String(data.forwardto || userId),
        filePaths: attachment ? [String(attachment)] : null,
        milestoneId: null,
      };

      const notificationParams = {
        senderId: String(userId),
        receiverId: String(data.forwardto),
        content: data.projectName,
        notificationType: "projectAward",
        projectId: String(data.projectId),
        link: `${data.projectId}_${userId}_${data.forwardto}`,
      };

      await connection.invoke("SendMessage", ...Object.values(params));
      await connection.invoke(
        "SendNotification",
        ...Object.values(notificationParams)
      );
      const room = `${data.projectId}_${userId}_${data.forwardto}`;
      await handleContactClick(contacts.find((c) => c.id === room));
    } catch (error) {
      console.error(
        "❌ Error sending quotation:",
        error?.response?.data || error.message
      );
    }
  };

  const sendProfileMessage = async (
    content,
    type,
    attachment,
    id,
    roomId,
    alt
  ) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("❌ SignalR connection not established.");
      return;
    }

    const contact = {
      id: roomId,
      name: alt?.name || "",
      avatar: alt?.avatar || "",
      projectId: "null",
      projectName: "",
      lastMessage: content,
      timestamp: new Date().toISOString(),
      ReceiverId: id,
      SenderId: userId,
      freelancerId: id,
      forwardto: id,
      button: false,
      unreadCount: 0,
    };

    handleContactClick(contact);

    const params = {
      senderId: String(userId),
      receiverId: String(id),
      content,
      type,
      projectId: "null",
      projectName: "",
      freelancerId: String(id),
      filePaths: attachment,
      milestoneId: null,
    };

    try {
      await connection.invoke("SendMessage", ...Object.values(params));
      navigate("/messages", { state: { roomId: roomId } });
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  const sendInvite = async (content, type, attachment, details) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("❌ SignalR connection not established.");
      toast.error("Connection lost. Please try again.");
      return false;
    }

    const notificationParams = {
      senderId: String(userId),
      receiverId: String(details.freelancerId),
      content: details.projectName,
      notificationType: "jobInvite",
      projectId: String(details.projectId),
      link: `${details.projectId}_${userId}_${details.freelancerId}`,
    };
    const params = {
      senderId: String(userId),
      receiverId: String(details.receiverId),
      content,
      type,
      projectId: String(details.projectId),
      projectName: String(details.projectName || ""),
      freelancerId: String(details.freelancerId || userId),
      filePaths: attachment,
      milestoneId: null,
    };

    const roomId = `${details.projectId}_${userId}_${details.freelancerId}`;
    const contact = contacts.find((c) => c.id === roomId);

    try {
      await connection.invoke("SendMessage", ...Object.values(params));
      await connection.invoke(
        "SendNotification",
        ...Object.values(notificationParams)
      );
      setTimeout(() => {
        navigate("/messages", { state: { roomId: roomId } });
      }, 2500);

      return true;
    } catch (error) {
      console.error("❌ Error sending invite:", error);
      toast.error("Failed to send invite. Please try again.");
      return false;
    }
  };

  const sendResponse = async (content, type, milestoneId, res) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("❌ SignalR connection not established.");
      return;
    }

    if (!activeContact) {
      console.error("❌ No active contact selected.");
      return;
    }

    const clientId =
      sessionStorage.getItem("roleId") === "0"
        ? userId === activeContact.SenderId
          ? activeContact.SenderId
          : activeContact.ReceiverId
        : userId === activeContact.SenderId
        ? activeContact.ReceiverId
        : activeContact.SenderId;

    const params = {
      senderId: String(userId),
      receiverId: String(activeContact.forwardto),
      content,
      type,
      projectId: String(activeContact.projectId),
      projectName: String(activeContact.projectName || ""),
      freelancerId: String(activeContact.freelancerId || userId),
      filePaths: null,
      milestoneId,
    };

    const clientMessage = {
      senderId: String(userId),
      receiverId: String(activeContact.forwardto),
      content: "Complete the payment to proceed.",
      type: "payment",
      projectId: String(activeContact.projectId),
      projectName: String(activeContact.projectName || ""),
      freelancerId: String(activeContact.freelancerId || userId),
      filePaths: null,
      milestoneId,
    };
    const notificationParams = {
      senderId: String(userId),
      receiverId: String(activeContact.forwardto),
      content,
      notificationType: type,
      projectId: String(activeContact.projectId),
      link: `${activeContact.projectId}_${clientId}_${activeContact.freelancerId}`,
    };
    const notificationParamsClient = {
      senderId: String(activeContact.freelancerId),
      receiverId: String(clientId),
      content: String(activeContact.projectName || ""),
      notificationType: "payment",
      projectId: String(activeContact.projectId),
      link: `${activeContact.projectId}_${clientId}_${activeContact.freelancerId}`,
    };

    try {
      await connection.invoke("SendMessage", ...Object.values(params));
      await connection.invoke(
        "SendNotification",
        ...Object.values(notificationParams)
      );
      await connection.invoke(
        "GetInboxMessages",
        String(activeContact.forwardto)
      );

      if (res === "Accepted") {
        await connection.invoke("SendMessage", ...Object.values(clientMessage));
        await connection.invoke(
          "SendNotification",
          ...Object.values(notificationParamsClient)
        );
      }

      setRefetchMilestone((prev) => !prev);
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  const sendMilestoneNotificationFromDetails = async (
    content,
    type,
    sender,
    receiver,
    projectId
  ) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("❌ SignalR connection not established.");
      return;
    }

    const notificationParams = {
      senderId: sender,
      receiverId: receiver,
      content,
      notificationType: type,
      projectId: projectId,
      link: `${projectId}`,
    };

    try {
      await connection.invoke(
        "SendNotification",
        ...Object.values(notificationParams)
      );
    } catch (error) {
      console.error("❌ Error sending notification:", error);
    }
  };

  const sendMilestoneNotification = async (content, type) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("❌ SignalR connection not established.");
      return;
    }

    const notificationParams = {
      senderId: String(userId),
      receiverId: String(activeContact.forwardto),
      content,
      notificationType: type,
      projectId: String(activeContact.projectId),
      link: `${activeContact.projectId}`,
    };

    try {
      await connection.invoke(
        "SendNotification",
        ...Object.values(notificationParams)
      );
    } catch (error) {
      console.error("❌ Error sending notification:", error);
    }
  };

  const sendFeedbackMessage = async (
    senderId,
    receiverId,
    projectId,
    projectName,
    content,
    type,
    freelancerId,
    feedbackId,
    rating,
    description
  ) => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("❌ SignalR connection not established.");
      return;
    }

    const params = {
      senderId,
      receiverId,
      content,
      type,
      projectId,
      projectName,
      freelancerId,
      filePaths: null,
      milestoneId: null,
      feedbackId,
      rating,
      description,
    };
    try {
      await connection.invoke("SendFeedBack", ...Object.values(params));
      // console.log("Sent Feedback Message: ", params);
      
    } catch (error) {
      console.error("❌ Error sending feedback in messages:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        contacts,
        activeContact,
        setActiveContact,
        handleContactClick,
        handleNotificationClick,
        messages,
        sendMessage,
        loadingChat,
        requestQuotation,
        sendQuotation,
        sendInvite,
        sendProfileMessage,
        ensureConnection,
        inviteLoading,
        setInviteLoading,
        isConnecting,
        awardedProject,
        sendResponse,
        refetchMilestone,
        projectMilestones,
        paymentStatusMessage,
        sideProfileDetails,
        notifications,
        unreadCount,
        markNotificationAsRead,
        fetchNotifications,
        sendMilestoneNotification,
        sendMilestoneNotificationFromDetails,
        sendMilestoneMessageFromDetails,
        unreadMessages,
        sendFeedbackMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
