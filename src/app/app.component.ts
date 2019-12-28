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
    dashboards: Array<String>;
    selectedDashboard: String;
    constructor(public _appService: AppService, private _router: Router) {
        this.dashboards = ['Fataka Fund', 'Loan'];
        this._appService.isDrawDashboard = JSON.parse(localStorage.getItem('isDrawDashboard'));
        this.selectedDashboard = this._appService.isDrawDashboard ? this.dashboards[0] : this.dashboards[1];
    }

    onLogout() {
        this._appService.logout();
    }

    onDashboardChange() {
        this._appService.isDrawDashboard = !this._appService.isDrawDashboard;
        localStorage.setItem('isDrawDashboard', this._appService.isDrawDashboard.toString());
        this._router.navigate(['home']);
    }
}
