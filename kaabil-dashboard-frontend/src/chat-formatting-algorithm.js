

/*
export function FormatChatData(data) {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      return data; // Return as-is if it's not valid JSON
    }
  }

  if (!Array.isArray(data)) {
    data = [data]; // Wrap in array if it's a single object
  }

  let formattedString = '';

  data.forEach((item, index) => {
    formattedString += `Message ${index + 1}:\n`;
    
    if (item.role) {
      formattedString += `Role: ${item.role}\n`;
    }
    
    if (item.content) {
      if (item.role === 'user' && typeof item.content === 'string') {
        // Parse and format the content for user messages
        const contentParts = item.content.split('Here\'s the question:');
        formattedString += `Content:\n${contentParts[0].trim()}\n\n`;
        if (contentParts[1]) {
          const [question, ...rest] = contentParts[1].split('here are the options:');
          formattedString += `Question: ${question.trim()}\n\n`;
          if (rest[0]) {
            const [options, answerAndInput] = rest[0].split('The correct answer was:');
            const optionsList = options.split(',').map((opt, i) => `[${i}] ${opt.trim()}`).join('\n');
            formattedString += `Options:\n${optionsList}\n\n`;
            if (answerAndInput) {
              const [answer, userInput] = answerAndInput.split('The user selected the input');
              formattedString += `Correct Answer: ${answer.trim()}\n`;
              formattedString += `User Selected: Option ${userInput.trim()}\n\n`;
            }
          }
        }
      } else {
        // Handle non-string content or non-user roles
        formattedString += `Content:\n${JSON.stringify(item.content, null, 2)}\n`;
      }
    }
    
    if (item.visible !== undefined) {
      formattedString += `Visible: ${item.visible}\n`;
    }
    
    // Format any other fields
    Object.keys(item).forEach(key => {
      if (!['role', 'content', 'visible'].includes(key)) {
        let value = item[key];
        if (typeof value === 'object') {
          value = JSON.stringify(value, null, 2);
        }
        formattedString += `${key}: ${value}\n`;
      }
    });
    
    formattedString += '\n'; // Add a blank line between messages
  });

  return formattedString.trim();
}

export function FormatMessageDetails(messageDetails) {
  const formattedChats = FormatChatData(messageDetails.chats);
  const formattedUserInput = FormatChatData(messageDetails.userInput);

  return {
    ...messageDetails,
    chats: formattedChats,
    userInput: formattedUserInput
  };
}
*/


export function FormatChatData(data) {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      return data; // Return as-is if it's not valid JSON
    }
  }

  if (!Array.isArray(data)) {
    data = [data]; // Wrap in array if it's a single object
  }

  let formattedString = '';

  data.forEach((item, index) => {
    formattedString += `Message ${index + 1}:\n`;
    formattedString += `Role: ${item.role || 'N/A'}\n\n`;

    if (item.content) {
      if (Array.isArray(item.content)) {
        item.content.forEach(contentItem => {
          if (contentItem.text) {
            formattedString += formatContent(contentItem.text);
          }
        });
      } else if (typeof item.content === 'string') {
        formattedString += formatContent(item.content);
      } else {
        formattedString += `Content: ${JSON.stringify(item.content, null, 2)}\n`;
      }
    }

    formattedString += `Visible: ${item.visible !== undefined ? item.visible : 'N/A'}\n`;
    if (item.id) {
      formattedString += `ID: ${item.id}\n`;
    }
    formattedString += '\n---\n\n'; // Add a separator between messages
  });

  return formattedString.trim();
}



function formatContent(content) {
  let formatted = 'Content:\n';

  // Check if the content includes a question
  const questionMatch = content.match(/Here's the question:\s*'(.+?)'/);
  if (questionMatch) {
    formatted += `Question: ${questionMatch[1]}\n\n`;

    // Extract and format options
    const optionsMatch = content.match(/here are the options:\s*(.+?)\s*The correct answer was:/s);
    if (optionsMatch) {
      formatted += 'Options:\n';
      const options = optionsMatch[1].split(',').map(opt => opt.trim());
      options.forEach((opt, index) => {
        formatted += `[${String.fromCharCode(65 + index)}] ${opt}\n`;
      });
      formatted += '\n';
    }

    // Extract correct answer and user input
    const answerMatch = content.match(/The correct answer was:\s*'(.+?)'\s*.*The user selected the input\s*(.+)/s);
    if (answerMatch) {
      const correctAnswer = answerMatch[1].toUpperCase();
      formatted += `Correct Answer: ${correctAnswer}\n`;
      
      let userSelected = answerMatch[2].trim();
      // Convert numeric input to letter
      if (!isNaN(userSelected)) {
        const numericInput = parseInt(userSelected);
        userSelected = String.fromCharCode(65 + numericInput);
      }
      formatted += `User Selected: ${userSelected}\n\n`;
    }
  } else {
    // If no specific structure is found, just add the content as is
    formatted += `${content}\n\n`;
  }

  return formatted;
}



/*
function formatContent(content) {
  let formatted = 'Content:\n';

  // Check if the content includes a question
  const questionMatch = content.match(/Here's the question:\s*'(.+?)'/);
  if (questionMatch) {
    formatted += `Question: ${questionMatch[1]}\n\n`;

    // Extract and format options
    const optionsMatch = content.match(/here are the options:\s*(.+?)\s*The correct answer was:/s);
    if (optionsMatch) {
      formatted += 'Options:\n';
      const options = optionsMatch[1].split(',').map(opt => opt.trim());
      options.forEach((opt, index) => {
        formatted += `[${String.fromCharCode(65 + index)}] ${opt}\n`;
      });
      formatted += '\n';
    }

    // Extract correct answer and user input
    const answerMatch = content.match(/The correct answer was:\s*'(.+?)'\s*.*The user selected the input\s*(.+)/s);
    if (answerMatch) {
      formatted += `Correct Answer: ${answerMatch[1]}\n`;
      formatted += `User Selected: ${answerMatch[2].trim()}\n\n`;
    }
  } else {
    // If no specific structure is found, just add the content as is
    formatted += `${content}\n\n`;
  }

  return formatted;
}
*/

export function FormatMessageDetails(messageDetails) {
  const formattedChats = FormatChatData(messageDetails.chats);
  const formattedUserInput = FormatChatData(messageDetails.userInput);

  return {
    ...messageDetails,
    chats: formattedChats,
    userInput: formattedUserInput
  };
}