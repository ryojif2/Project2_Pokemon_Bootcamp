import React from "react";

const UserProfile = (props) => {
  const { battle } = props;
  console.log(battle);
  return (
    <div>
      {battle === false ? (
        <div>
          <p>Ready for your next battle?</p>
          <p>Choose your Pokemon below! </p>
        </div>
      ) : null}
    </div>
  );
};

export default UserProfile;
