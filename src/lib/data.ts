export interface Message {
  id: string;
  chat_id: string;
  sender: string;
  timestamp: Date;
  text: string;
}

export interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  participants?: string[];
  avatar?: string;
}

export interface ChatSummary {
  chat_id: string;
  summary: string;
  keyPoints: string[];
  notableMessages: Message[];
  messageCount: number;
}

export interface Highlight {
  type: 'event' | 'decision' | 'action' | 'link' | 'deadline';
  text: string;
  chat_id: string;
  chat_name: string;
  timestamp: Date;
}

// Sample data
export const sampleChats: Chat[] = [
  { id: '1', name: 'Event Planning 🎉', isGroup: true, participants: ['Sarah', 'Mike', 'Emma', 'John', 'Lisa'] },
  { id: '2', name: 'Family Group 👨‍👩‍👧‍👦', isGroup: true, participants: ['Mom', 'Dad', 'Sister', 'Brother'] },
  { id: '3', name: 'Work Team', isGroup: true, participants: ['Alice', 'Bob', 'Charlie', 'Diana'] },
  { id: '4', name: 'Gym Buddies 💪', isGroup: true, participants: ['Tom', 'Jerry', 'Max'] },
  { id: '5', name: 'Sarah Miller', isGroup: false },
  { id: '6', name: 'John (Work)', isGroup: false },
];

const today = new Date();
const setTime = (hours: number, minutes: number) => {
  const d = new Date(today);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

export const sampleMessages: Message[] = [
  // Event Planning chat
  { id: 'm1', chat_id: '1', sender: 'Sarah', timestamp: setTime(9, 15), text: "Hey everyone! So excited for the birthday party this Saturday! 🎂" },
  { id: 'm2', chat_id: '1', sender: 'Mike', timestamp: setTime(9, 18), text: "Can't wait! What time should we arrive?" },
  { id: 'm3', chat_id: '1', sender: 'Emma', timestamp: setTime(9, 22), text: "The venue opens at 6 PM. Let's all try to be there by 5:45 to help set up." },
  { id: 'm4', chat_id: '1', sender: 'John', timestamp: setTime(9, 30), text: "I'll bring the decorations. Got balloons and banners ready!" },
  { id: 'm5', chat_id: '1', sender: 'Lisa', timestamp: setTime(9, 45), text: "I'm ordering the cake from Sweet Treats Bakery. 3-tier chocolate cake as we discussed ✅" },
  { id: 'm6', chat_id: '1', sender: 'Sarah', timestamp: setTime(10, 0), text: "Perfect! Here's the venue link: https://venue.example.com/skylounge" },
  { id: 'm7', chat_id: '1', sender: 'Mike', timestamp: setTime(10, 15), text: "Just confirmed - DJ is booked from 7 PM to 11 PM" },
  { id: 'm8', chat_id: '1', sender: 'Emma', timestamp: setTime(11, 30), text: "Everyone agreed on $50 each for the gift, right? I'll collect venmo" },
  { id: 'm9', chat_id: '1', sender: 'John', timestamp: setTime(12, 0), text: "Confirmed! Sent you $50" },
  { id: 'm10', chat_id: '1', sender: 'Lisa', timestamp: setTime(14, 30), text: "Reminder: RSVP deadline is tomorrow! We need final headcount for catering" },
  
  // Family Group
  { id: 'm11', chat_id: '2', sender: 'Mom', timestamp: setTime(8, 0), text: "Good morning sweethearts! ☀️" },
  { id: 'm12', chat_id: '2', sender: 'Dad', timestamp: setTime(8, 5), text: "Don't forget Sunday dinner at our place! 5 PM" },
  { id: 'm13', chat_id: '2', sender: 'Sister', timestamp: setTime(8, 30), text: "I'll be there! Can I bring my friend Jake?" },
  { id: 'm14', chat_id: '2', sender: 'Mom', timestamp: setTime(8, 35), text: "Of course! The more the merrier 😊" },
  { id: 'm15', chat_id: '2', sender: 'Brother', timestamp: setTime(9, 0), text: "Running late, might arrive around 5:30" },
  { id: 'm16', chat_id: '2', sender: 'Dad', timestamp: setTime(10, 30), text: "I'm making my famous lasagna 🍝" },
  { id: 'm17', chat_id: '2', sender: 'Sister', timestamp: setTime(11, 0), text: "YUM! I'll bring dessert - thinking tiramisu?" },
  { id: 'm18', chat_id: '2', sender: 'Mom', timestamp: setTime(11, 15), text: "Perfect! That's decided then. See you all Sunday!" },
  
  // Work Team
  { id: 'm19', chat_id: '3', sender: 'Alice', timestamp: setTime(9, 0), text: "Morning team! Quick update on the project deadline" },
  { id: 'm20', chat_id: '3', sender: 'Alice', timestamp: setTime(9, 2), text: "Client moved the presentation to Wednesday 2 PM instead of Friday" },
  { id: 'm21', chat_id: '3', sender: 'Bob', timestamp: setTime(9, 10), text: "😬 That's tight. I can finish the slides by Tuesday EOD" },
  { id: 'm22', chat_id: '3', sender: 'Charlie', timestamp: setTime(9, 15), text: "I'll handle the data analysis. Should have it by tomorrow noon" },
  { id: 'm23', chat_id: '3', sender: 'Diana', timestamp: setTime(9, 30), text: "I'll coordinate with the design team for the final mockups" },
  { id: 'm24', chat_id: '3', sender: 'Alice', timestamp: setTime(10, 0), text: "Great teamwork everyone! Let's sync at 3 PM today to review progress" },
  { id: 'm25', chat_id: '3', sender: 'Bob', timestamp: setTime(10, 45), text: "Here's the draft: https://docs.example.com/presentation-v2" },
  { id: 'm26', chat_id: '3', sender: 'Charlie', timestamp: setTime(14, 0), text: "Data analysis complete! Uploaded to the shared drive ✅" },
  { id: 'm27', chat_id: '3', sender: 'Diana', timestamp: setTime(15, 30), text: "Meeting notes: we agreed on the blue theme and minimalist approach" },
  
  // Gym Buddies
  { id: 'm28', chat_id: '4', sender: 'Tom', timestamp: setTime(6, 30), text: "Who's hitting the gym at 7 AM? 💪" },
  { id: 'm29', chat_id: '4', sender: 'Jerry', timestamp: setTime(6, 35), text: "I'm in! Leg day today" },
  { id: 'm30', chat_id: '4', sender: 'Max', timestamp: setTime(6, 40), text: "Same! Let's gooo" },
  { id: 'm31', chat_id: '4', sender: 'Tom', timestamp: setTime(8, 30), text: "Great session! New PR on squats 🎯" },
  { id: 'm32', chat_id: '4', sender: 'Jerry', timestamp: setTime(12, 0), text: "Protein shake recipe anyone? Getting bored of the same flavors" },
  { id: 'm33', chat_id: '4', sender: 'Max', timestamp: setTime(12, 15), text: "Try banana + peanut butter + cocoa. Game changer!" },
  
  // Sarah Miller (1:1)
  { id: 'm34', chat_id: '5', sender: 'Sarah', timestamp: setTime(10, 30), text: "Hey! Are we still on for coffee tomorrow at 3?" },
  { id: 'm35', chat_id: '5', sender: 'You', timestamp: setTime(10, 35), text: "Yes! Looking forward to it. Same place as last time?" },
  { id: 'm36', chat_id: '5', sender: 'Sarah', timestamp: setTime(10, 40), text: "Let's try that new café on Main Street instead! ☕" },
  { id: 'm37', chat_id: '5', sender: 'You', timestamp: setTime(10, 45), text: "Perfect, see you there!" },
  
  // John (Work) 1:1
  { id: 'm38', chat_id: '6', sender: 'John', timestamp: setTime(11, 0), text: "Quick question about the Q4 report" },
  { id: 'm39', chat_id: '6', sender: 'You', timestamp: setTime(11, 5), text: "Sure, what's up?" },
  { id: 'm40', chat_id: '6', sender: 'John', timestamp: setTime(11, 10), text: "Can you send me the latest sales figures by 4 PM today?" },
  { id: 'm41', chat_id: '6', sender: 'You', timestamp: setTime(11, 15), text: "Absolutely, I'll have them ready" },
  { id: 'm42', chat_id: '6', sender: 'John', timestamp: setTime(11, 20), text: "Thanks! You're a lifesaver 🙏" },
];

// Helper functions
export const getMessagesForChat = (chatId: string, date?: Date): Message[] => {
  const targetDate = date || new Date();
  return sampleMessages.filter(m => {
    const msgDate = new Date(m.timestamp);
    return m.chat_id === chatId && 
           msgDate.toDateString() === targetDate.toDateString();
  });
};

export const getMessagesForDate = (date?: Date): Message[] => {
  const targetDate = date || new Date();
  return sampleMessages.filter(m => {
    const msgDate = new Date(m.timestamp);
    return msgDate.toDateString() === targetDate.toDateString();
  });
};

export const getChatById = (chatId: string): Chat | undefined => {
  return sampleChats.find(c => c.id === chatId);
};

export const getChatMessageCount = (chatId: string, date?: Date): number => {
  return getMessagesForChat(chatId, date).length;
};

// Generate summaries
export const generateChatSummary = (chatId: string, date?: Date): ChatSummary => {
  const messages = getMessagesForChat(chatId, date);
  const chat = getChatById(chatId);
  
  const summaries: Record<string, ChatSummary> = {
    '1': {
      chat_id: '1',
      summary: "The group finalized plans for Saturday's birthday party at Sky Lounge. Venue opens at 6 PM with setup at 5:45. Lisa ordered a 3-tier chocolate cake, Mike confirmed the DJ (7-11 PM), and everyone agreed on $50 each for the gift. RSVP deadline is tomorrow.",
      keyPoints: [
        "Party is Saturday at Sky Lounge, arrive 5:45 PM for setup",
        "3-tier chocolate cake ordered from Sweet Treats Bakery",
        "DJ booked from 7 PM to 11 PM",
        "$50 contribution per person for the gift",
        "RSVP deadline is tomorrow for catering headcount"
      ],
      notableMessages: messages.slice(2, 5),
      messageCount: messages.length
    },
    '2': {
      chat_id: '2',
      summary: "Family dinner confirmed for Sunday at 5 PM. Dad is making lasagna, sister is bringing tiramisu and asked to bring friend Jake (approved). Brother will arrive around 5:30.",
      keyPoints: [
        "Sunday dinner at parents' house at 5 PM",
        "Dad making lasagna, sister bringing tiramisu",
        "Sister's friend Jake is welcome to join",
        "Brother running late, arriving around 5:30"
      ],
      notableMessages: messages.slice(0, 3),
      messageCount: messages.length
    },
    '3': {
      chat_id: '3',
      summary: "Critical deadline change: client presentation moved from Friday to Wednesday 2 PM. Team divided tasks - Bob on slides (Tuesday EOD), Charlie on data analysis (tomorrow noon), Diana coordinating design. Team sync at 3 PM today. Blue theme with minimalist approach was chosen.",
      keyPoints: [
        "Presentation moved to Wednesday 2 PM (was Friday)",
        "Bob: slides ready by Tuesday EOD",
        "Charlie: data analysis by tomorrow noon",
        "Diana: coordinating with design team",
        "Team sync meeting at 3 PM today",
        "Agreed on blue theme, minimalist approach"
      ],
      notableMessages: messages.slice(0, 4),
      messageCount: messages.length
    },
    '4': {
      chat_id: '4',
      summary: "Morning gym session completed at 7 AM - leg day. Tom hit a new PR on squats. Group discussed protein shake recipes, with Max recommending banana + peanut butter + cocoa.",
      keyPoints: [
        "7 AM gym session for leg day",
        "Tom achieved new squat PR",
        "New shake recipe: banana + peanut butter + cocoa"
      ],
      notableMessages: messages.slice(0, 2),
      messageCount: messages.length
    },
    '5': {
      chat_id: '5',
      summary: "Coffee date confirmed for tomorrow at 3 PM. Changed venue to new café on Main Street instead of the usual spot.",
      keyPoints: [
        "Coffee tomorrow at 3 PM",
        "New location: café on Main Street"
      ],
      notableMessages: messages.slice(0, 2),
      messageCount: messages.length
    },
    '6': {
      chat_id: '6',
      summary: "John requested Q4 sales figures for a report. Deadline is 4 PM today. Confirmed delivery.",
      keyPoints: [
        "Q4 sales figures needed by 4 PM today",
        "For report preparation"
      ],
      notableMessages: messages.slice(0, 2),
      messageCount: messages.length
    }
  };
  
  return summaries[chatId] || {
    chat_id: chatId,
    summary: "No messages today.",
    keyPoints: [],
    notableMessages: [],
    messageCount: 0
  };
};

export const generateDailyDigest = (date?: Date): string => {
  return `**📱 Today was a busy day across 6 chats with 42 messages.**

Your groups were most active with event planning and work discussions taking the lead.

**🎉 Event Planning** is heating up for Saturday's birthday party - venue, DJ, and cake are all confirmed. Don't forget the RSVP deadline tomorrow!

**💼 Work** had an urgent update - the client presentation was moved up to Wednesday. Your team is on it with clear task assignments.

**👨‍👩‍👧‍👦 Family** confirmed Sunday dinner at 5 PM. Dad's making lasagna!

**💪 Gym Buddies** crushed a morning session - Tom hit a new PR!

**☕ Personal chats** - Coffee with Sarah tomorrow at 3 PM (new café on Main St), and John needs Q4 figures by 4 PM today.`;
};

export const extractHighlights = (date?: Date): Highlight[] => {
  return [
    { type: 'event', text: "Birthday party Saturday at Sky Lounge, 6 PM", chat_id: '1', chat_name: 'Event Planning 🎉', timestamp: setTime(9, 22) },
    { type: 'event', text: "Sunday dinner at parents' house, 5 PM", chat_id: '2', chat_name: 'Family Group 👨‍👩‍👧‍👦', timestamp: setTime(8, 5) },
    { type: 'event', text: "Coffee with Sarah tomorrow at 3 PM", chat_id: '5', chat_name: 'Sarah Miller', timestamp: setTime(10, 30) },
    { type: 'deadline', text: "Client presentation Wednesday 2 PM", chat_id: '3', chat_name: 'Work Team', timestamp: setTime(9, 2) },
    { type: 'deadline', text: "RSVP deadline tomorrow for party catering", chat_id: '1', chat_name: 'Event Planning 🎉', timestamp: setTime(14, 30) },
    { type: 'deadline', text: "Q4 sales figures due by 4 PM today", chat_id: '6', chat_name: 'John (Work)', timestamp: setTime(11, 10) },
    { type: 'decision', text: "$50 each for birthday gift - collection via Venmo", chat_id: '1', chat_name: 'Event Planning 🎉', timestamp: setTime(11, 30) },
    { type: 'decision', text: "Blue theme with minimalist approach for presentation", chat_id: '3', chat_name: 'Work Team', timestamp: setTime(15, 30) },
    { type: 'decision', text: "Sister bringing tiramisu for family dinner", chat_id: '2', chat_name: 'Family Group 👨‍👩‍👧‍👦', timestamp: setTime(11, 0) },
    { type: 'action', text: "Bob: slides ready by Tuesday EOD", chat_id: '3', chat_name: 'Work Team', timestamp: setTime(9, 10) },
    { type: 'action', text: "Charlie: data analysis by tomorrow noon", chat_id: '3', chat_name: 'Work Team', timestamp: setTime(9, 15) },
    { type: 'action', text: "Send Q4 figures to John by 4 PM", chat_id: '6', chat_name: 'John (Work)', timestamp: setTime(11, 15) },
    { type: 'link', text: "Venue: https://venue.example.com/skylounge", chat_id: '1', chat_name: 'Event Planning 🎉', timestamp: setTime(10, 0) },
    { type: 'link', text: "Presentation draft: https://docs.example.com/presentation-v2", chat_id: '3', chat_name: 'Work Team', timestamp: setTime(10, 45) },
  ];
};

// Search function
export interface SearchResult {
  answer: string;
  sources: { chat_name: string; chat_id: string; messages: Message[] }[];
}

export const searchMessages = (query: string, date?: Date): SearchResult => {
  const lowerQuery = query.toLowerCase();
  const allMessages = getMessagesForDate(date);
  
  // Simple keyword matching
  const matchedMessages = allMessages.filter(m => 
    m.text.toLowerCase().includes(lowerQuery) ||
    lowerQuery.split(' ').some(word => m.text.toLowerCase().includes(word))
  );
  
  // Group by chat
  const groupedByChat: Record<string, Message[]> = {};
  matchedMessages.forEach(m => {
    if (!groupedByChat[m.chat_id]) {
      groupedByChat[m.chat_id] = [];
    }
    groupedByChat[m.chat_id].push(m);
  });
  
  const sources = Object.entries(groupedByChat).map(([chatId, messages]) => ({
    chat_name: getChatById(chatId)?.name || 'Unknown',
    chat_id: chatId,
    messages: messages.slice(0, 3)
  }));
  
  // Generate simple answer based on query
  let answer = "I found some relevant messages across your chats.";
  
  if (lowerQuery.includes('dinner') || lowerQuery.includes('friday')) {
    answer = "Yes! There's a family dinner planned for Sunday at 5 PM at your parents' house. Dad is making lasagna and your sister is bringing tiramisu.";
  } else if (lowerQuery.includes('party') || lowerQuery.includes('saturday')) {
    answer = "The birthday party is Saturday at Sky Lounge! Arrive at 5:45 PM for setup, venue opens at 6 PM. DJ runs from 7-11 PM. Don't forget: $50 for the group gift.";
  } else if (lowerQuery.includes('venue') || lowerQuery.includes('time')) {
    answer = "Saturday's party is at Sky Lounge (venue opens 6 PM). The presentation was moved to Wednesday 2 PM. Sunday dinner is at 5 PM.";
  } else if (lowerQuery.includes('deadline') || lowerQuery.includes('due')) {
    answer = "Key deadlines: RSVP for the party tomorrow, Q4 figures due by 4 PM today, presentation moved to Wednesday 2 PM.";
  } else if (lowerQuery.includes('coffee') || lowerQuery.includes('sarah')) {
    answer = "You have coffee with Sarah tomorrow at 3 PM at the new café on Main Street.";
  }
  
  return { answer, sources };
};
