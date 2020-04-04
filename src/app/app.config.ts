let URL;
if (location.host == 'localhost:4200') {
    // URL = 'http://localhost/HM-Trading-Backend-2020/index.php/'; // Development Server
    URL = 'http://hmtrading.wizbee.co.in/Services/index.php/'; // Staging Server
    // URL = 'https://hmtrading.biz/Services/index.php/'; // Production Server
} else {
    URL = location.origin+'/Services/index.php/';
}

export const baseUrl = URL;
// Records per request
export const limit = 100;