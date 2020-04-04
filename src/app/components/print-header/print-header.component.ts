import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'print-header',
    templateUrl: './print-header.component.html'
})

export class PrintHeaderComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        console.log('PRINT HEADER');
    }
}
