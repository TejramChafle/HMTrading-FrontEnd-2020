import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
    @Input() message: string;
    @Input() type: string;

    constructor(public _activeModal: NgbActiveModal) { }

    ngOnInit() {
    }

}
