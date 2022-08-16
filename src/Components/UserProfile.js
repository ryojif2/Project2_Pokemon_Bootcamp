import React from "react";

const UserProfile = (props) => {
  return (
    <div>
      <h4>Welcome back {props.currUser}!</h4>
      {/* Show battle stats of user. Games played. Games won, Win rate. Most used pokemon? */}
      {/* {props.userStats}
      props.userStats.winRate props.userStats.gamesPlayed
      props.userStats.gamesWon props.userStats.mostUsed */}
      <p>Ready for your next battle?</p>
      <p>Choose your Pokemon below! </p>
    </div>
  );
};

export default UserProfile;
