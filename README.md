# Invit

<img src='https://raw.githubusercontent.com/nullstack/nullstack/master/nullstack.png' height='60' alt='Nullstack' />

## How to run this Project

Install the dependencies:

`npm install`

Run supabase project with:

`npm run db:start`

Getting host info and keys using:

`npm run db:status`

Copy the environment sample to a .env file

```sh
NULLSTACK_PROJECT_NAME="Invit"
NULLSTACK_PROJECT_DOMAIN="localhost"
NULLSTACK_PROJECT_COLOR="#D22365"
NULLSTACK_SERVER_PORT="3000"
NULLSTACK_SETTINGS_SUPABASE_ANON_KEY=<get_key_status_anom_key>
NULLSTACK_SETTINGS_SUPABASE_ROLE_KEY=<get_key_status_role_key>
NULLSTACK_SETTINGS_SUPABASE_API_URL=<get_url_api_db>

```


Run the app in development mode:

`npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


When you need stop containers from supabase using:

`npm run db:stop`

## Learn more about Nullstack

[Read the documentation](https://nullstack.app/documentation)

