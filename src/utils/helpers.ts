const mentionPattern = /@(\w+)/g;

export const extractMentions = (text: string): string[] => {
   const mentions = text.match(mentionPattern) || [];
   return mentions.map((mention) => mention.substring(1)); // Remove the '@' symbol
};
