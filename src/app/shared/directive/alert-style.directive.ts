import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: '[appAlertStyle]',
})
export class AlertStyleDirective implements AfterViewInit {
  @Input() action: string;

  constructor(private elementRef: ElementRef) {}
  ngAfterViewInit() {
    if (this.action.includes('Added')) {
      this.elementRef.nativeElement.style.backgroundColor = 'green';
    } else if (this.action.includes('Updated')) {
      this.elementRef.nativeElement.style.backgroundColor = 'lightblue';
    } else if (this.action.includes('Deleted')) {
      this.elementRef.nativeElement.style.backgroundColor = 'red';
    }
  }
}
