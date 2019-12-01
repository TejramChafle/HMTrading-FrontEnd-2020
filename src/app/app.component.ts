import { Component } from '@angular/core';
import { AppService } from './app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    title = 'HM-Trading';
    isLoanLoggedIn: Boolean = false;
    constructor(public _appService: AppService, private router: Router) {
    }
    onLogout() {
        this._appService.logout();
    }
}
