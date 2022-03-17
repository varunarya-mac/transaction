import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: '[appAlertStyle]',
})
export class AlertStyleDirective implements AfterViewInit {
  @Input() action: string;

  constructor(private elementRef: ElementRef) {}
  ngOnInit() {
    console.log('input-box keys  : ', this.action);
  }
  ngAfterViewInit() {
    console.log('input-box keys  : ', this.action);
    if (this.action.includes('Added')) {
      // this.elementRef.nativeElement.style.background
      this.elementRef.nativeElement.style.backgroundColor = 'green';
    } else if (this.action.includes('Updated')) {
      // this.elementRef.nativeElement.style.background
      this.elementRef.nativeElement.style.backgroundColor = 'lightblue';
    } else if (this.action.includes('Deleted')) {
      // this.elementRef.nativeElement.style.background
      this.elementRef.nativeElement.style.backgroundColor = 'red';
    }
  }
}
