import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from './../../app.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    public loading = false;
    data: any = {};
    isInvalid: boolean = false;
    logins: Array<any>;
    // Emitter
    hasLoggedIn: EventEmitter<any> = new EventEmitter();

    constructor(private _appService: AppService, private router: Router) {
        this.logins = [{ name: 'Lucky Draw' }, { name: 'Loan' }];
    }

    ngOnInit() {
    }

    login(): void {
        this.loading = true;
        this._appService.login(this.data).subscribe(res => {
            console.log(res);
            this.loading = false;
            if (res) {
                this.hasLoggedIn.emit(true);
                localStorage.setItem('user', JSON.stringify(res));
                this.router.navigate(['home']);
            } else {
                this.isInvalid = true;
            }
        }, (error) => {
            console.log(error);
            this.loading = false;
            this.isInvalid = false;
            this._appService.notify('Oops! Something went wrong. Please try again after sometime.', 'Error!');
        });
    }

    // If the user has logged then loggedIn will be subscribed in component
    /* userLoggedIn() {
        return this.hasLoggedIn;
    } */
}
