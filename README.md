# 🎫 Discord Ticket Bot v1.2.0  

A powerful Discord bot for managing support tickets efficiently. This bot allows users to create tickets, and staff members to claim, close, and log tickets with automatic transcripts.  

## 🚀 Features  

- **Ticket Panel** – Users can create tickets via a button-based panel.  
- **Claim System** – Staff can claim tickets based on category roles or a universal admin role.  
- **Close System** – Tickets can be closed with logs sent to respective channels.  
- **Ticket Transcripts** – Upon closing a ticket, a full transcript is logged in the appropriate log channel.  
- **Permission-Based Access** – Users, staff, and admins have role-based permissions for tickets.  
- **Customizable Categories** – Easily modify ticket categories, logs, and permissions.  

---

## 🔧 Installation  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

### 2️⃣ Install Dependencies
bash
Copy
Edit
npm install

### 3️⃣ Configure the Bot
Create a .env file and add your bot token and required IDs:
TOKEN=your-bot-token
TICKET_PANEL_CHANNEL=channel-id-for-ticket-panel

SUPPORT_CATEGORY_ID=category-id
SUPPORT_LOG_CHANNEL_ID=log-channel-id
SUPPORT_ROLE_ID=support-role-id

CREATORS_CATEGORY_ID=category-id
CREATORS_LOG_CHANNEL_ID=log-channel-id
CREATORS_ROLE_ID=creators-role-id

PACKS_CATEGORY_ID=category-id
PACKS_LOG_CHANNEL_ID=log-channel-id
PACKS_ROLE_ID=packs-role-id

DEV_CATEGORY_ID=category-id
DEV_LOG_CHANNEL_ID=log-channel-id
DEV_ROLE_ID=dev-role-id

REPORT_ADMIN_CATEGORY_ID=category-id
REPORT_ADMIN_LOG_CHANNEL_ID=log-channel-id
REPORT_ADMIN_ROLE_ID=report-admin-role-id

PLAYER_REPORT_CATEGORY_ID=category-id
PLAYER_REPORT_LOG_CHANNEL_ID=log-channel-id
PLAYER_REPORT_ROLE_ID=player-report-role-id

UNIVERSAL_ADMIN_ROLE=universal-admin-role-id

### 4️⃣ Start the Bot
node index.js

### 🎮 Usage
Set up the ticket panel – The bot will automatically send the ticket panel when it starts.
Create a ticket – Users click a button to create a ticket in the respective category.
Claim a ticket – Staff members can claim a ticket if they have the required role.
Close a ticket – Closing a ticket sends a transcript log before deletion.

### 🔄 Version History
v1.2.0 – Added ticket transcripts and improved role-based claim system.
v1.1.0 – Added claim and close functionality with role checks.
v1.0.0 – Initial release with ticket creation and logging.

### 📜 License
This project is licensed under the MIT License.

### 📩 Support
For any issues, open a GitHub Issue or contact the bot developer.
Just `spidey6629` .
