import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DrawService } from './../../services/draw.service';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    public loading = false;
    distribution: Array<any>;
    constructor(private _router: Router, public _drawService: DrawService, public _appService: AppService) { }

    ngOnInit() {
        this.itemDistribution({limit: 100, offset: 0, page: 1});
    }

    navigate(path) {
        this._router.navigate([path]);
    }

    itemDistribution(params) {
        this.loading = true;
        this._drawService.itemDistribution(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.distribution = data.records;
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get the item distribution information.', 'Error!');
                console.log(error);
            }
        );
    }
}
