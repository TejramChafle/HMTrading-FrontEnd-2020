import { Component, OnInit } from '@angular/core';
import { DrawService } from '../../../services/draw.service';
import { Router, ActivatedRoute } from '@angular/router';
import { limit } from 'src/app/app.config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemComponent } from './../../../forms/item/item.component';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.css']
})

export class ItemsComponent implements OnInit {

    public loading = false;
    items: any[];
    pagination: any = {};
    limit: number = limit;
    distribution: Array<any>;

    constructor(
        public _drawService: DrawService, private _modalService: NgbModal, public _appService: AppService,
        private router: Router) {
    }

    ngOnInit() {
        this.getItems({ limit: this.limit, offset: 0, page: 1 });
        this.itemDistribution({ limit: 100, offset: 0, page: 1 });
    }

    getItems(params) {
        this.loading = true;
        this._drawService.getItems(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.items = data.records;
                this.pagination = data.pagination;
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get items information.', 'Error!');
                console.log('--------------------------------------------------------');
                console.log('ITEMS ERROR');
                console.log(error);
                console.log('--------------------------------------------------------');
            });
    }

    editItem(item) {
        // this._drawService.editItem = item;
        this.router.navigate(['items', item.item_id]);
    }

    deleteItem(id) {
        const conf = confirm('Are you sure you want to delete this item?');
        if (!conf) {
            return false;
        }

        this.loading = true;
        this._drawService.deleteItem(id).subscribe(
            data => {
                this._appService.notify('Item deleted successfully.', 'Success!');
                this.loading = false;
                // Refresh the customer list
                this.ngOnInit();
            }, error => {
                this.loading = false;
                this._appService.notify('Sorry, we cannot process your request.', 'Error!');
            });
    }

    pageChange(page) {
        console.log(page);
        const params = {
            limit: this.limit,
            offset: this.limit * (parseInt(page, 10) - 1),
            page: page
        };
        this.getItems(params);
    }

    addItem(item?: any) {
        const modalRef = this._modalService.open(ItemComponent, { size: 'lg' });
        modalRef.componentInstance.formdata = item || {};
        modalRef.result.then((data) => {
            console.log('_modalService data : ', data);
            if (data) {
                this.ngOnInit();
            }
        }).catch((error) => {
            console.log(error);
            // this._appService.notify('Failed to perform operation.', 'Error!');
        });
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
}
