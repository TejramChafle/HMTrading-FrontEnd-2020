import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DrawService } from './../../services/draw.service';
import { AppService } from 'src/app/app.service';
import { LoanService } from './../../services/loan.service';
import { StatisticsComponent } from '../_loan/statistics/statistics.component';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    public loading = false;
    distribution: Array<any>;
    dashboard: any = {};
    statistics: any;

    constructor(
        private _router: Router,
        public _drawService: DrawService,
        public _loanService: LoanService,
        public _appService: AppService) {
        if (localStorage.getItem('distribution')) {
            this.distribution = JSON.parse(localStorage.getItem('distribution'));
        }
        if (localStorage.getItem('dashboard')) {
            this.dashboard = JSON.parse(localStorage.getItem('dashboard'));
        }
    }

    ngOnInit() {
        this.itemDistribution({ limit: 100, offset: 0, page: 1 });
        this.initDashboard();

        // Get the loan statistics details from StatisticsComponent
        this.statistics = new StatisticsComponent(this._loanService, this._appService);
        this.statistics.getStatistics({ year: 2018 });
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
                localStorage.setItem('distribution', JSON.stringify(this.distribution));
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get the item distribution information.', 'Error!');
                console.log(error);
            }
        );
    }

    initDashboard() {
        this.loading = true;
        this._drawService.initDashboard().subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.dashboard = data;
                localStorage.setItem('dashboard', JSON.stringify(this.dashboard));
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get the item distribution information.', 'Error!');
                console.log(error);
            }
        );
    }
}
