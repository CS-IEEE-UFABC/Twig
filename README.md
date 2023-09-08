# 🦌 Twig
Discord bot to manage CS IEEE UFABC server.

## 📖 Summary
  - [📖 Summary](#-summary)
  - [❓ How to install](#-how-to-install)
  - [🧡 Features](#-features)
  - [📝 Commands](#-commands)
  - [✨ TODO](#-todo)

## ❓ How to install

Install dependencies:
```
pnpm install
# or
npm install
# or
yarn
```

[Encode your mongo uri](https://www.base64encode.org/) and copy it.

Create a `.env` file with the following content:
```
DISCORD_TOKEN=<your token>
MONGO_URI=<base64 encoded mongo_uri>
```

## 🧡 Features
  - Sharding
  - Command & Event & Invites handlers
  - Database
  - Manage volunteers & meetings
  - Settable roles actions

## 📝 Commands
  - /ping
  - /convite [RA]

## ✨ TODO
  - Reaction roles
  - Welcome message
