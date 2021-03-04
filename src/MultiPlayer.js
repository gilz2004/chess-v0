// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("localhost:3001");
// // console.log("socket", socket);

// export default function MultiPlayer() {
//   const [friendId, setFriendId] = useState("");
//   const [myId, setMyId] = useState("");
//   //   console.log("welcome friend with id:", friendId);

//   const handleInit = ({ data }) => setMyId(data);
//   useEffect(() => {
//     socket.on("my-id", handleInit);
//     return () => {
//       socket.emit("disconnect");
//       socket.off();
//     };
//   }, []);

//   const handleInvite = (e) => {
//     e.preventDefault();
//     if (!friendId) return;
//     socket.emit("join", { players: [friendId, myId] });
//   };

//   return (
//     <div>
//       <div
//         style={{
//           color: "white",
//           border: "1px solid green",
//           width: "max-content",
//         }}
//       >
//         {myId ? myId : "show my id"}
//       </div>
//       <form onSubmit={(e) => handleInvite(e)}>
//         <label>Invite a Friend</label>
//         <input
//           type="text"
//           placeholder="Enter Friend id"
//           value={friendId}
//           onChange={(e) => setFriendId(e.target.value)}
//         />
//         <button type="submit">Invite</button>
//       </form>
//       {/* <span onClick={() => setConnectedPlayers([...connectedPlayers,])}>random</span> */}
//     </div>
//   );
// }
