Githubify
=======================

Place where you can easily manage and organize tags for your Github repositories. You will have ability to set tags for your own repos, forks, repositories that you have been added to as a collaborator and even starred repos!

![Image of Githubify](http://sacret.ru/sites/default/files/styles/gallery_image_full/public/portfolio/githubifyme_0.png)

Installation
------------

To install the application you need Node.js 20+ and npm

-   Clone the repository:

    ```bash
    git clone https://github.com/Sacret/githubify.git
    cd githubify
    ```

-   Install `npm` packages:

    ```bash
    npm install
    ```

-   Setup Firebase config:

    ```bash
    cp .env.example .env.local
    ```

    and put settings of your Firebase web app to `.env.local`

-   In Firebase console enable **GitHub** sign-in provider and apply
    database rules from `database.rules.json`

-   Run dev server:

    ```bash
    npm run dev
    ```

-   Build for production (result is in `dist/`):

    ```bash
    npm run build
    ```
