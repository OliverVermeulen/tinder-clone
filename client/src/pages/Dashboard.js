// NB remember to copy this code as react-tinder-card boiler plate has been updated
import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [genderedUsers, setGenderedUsers] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [lastDirection, setLastDirection] = useState();

  const userId = cookies.UserId;

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user", {
        params: { userId },
      });
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGenderedUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/gendered-users", {
        params: { gender: user?.gender_interest },
      });
      setGenderedUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getGenderedUsers();
    }
  }, [user]);

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put("http://localhost:8000/addmatch", {
        userId,
        matchedUserId,
      });
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  console.log(user);

  const swiped = (direction, swipedUserId) => {
    if (direction === "right") {
      updateMatches(swipedUserId);
    }
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  const matchedUserIds = user?.matches
    .map(({ user_id }) => user_id)
    .concat(userId);

  const filteredGenderedUsers = genderedUsers?.filter(
    (genderedUser) => !matchedUserIds.includes(genderedUser.user_id)
  );

  return (
    <>
      {user && (
        <div className="dashboard">
          <ChatContainer user={user} />
          <div className="swipe-container">
            <div className="card-container">
              {filteredGenderedUsers?.map((genderedUser) => (
                <TinderCard
                  className="swipe"
                  key={genderedUser.user_id}
                  onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                  onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}
                >
                  <div
                    style={{ backgroundImage: "url(" + genderedUser.url + ")" }}
                    className="card"
                  >
                    <h3>{genderedUser.first_name}</h3>
                  </div>
                </TinderCard>
              ))}
              <div className="swipe-info">
                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Dashboard;

// import TinderCard from "react-tinder-card";
// import { useEffect, useState } from "react";
// import { useCookies } from "react-cookie";
// import ChatContainer from "../components/ChatContainer";
// import axios from "axios";

// import { useSpring, animated } from "react-spring";
// import { useDrag } from "@use-gesture/react";
// const screenHeight = window.innerHeight - 30;

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [genderedUsers, setGenderedUsers] = useState(null);
//   const [cookies, setCookie, removeCookie] = useCookies(["user"]);
//   const [lastDirection, setLastDirection] = useState();

//   const handlePos = useSpring({ y: 0 });
//   const bindHandlePos = useDrag((params) => {
//     const y = params.xy[1];
//     if (params.dragging) {
//       if (y >= 0 && y <= screenHeight) {
//         handlePos.y.set(y);
//       }
//     } else {
//       if (y > screenHeight / 2) {
//         handlePos.y.start(screenHeight);
//       } else {
//         handlePos.y.start(0);
//       }
//     }
//   });

//   const userId = cookies.UserId;

//   const getUser = async () => {
//     try {
//       const response = await axios.get("http://localhost:8000/user", {
//         params: { userId },
//       });
//       setUser(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getGenderedUsers = async () => {
//     try {
//       const response = await axios.get("http://localhost:8000/gendered-users", {
//         params: { gender: user?.gender_interest },
//       });
//       setGenderedUsers(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getUser();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       getGenderedUsers();
//     }
//   }, [user]);

//   const updateMatches = async (matchedUserId) => {
//     try {
//       await axios.put("http://localhost:8000/addmatch", {
//         userId,
//         matchedUserId,
//       });
//       getUser();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   console.log(user);

//   const swiped = (direction, swipedUserId) => {
//     if (direction === "right") {
//       updateMatches(swipedUserId);
//     }
//     setLastDirection(direction);
//   };

//   const outOfFrame = (name) => {
//     console.log(name + " left the screen!");
//   };

//   const matchedUserIds = user?.matches
//     .map(({ user_id }) => user_id)
//     .concat(userId);

//   const filteredGenderedUsers = genderedUsers?.filter(
//     (genderedUser) => !matchedUserIds.includes(genderedUser.user_id)
//   );

//   return (
//     <>
//       {user && (
//         <div className="dashboard">
//           <animated.div
//             {...bindHandlePos()}
//             style={{ y: handlePos.y }}
//             className="dashboard-handle-container"
//           >
//             <div className="dashboard-handle" />
//           </animated.div>

//           <animated.div
//             style={{
//               y: handlePos.y,
//               opacity: handlePos.y.to([0, screenHeight], [1, 0.8]),
//             }}
//             className="App-overlay"
//           >
//             <ChatContainer user={user} />
//           </animated.div>
//           <div className="App-bg" />

//           {/* <ChatContainer user={user} /> */}
//           <div className="swipe-container">
//             <div className="card-container">
//               {filteredGenderedUsers?.map((genderedUser) => (
//                 <TinderCard
//                   className="swipe"
//                   key={genderedUser.user_id}
//                   onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
//                   onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}
//                 >
//                   <div
//                     style={{ backgroundImage: "url(" + genderedUser.url + ")" }}
//                     className="card"
//                   >
//                     <h3>{genderedUser.first_name}</h3>
//                   </div>
//                 </TinderCard>
//               ))}
//               <div className="swipe-info">
//                 {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
// export default Dashboard;
