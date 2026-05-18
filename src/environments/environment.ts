export const environment = {
  production: true,

  //if using Nginx on the server --> apiURL: '/api/v1',
  // without Nginx  --> apiURL: 'http(s)://your-domain/api/v1',
  apiURL: '/api/v1',

  // nginx change the following with '/api/v1' in the nginx.conf file
  notificationURL: '/notification-api/v1'
};
