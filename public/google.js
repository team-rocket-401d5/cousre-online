// let URL = 'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount';
let URL = 'https://accounts.google.com/o/oauth2/v2/auth';

let options = {
  client_id:
    '1014187475049-t1ia1v1in4t4us48lmlsugme36of0as0.apps.googleusercontent.com',
  redirect_uri: 'https://course-fellows.netlify.app/oauth',
  response_type: 'code',
  scope: 'profile email',
  fetch_basic_profile: true,
};

let QueryString = Object.keys(options)
  .map((key) => {
    return `${key}=` + encodeURIComponent(options[key]);
  })
  .join('&');

let authURL = `${URL}?${QueryString}`;

let link = document.getElementById('oauth');
link.setAttribute('href', authURL);