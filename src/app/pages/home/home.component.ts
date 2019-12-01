import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

    constructor(private _router: Router) { }

    ngOnInit() {
    }

    navigate(path) {
        this._router.navigate([path]);
    }
}
