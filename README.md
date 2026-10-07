Githubify
=======================

A place where you can easily manage and organize tags for your GitHub repositories. You can tag your own repos, forks, repositories you've been added to as a collaborator, and even starred ones!

Live site: https://githubify.sacret.ru

![Githubify](public/og-image.jpg)

Installation
------------

To install the application, you need Node.js 20+ and npm.

-   Clone the repository:

    ```bash
    git clone https://github.com/Sacret/githubify.git
    cd githubify
    ```

-   Install `npm` packages:

    ```bash
    npm install
    ```

-   Set up the Firebase config:

    ```bash
    cp .env.example .env.local
    ```

    and put your Firebase web app settings into `.env.local`

-   In the Firebase console, enable the **GitHub** sign-in provider and apply
    the database rules from `database.rules.json`

-   Run the dev server:

    ```bash
    npm run dev
    ```

-   Build for production (result is in `dist/`):

    ```bash
    npm run build
    ```

Deployment
----------

The site is deployed to Beget hosting with `rsync` over SSH. You need
`sshpass` (`brew install sshpass`).

-   Fill in SSH credentials in `.env.deploy` (see `.env.deploy.example`)

-   Build and upload `dist/` to the server:

    ```bash
    npm run deploy
    ```
