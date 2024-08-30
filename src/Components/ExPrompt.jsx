import React from "react";
import "./ExPrompt.css";

function ExPrompt({handleClick, setIsTyping}) {
  const examplePrompts = [
    "What are some fun facts about space?",
    "Can you recommend a good book to read?",
    "What are some beginner-friendly programming languages?",
    "Can you play a trivia game with me?",
  ];

  return (
    <div className="PromptWrapper">
      <div className="prompts">
        {examplePrompts.map((_, key) => (
          <div
            onClick={() => {
              handleClick(_)
              setIsTyping(true)
            }}
            className="prompt"
            key={key}
          >
            <span>{_}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExPrompt;
