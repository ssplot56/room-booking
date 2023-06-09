import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Layout, LayoutCapacity, Room} from "../../../model/Room";
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {DataService} from "../../../data.service";
import {Router} from "@angular/router";
import {FormResetService} from "../../../form-reset.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.css']
})
export class RoomEditComponent implements OnInit, OnDestroy {
  @Input()
  room: Room;

  layouts= Object.keys(Layout);
  layoutEnum = Layout;

  roomForm: FormGroup;

  resetEventSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private dataService: DataService,
              private router: Router,
              private formResetService: FormResetService) {
  }

  ngOnDestroy(): void {
    this.resetEventSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.formResetService.resetRoomFormEvent.subscribe(
      room => {
        this.room = room;
        this.initializeForm();
      }
    )
  }

  initializeForm() {
    this.roomForm = this.formBuilder.group(
      {
        roomName: [this.room.name, Validators.required],
        location: [this.room.location, [Validators.required, Validators.minLength(2)]]
      }
    )

    for (const layout of this.layouts) {
      const layoutCapacity
        // @ts-ignore
        = this.room.capacities.find(lc => lc.layout === Layout[layout]);
      const initialCapacity = layoutCapacity == null? 0 : layoutCapacity.capacity;
      this.roomForm.addControl(`layout${layout}`, this.formBuilder.control(initialCapacity))
    }
  }

  onSubmit() {
    // @ts-ignore
    this.room.name = this.roomForm.controls['roomName'].value;
    // @ts-ignore
    this.room.location = this.roomForm.controls['location'].value;
    this.room.capacities = new Array<LayoutCapacity>();
    for (const layout of this.layouts) {
      const layoutCapacity = new LayoutCapacity();
      layoutCapacity.layout = (Layout as any)[layout];
      // @ts-ignore
      layoutCapacity.capacity = this.roomForm.controls[`layout${layout}`].value;
      this.room.capacities.push(layoutCapacity);
    }

    if (this.room.id == null) {
      this.dataService.addRoom(this.room).subscribe(
        next => {
          this.router.navigate(['admin', 'rooms'], {queryParams : {action : 'view', id : next.id}});
        }
      )
    } else {
      this.dataService.updateRoom(this.room).subscribe(
        next =>
          this.router.navigate(['admin', 'rooms'], {queryParams : {action : 'view', id : next.id}}));
    }
  }
}
