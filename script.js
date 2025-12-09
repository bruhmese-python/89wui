function startTimer() {
  let seconds = 0;

  setInterval(() => {
    seconds++;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format with leading zeros
    const formattedTime =
      String(minutes).padStart(2, '0') + ':' + String(remainingSeconds).padStart(2, '0');

    const timerDiv = document.getElementById('timer');
    if (timerDiv) {
      timerDiv.textContent = formattedTime;
    }
  }, 1000);
}

// Start the timer when the page loads
// window.onload = startTimer;

// Teams avatar colors with their text colors
const teamsAvatarColors = [
  { bg: "#6264A7", text: "#FFFFFF" }, // Purple
  { bg: "#8764B8", text: "#FFFFFF" }, // Magenta  
  { bg: "#CA5010", text: "#FFFFFF" }, // Dark Orange
  { bg: "#C4314B", text: "#FFFFFF" }, // Dark Red
  { bg: "#0078D4", text: "#FFFFFF" }, // Blue
  { bg: "#00BCF2", text: "#000000" }, // Light Blue
  { bg: "#008272", text: "#FFFFFF" }, // Teal
  { bg: "#498205", text: "#FFFFFF" }, // Green
  { bg: "#881798", text: "#FFFFFF" }, // Dark Purple
  { bg: "#004B50", text: "#FFFFFF" }, // Dark Teal
  { bg: "#EAA300", text: "#000000" }, // Gold
  { bg: "#C19C00", text: "#000000" }  // Dark Yellow
];

let usersInMeeting = [];
let me = "";
let usersList = [
  "John Doe",
  "Lavanya Kalam",
  "Kite Conrad",
  "Santhosh kumar",
  "Vinod PK",
  "Deepa Krishnan",
  "Harish Kumar",
  "Aravindh"
];
// Example list
let user_elements = [];

let latestChats = []
let outroChats = [
  "Will keep you posted.",
  "Let's connect later if needed.",
  "Thanks, I'll take it from here.",
  "Logging off for now.",
  "Catch up tomorrow.",
  "Let's close this for today.",
  "Will share updates by EOD.",
  "Wrapping this up.",
  "Ping me if anything comes up.",
  "Thanks, everyone!"
];
let normalChats = [
  "Where are we on this?",
  "Did customer respond on the B2B usecases?",
  "ETA for internal demo?",
  "Status of E2E testing",
  "What is the plan for this week?",
  "We are making good progress",
  "Driving towards closure",
  "Pls post the artifacts in chat",
  "Need to join another meeting",
  "By the end of this week",
  "Let's schedule a meeting for next week",
  "Let's bring in the network team also",
  "Can we sync up after lunch?",
  "Any blockers from your side?",
  "Thanks for the update!",
  "Looping in the infra team",
  "Will check and get back",
  "Noted, thanks!",
  "Can we get a quick status update?",
  "Please review the document",
  "Deadline is approaching fast",
  "Great job team!",
  "Let's aim to close this today",
  "Any feedback from QA?",
  "We need to escalate this",
  "Can someone pick this up?",
  "Let's align on priorities",
  "Will share the deck shortly",
  "Adding this to the tracker",
  "Please update the JIRA ticket",
  "Let's keep the customer informed",
  "Joining in 2 mins",
  "Sorry, was on another call",
  "Can we push this to tomorrow?",
  "Let's finalize the agenda",
  "Please check the shared folder",
  "We need a quick RCA",
  "Any updates from the client?",
  "Let's do a dry run",
  "Thanks for the heads-up",
  "Can we get a confirmation?",
  "Please drop your inputs",
  "Let's regroup at 4 PM",
  "Adding this to the MOM",
  "Will do it by EOD",
  "Let's keep it crisp",
  "Need more clarity on this",
  "Please raise a change request",
  "Let's take this offline",
  "Can we get a quick call?",
  "Waiting for your inputs",
  "This needs immediate attention",
  "Let's revisit the timeline",
  "Can we get a walkthrough?",
  "Pending review from security",
  "Please align with the design team",
  "Let's prioritize this for sprint planning",
  "Any blockers from the infra side?",
  "We need to update the stakeholders",
  "Let's close the loop on this"
];

let attachmentChats = [
  "attaching tracker below",
  "pls find the guidelines document below",
  "sharing SOPS",
  "Sharing metrics report here",
]

let globalMsgCount = 0;

function getFormattedTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
}

function getInitials(name) {
  return name.split(" ").map(part => part[0]).join("").toUpperCase();
}

function getMicSpan(element) {
  const memberNameDiv = element.querySelector(".member-name");
  if (!memberNameDiv) return null;

  const micSpan = memberNameDiv.querySelector(".mic");
  return micSpan;
}

function getRaiseDiv(element) {
  const raiseDiv = element.querySelector(".member-block-overlays");
  if (!raiseDiv) return null;

  const div = raiseDiv.querySelector(".raise");
  return div;
}

function isRaisedDiv(element) {
  const raiseDiv = element.querySelector(".member-block-overlays");
  if (!raiseDiv) return false;

  const div = raiseDiv.querySelector(".raise");
  return div.classList.contains('hide');
}

function getBorderElement(element) {
  const memberNameDiv = element.querySelector(".child-top-border");
  if (!memberNameDiv) return null;

  return memberNameDiv;
}

function endMeeting() {
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = "https://teams.microsoft.com/v2/";
  }, 1000); // Wait for fade-out to complete
}



function recordMetaChat(string) {
  chatHistory = document.getElementById('chat-history')
  // console.log(history);

  d = document.createElement('div');
  d.className = 'meta-chat';
  d.innerHTML = string;

  chatHistory.appendChild(d);
}

function addUser(username) {
  const randomColorIndex = Math.floor(Math.random() * teamsAvatarColors.length);
  const colorScheme = teamsAvatarColors[randomColorIndex];
  const initials = getInitials(username);

  // Create a wrapper div
  const memberElement = document.createElement('div');
  memberElement.className = 'flex-item';

  // Generate SVG circle for avatar
  const avatarSVG = `
    <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="${colorScheme.bg}"/>
    </svg>
  `;

  // Set inner HTML
  memberElement.innerHTML = `
    <div class="member-flex-item-background">
      <div class="member-block" style="position: relative;">
        <div class="avatar-svg-container">${avatarSVG}</div>
        <div class="member-profile-picture" style="color: ${colorScheme.text};">
          ${initials}
        </div>
      </div>
    </div>
    <div class="member-block-overlays">
      <div class="raise hide">
        <div class="raise-div">✋</div>
      </div>
      <div class="name">
        <div class="member-name">
          ${username}&nbsp;
          <span class="mic hide">
            <svg height="15px" width="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <style>.st0{fill:#ffffff;}</style>
              <path class="st0" d="M436.418,244.958v-26.706h-35.395v26.706c-0.021,20.719-4.369,40.396-12.217,58.212l26.432,26.44 C428.735,304.384,436.403,275.558,436.418,244.958z"/>
              <path class="st0" d="M336.135,244.958V80.124C336.121,35.926,300.209,0.014,256.003,0c-44.184,0.014-80.11,35.926-80.124,80.124 v10.119l160.068,160.076C336.063,248.544,336.135,246.769,336.135,244.958z"/>
              <path class="st0" d="M393.815,361.087c0.202-0.237,0.431-0.453,0.633-0.69l-25.117-25.125c-0.194,0.244-0.431,0.46-0.626,0.704 l-46.311-46.318c0.18-0.259,0.396-0.489,0.568-0.755L175.88,141.843v1.301L84.608,51.873l-25.8,25.793L175.88,194.737v50.22 c0.014,44.184,35.94,80.096,80.124,80.11c14.423-0.007,27.928-3.888,39.627-10.579l46.692,46.692 c-24.169,18.01-53.914,28.776-86.319,28.776c-40.001,0-76.164-16.228-102.482-42.531c-26.303-26.318-42.531-62.466-42.531-102.468 v-26.706H75.597v26.706c0.028,91.494,68.438,167.033,156.828,178.675V512h47.188v-88.367c32.929-4.348,62.998-17.672,87.886-37.277 l59.901,59.901l25.793-25.793L393.815,361.087z"/>
            </svg>
          </span>
        </div>
      </div>
    </div>

    <div class="child-top-border"></div>
  `;

  // Store color scheme for chat avatars
  memberElement.dataset.bgColor = colorScheme.bg;
  memberElement.dataset.textColor = colorScheme.text;

  // No need for hue rotation anymore - using actual Teams colors

  // Add click event listener
  memberElement.addEventListener('dblclick', function (event) {
    const floating_profile = document.getElementById('floating-profile');
    const mouseX = event.clientX - 5;
    const mouseY = event.clientY - 5;

    floating_profile.classList.remove('reveal');

    floating_profile.style.position = 'absolute';
    floating_profile.style.left = `${mouseX}px`;
    floating_profile.style.top = `${mouseY}px`;
    floating_profile.style.display = 'block';

    floating_profile.classList.add('reveal');
  });

  // Append to members-space
  const memberSpace = document.querySelector(".members-space");
  if (memberSpace) {
    memberSpace.appendChild(memberElement);
    usersInMeeting.push(username);
    user_elements.push(memberElement);

    recordMetaChat("<a class='grey-bold' href='#'>" + username + "</a> joined the chat");
  }
}
function addRandomUser() {
  const availableUsers = usersList.filter(user => !usersInMeeting.includes(user));
  if (availableUsers.length === 0) return;

  const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
  //   console.log('Going with ' + randomUser)
  addUser(randomUser);
}

// console.log('Adding random user');
// addRandomUser();

function deleteRandomUser() {
  if (usersInMeeting.length === 0) return;

  // Pick a random index
  let index = Math.floor(Math.random() * usersInMeeting.length);
  while (usersInMeeting[index] === me) {
    index = Math.floor(Math.random() * usersInMeeting.length);
  }

  // Remove user from DOM
  const userElement = user_elements[index];
  if (userElement && userElement.parentNode) {
    userElement.parentNode.removeChild(userElement);
  }

  recordMetaChat("<a class='grey-bold' href='#'>" + usersInMeeting[index] + "</a> left the chat");

  // Remove user from arrays
  usersInMeeting.splice(index, 1);
  user_elements.splice(index, 1);
}

// console.log('Deleting random user');
// deleteRandomUser()

function applyUserBackgroundStyle(username, chatUserDiv) {
  // Find index of the username in the usersInMeeting array
  const userIndex = usersInMeeting.indexOf(username);
  if (userIndex === -1) {
    console.warn(`User "${username}" not found in usersInMeeting.`);
    return;
  }

  // Get the corresponding element from user_elements
  const userElement = user_elements[userIndex];
  if (!userElement) {
    console.warn(`No element found for user "${username}".`);
    return;
  }

  // Get stored color scheme
  const bgColor = userElement.dataset.bgColor;
  const textColor = userElement.dataset.textColor;

  if (!bgColor || !textColor) {
    console.warn(`Color scheme not found for user "${username}".`);
    return;
  }

  // Apply SVG circle background to chat avatar
  chatUserDiv.style.background = bgColor;
  chatUserDiv.style.color = textColor;
}

function scrollToLastChatMsg() {
  hideNewMsgAlert();
  const chatHistoryContainer = document.getElementById('chat-history-container');
  if (chatHistoryContainer) {
    chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
  }
}

function userSays(username, chat, _attachment) {
  const chatHistory = document.getElementById('chat-history');
  if (!chatHistory) return;

  const chatParent = document.createElement('div');
  chatParent.className = 'chat-parent';


  attachment = ""
  if (_attachment.length != 0) {
    attachment = `
    <div class="chat-attachment" style='background:url(${_attachment}) center center/cover no-repeat local;'>
      <div class="chat-attachment-overlay">
        <div class="chat-overlay-text">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6484 10.5264L13.4743 13.3523C13.8012 12.9962 14.0007 12.5214 14.0007 12C14.0007 10.8954 13.1053 10 12.0007 10C11.4793 10 11.0045 10.1995 10.6484 10.5264Z" fill="#ffffff"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1211 18.2422C13.4438 18.4051 12.7343 18.5 12.0003 18.5C9.7455 18.5 7.72278 17.6047 6.14832 16.592C4.56791 15.5755 3.3674 14.3948 2.73665 13.7147C2.11883 13.0485 2.06103 12.0457 2.6185 11.3145C3.05443 10.7428 3.80513 9.84641 4.83105 8.95209L6.24907 10.3701C5.35765 11.1309 4.68694 11.911 4.2791 12.436C4.86146 13.0547 5.90058 14.0547 7.23022 14.9099C8.62577 15.8075 10.2703 16.5 12.0003 16.5C12.1235 16.5 12.2463 16.4965 12.3686 16.4896L14.1211 18.2422ZM15.6656 15.544L17.1427 17.0211C17.3881 16.8821 17.6248 16.7383 17.8522 16.592C19.4326 15.5755 20.6332 14.3948 21.2639 13.7147C21.8817 13.0485 21.9395 12.0457 21.3821 11.3145C20.809 10.563 19.6922 9.25059 18.1213 8.1192C16.5493 6.98702 14.4708 6 12.0003 6C10.229 6 8.65936 6.50733 7.33335 7.21175L8.82719 8.70559C9.78572 8.27526 10.8489 8 12.0003 8C13.9223 8 15.5986 8.76704 16.9524 9.7421C18.2471 10.6745 19.1995 11.7641 19.7215 12.436C19.1391 13.0547 18.1 14.0547 16.7703 14.9099C16.4172 15.137 16.0481 15.3511 15.6656 15.544Z" fill="#ffffff"></path> <path d="M4 5L19 20" stroke="#ffffff" stroke-width="2" stroke-linecap="round"></path> </g></svg>
          Preview not available
        </div>
      </div>
    </div>
    `
  }

  // ${username}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  chatParent.innerHTML = `
        <div class="other-chat-meta-text-container">
            <div class="meta-text meta-chat chat-justify-left">
                ${username}, ${getFormattedTime()}
            </div>
        </div>
        <div class="chat-container">
            <div class="other-chat-entry">
                <div class="other-chat-color chat-msg chat-justify-left">
                    ${chat}
                    ${attachment}
                    <div class="emoji-reaction-parent select-none" onclick="this.style.display='none';"> 
                      <div class="emoji-reaction">👍</div>
                    </div>
                </div>
                <div class="chat-user">
                  ${getInitials(username)}
                  <div class="mini-profile-status">
                    <img width="10" src="mini-profile-status.png"></img>
                  </div>
                </div>
            </div>
        </div>
    `;

  let t_id = "msg_" + globalMsgCount.toString();
  globalMsgCount += 1;
  chatParent.setAttribute("id", t_id);

  // Apply background style to the chat-user div
  const chatUserDiv = chatParent.querySelector('.chat-user');
  // if (chatUserDiv) {
  // chatUserDiv.style.background = "url('placeholders/Pink.png') center center/contain no-repeat local";
  // }


  const emojiRack = document.getElementById('emoji-rack');

  chatParent.addEventListener('click', (event) => {
    // chatParent.clientX
    w = chatParent.getBoundingClientRect().width;
    const mouseX = chatParent.getBoundingClientRect().left + w * 0.3 ;
    const mouseY = chatParent.getBoundingClientRect().top;


    emojiRack.setAttribute("for-id", t_id);
    emojiRack.style.position = 'fixed';
    emojiRack.style.left = `${mouseX}px`;
    emojiRack.style.top = `${mouseY}px`;
    emojiRack.style.display = 'flex';
  });

  chatHistory.appendChild(chatParent);

  applyUserBackgroundStyle(username, chatUserDiv);

  showNewMsgAlert();

}

function meSays(chat) {
  const chatHistory = document.getElementById('chat-history');
  if (!chatHistory) return;

  const chatParent = document.createElement('div');
  chatParent.className = 'chat-parent';

  // ${username}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  chatParent.innerHTML = `
  <div class="my-chat-meta-text-container">
    <div class="meta-text meta-chat chat-justify-right">
        ${getFormattedTime()}
    </div>
  </div>
  <div class="chat-container my-chat-margin">
      <div class="my-chat-entry">
          <div class="my-chat-color chat-msg chat-justify-right">
              ${chat}
          </div>
          <div class="chat-status">
              <svg width="10" height="10" fill="#464EB8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <g id="SVGRepo_bgCarrier" stroke-width="0"></g> <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"> </g> <g id="SVGRepo_iconCarrier"> <path d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.011,9.011,0,0,1,12,21ZM17.737,8.824a1,1,0,0,1-.061,1.413l-6,5.5a1,1,0,0,1-1.383-.03l-3-3a1,1,0,0,1,1.415-1.414l2.323,2.323,5.294-4.853A1,1,0,0,1,17.737,8.824Z"> </path> </g> </svg>
          </div>
      </div>
  </div>
`
  chatHistory.appendChild(chatParent);
  
  // Scroll chat container to bottom instead of scrolling the whole page
  const chatHistoryContainer = document.getElementById('chat-history-container');
  if (chatHistoryContainer) {
    chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
  }
}

function react(e) {
  emoji = e.target.innerHTML;
  parent = e.target.parentElement;
  for_id = parent.getAttribute("for-id");

  reaction_holder = document.getElementById(for_id).querySelector('.emoji-reaction-parent')
  reaction = document.getElementById(for_id).querySelector('.emoji-reaction')

  reaction_holder.style.display = 'block';
  reaction.innerHTML = emoji;
}

function updateMemberNos() {
  document.getElementById('members-number').innerHTML = usersInMeeting.length.toString();
}

// let me_isMuted = false;
// (un)mute control button
function toggleMeMute() {
  unmuted_mic = document.getElementById('unmuted-mic');
  muted_mic = document.getElementById('muted-mic');

  if (unmuted_mic.style.display == 'initial') {
    muted_mic.style.display = 'initial';
    unmuted_mic.style.display = 'none';
    // me_isMuted=true;
  } else {
    muted_mic.style.display = 'none';
    unmuted_mic.style.display = 'initial';
    // me_isMuted=false;
  }

  toggleSpeak(me_element,true);

}
function toggleSpeak(element, isMe=false) {
  const borderElement = getBorderElement(element);
  const micSpan = getMicSpan(element);

  // Toggle mute icon for self without affecting border animation
  if (isMe) {
    if (micSpan) {
      micSpan.classList.toggle('hide');
    }
    borderElement.classList.toggle('hide');
    return;
  }

  if (borderElement) {
    if (borderElement.classList.contains('fade-in')) {
      // Stop speaking
      borderElement.classList.remove('fade-in');
      borderElement.classList.add('fade-out');

      // Random chance to show mute icon when stopping speaking
      if (micSpan) {
        if (Math.random() < 0.3) {
          micSpan.classList.remove('hide');
        } else {
          micSpan.classList.add('hide');
        }
      }
    } else {
      // Start speaking
      borderElement.classList.remove('fade-out');
      borderElement.classList.add('fade-in');

      // Always hide mute icon when speaking
      if (micSpan) {
        micSpan.classList.add('hide');
      }
    }
  }
}

function toggleMeRaise() {
  toggleRaise(me_element);
}
function toggleRaise(element) {
  const raiseDiv = getRaiseDiv(element);
  if (raiseDiv) {
    raiseDiv.classList.toggle('hide');
  }
}
function randomToggleSpeak() {
  count = 0;
  usersInMeeting.forEach(element => {
    if (element !== me) {
      if (Math.random() < 0.5) {
        toggleSpeak(user_elements[count]);
      }
    }
    count += 1;
  });
}

function randomToggleRaise() {
  count = 0;
  usersInMeeting.forEach(element => {
    if (element !== me) {
      if (isRaisedDiv(user_elements[count])) {
        toggleRaise(user_elements[count]);
      }
      if (Math.random() > 0.1) {
        toggleRaise(user_elements[count]);
      }
    }
    count += 1;
  });
}

function randomUsersSay() {
  usersInMeeting.forEach(username => {
    if (username !== me) {
      const chance = Math.random();
      if (chance < 0.1) {
        if (Math.random() < 0.2) {
          const randomIndex = Math.floor(Math.random() * attachmentChats.length);
          userSays(username, attachmentChats[randomIndex], `attachments/thumb_${Math.floor(Math.random() * 10) + 1}.png`);
        } else {
          let randomIndex = Math.floor(Math.random() * normalChats.length);
          while (normalChats[randomIndex] in latestChats) {
            randomIndex = Math.floor(Math.random() * normalChats.length);
          }
          latestChats.push(normalChats[randomIndex]);
          if (latestChats.length == 11) {
            latestChats = latestChats.slice(0, 4)
          }
          userSays(username, normalChats[randomIndex], "");
        }
      }
    }
  });
}

function showNewMsgAlert() {
  let alertElement = document.getElementById('newMsgAlert');
  if (alertElement) {
    alertElement.style.display = 'block';
  }
  alertElement = document.getElementById('newMsgNotifAlert');
  if (alertElement) {
    alertElement.style.display = 'block';
  }
}

function hideNewMsgAlert() {
  let alertElement = document.getElementById('newMsgAlert');
  if (alertElement) {
    alertElement.style.display = 'none';
  }
  alertElement = document.getElementById('newMsgNotifAlert');
  if (alertElement) {
    alertElement.style.display = 'none';
  }
}

function addScrollFade() {
  if (document.getElementById('chat-history').scrollHeight > 202) {
    document.getElementById('chat-gradient-overlay').style.display = 'block';
  }
}

function meetingLoop() {
  const minInterval = 200;
  const maxInterval = 3000;

  function loop() {
    const action = Math.random() < 0.95 ? 'add' : 'delete';
    if (action === 'add') {
      addRandomUser();
    } else {
      if (usersInMeeting.length != 1)
        deleteRandomUser();
    }
    randomToggleSpeak();
    randomToggleRaise();
    randomUsersSay();
    addScrollFade();
    updateMemberNos();
    const nextDelay = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
    setTimeout(loop, nextDelay);
  }
  loop();
}

document.getElementById('my-chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey && e.target.value.trim().length !== 0) {
    e.preventDefault();
    meSays(e.target.value);
    e.target.value = "";
  }
});

document.getElementById('chat-history-container').addEventListener('scroll', function () {
  hideNewMsgAlert();
});

document.getElementById('emoji-rack').addEventListener('click', (event) => {
  document.getElementById('emoji-rack').style.display = 'none';
});

document.getElementById('mic-btn').addEventListener('click', function () {
  toggleMeMute();
});

document.getElementById('raise-btn').addEventListener('click', function () {
  toggleMeRaise();
});

floating_profile = document.getElementById('floating-profile');
floating_profile.addEventListener('click', function () {
  floating_profile.style.display = 'none';
  floating_profile.classList.remove('reveal');
});



// Meeting initialization - called after modal closes
function startMeeting() {
  addUser(me);
  me_element = user_elements[0];
  usersList = usersList.slice(1, usersList.length - 1);
  setTimeout(addRandomUser, 500);

  // initial mute self
  toggleMeMute();
  
  meetingLoop();
  startTimer();
}

// Onboarding Modal Functions
function joinMeeting() {
    const usernameInput = document.getElementById('username-input');
    const username = usernameInput.value.trim();
    
    if (username.length > 0) {
        me = username;
        closeModal();
    } else {
        usernameInput.style.borderColor = '#d10000';
        usernameInput.placeholder = 'Please enter your name';
        usernameInput.classList.add('shake');
        setTimeout(() => {
            usernameInput.classList.remove('shake');
            usernameInput.style.borderColor = '#e1e1e1';
        }, 500);
    }
}

function skipUsername() {
    me = usersList[0];
    closeModal();
}

function closeModal() {
    const modal = document.getElementById('onboarding-modal');
    modal.classList.add('hidden');
    setTimeout(() => {
        modal.style.display = 'none';
        startMeeting();
    }, 300);
}

document.getElementById('username-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        joinMeeting();
    }
});

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('username-input').focus();
    }, 100);
});

function toggleAltView() {
  const membersSpace = document.getElementById('members-space');
  if (membersSpace) {
    membersSpace.classList.toggle('alt-view');
  }
}

function openShareModal() {
  const modal = document.getElementById('share-modal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
  }
}
function openVideoModal() {
  const modal = document.getElementById('video-modal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
  }
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  if (modal) {
    modal.classList.add('hidden');
    setTimeout(() => {
      modal.style.display = 'none';
      modal.classList.remove('hidden');
    }, 300);
  }
}
function closeShareModal() {
  const modal = document.getElementById('share-modal');
  if (modal) {
    modal.classList.add('hidden');
    setTimeout(() => {
      modal.style.display = 'none';
      modal.classList.remove('hidden');
    }, 300);
  }
}

// Layout Modal Functions
let currentLayout = 'grid';
let pendingLayout = 'grid';

// Layout Modal Functions
function openLayoutModal() {
    const modal = document.getElementById('layout-modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        
        // Reset pending layout to current layout
        pendingLayout = currentLayout;
        updateLayoutSelectionVisuals();
        
        // Initialize feather icons if they haven't been rendered
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
}

function closeLayoutModal() {
    const modal = document.getElementById('layout-modal');
    if (modal) {
        modal.classList.add('hidden');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('hidden');
        }, 300);
    }
}

function selectLayoutOption(mode) {
    pendingLayout = mode;
    updateLayoutSelectionVisuals();
}

function updateLayoutSelectionVisuals() {
    // Remove selected class from all
    document.querySelectorAll('.layout-option-tile').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add to pending
    const selectedEl = document.getElementById('option-' + pendingLayout);
    if (selectedEl) {
        selectedEl.classList.add('selected');
    }
}

function confirmLayout() {
    setLayout(pendingLayout);
    closeLayoutModal();
}

function setLayout(mode) {
    const membersSpace = document.getElementById('members-space');
    if (!membersSpace) return;
    
    currentLayout = mode;
    
    // Remove existing layout classes
    membersSpace.classList.remove('alt-view', 'vertical-view');
    
    if (mode === 'horizontal') {
        membersSpace.classList.add('alt-view');
    } else if (mode === 'vertical') {
        membersSpace.classList.add('vertical-view');
    }
    // 'grid' is default, so no class needed
}

// Initialize Feather icons on load
window.addEventListener('load', () => {
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});
