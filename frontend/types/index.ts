export type Message = {
  role: "user" | "assistant";
  text: string;
};

export type Conversation = {
  _id: string;
  messages: Message[];
};
