# Mac Shortcut of the Day

Introducing a daily practice of exploring one Mac shortcut at a time. By doing so, users can easily remember important and useful shortcuts. Happy shortcutting! 🚀

## Problem:

Numerous tasks on Mac can be accomplished through shortcuts, but many users neglect to invest time in learning them or are simply unaware of their existence.

## Solution:

Introducing a daily practice of exploring one shortcut at a time. By doing so, users can easily remember important and useful shortcuts. This can be achieved through a dedicated Twitter account solely focused on sharing informative posts about various shortcuts.

## Requirements:

- Access to Mac shortcuts presented in a list format along with their explanations (https://support.apple.com/en-us/HT201236).
- Access to the Twitter API for seamless integration with the platform.
- Ability to execute the script once every 24 hours using Firebase Cloud Functions Cron Job.

## Project structure

### Process

- Skim shortcut page
  - Add newly discovered shortcuts to a list of shortcuts that haven't been added yet.
  - Update modified shortcuts in the list of shortcuts that have already been added.
- Select a shortcut from the list of shortcuts that haven't been added yet.
- Post the shortcut to Twitter.
- Repeat the process every 24 hours.

### Code structure

- Store the project code on GitHub to facilitate collaboration and version control.
- Manage sensitive credentials securely using a .env file. A sample.env file will illustrate the required fields.
- Store the curated list of shortcuts in Firestore, a flexible and scalable NoSQL database provided by Firebase.
- Implement a scheduled Cron Job using Firebase Functions to execute the script automatically at regular intervals, like every 24 hours.

### Database structure

- ID: string
- Shortcut: string
- Description: string
- Date added: date
- Date last updated: date
- Date posted: date
- Posted since last update: boolean
