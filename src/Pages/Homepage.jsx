import React from "react";

import "./Homepage.css";

function Homepage({ user }) {
  return (
    <div className="HomePage">
      <div className={`chatPage`}>
        <div className="userName">
          {user ? `Hello, ${user.name}.` : "Hello, Stranger."}
        </div>

        {user ? (
          <>
            <span className="slogan">
              Ask away, because clearly, you’ve got nothing better to do.
            </span>
          </>
        ) : (
          <span className="slogan">
            Hold your horses! Log in first, and then you can enjoy the privilege
            of chatting with me.
          </span>
        )}
      </div>
    </div>
  );
}

export default Homepage;
