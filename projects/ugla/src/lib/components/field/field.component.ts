import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Form} from '../../enum';
import { UglaService } from '../../ugla.service';

/**
 * Field
 *
 * @example
 * <ugl-field
 *   [type]="'text'"
 *   [name]="'text'"
 *   [label]="'E-mail'"
 *   [message]="'Input type email'"
 *   [maxLength]="200"
 *   [value]="value"
 *   [disabled]="true"
 *   [multiple]="true"
 *   [required]="true"></ugl-field>
 */
@Component({
  selector: 'ugl-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  /**
   * Types: text, number, email, search, password, tel, url, time, datetime-local, month, week, file
   *
   * For type date, use another component: [DatepickerComponent](/components/DatepickerComponent.html)
   *
   * Default: text
   */
  @Input() type: string;

  /**
   * Input name. It's use on id too
   */
  @Input() name: string;

  /**
   * Set label
   */
  @Input() label: string;

  /**
   * Set initial value
   */
  @Input() set value(val: string) {
    this._value = val;
  }

  get value() {
    return this._value;
  }

  private _value: string;

  /**
   * Set limit characters.
   *
   * If set, show count
   *
   * Default: 1000
   */
  @Input() maxLength: number;

  /**
   * Set min value (for type number or date)
   */
  @Input() min: string;

  /**
   * Set max value (for type number or date)
   */
  @Input() max: string;

  /**
   * Set message
   */
  @Input() set message(value: string) {
    this._message = value;
    this.originalMessage = value;
  }

  /**
   * Get message
   */
  get message(): string {
    return this._message;
  }

  /**
   * Intenal property for message
   */
  private _message: string;

  /**
   * Is disabled?
   *
   * Default: false
   */
  @Input() disabled: boolean;

  /**
   * Is required
   *
   * Default: false
   */
  @Input() required: boolean;

  /**
   * Is multiple file
   *
   * Use only type file
   *
   * Default: false
   *
   */
  @Input() multiple: boolean;

  /**
   * Is invalid
   *
   * Default: false
   */
  @Input() set invalid(value: boolean) {
    this._invalid = value;
  }

  get invalid() {
    return this._invalid;
  }

  private _invalid: boolean;

  /**
   * Message for invalid selection
   *
   * Default: Form.REQUIRED
   */
  @Input() messageRequired: string;

  /**
   * This property show the counter
   *
   * Default: false
   */
  @Input() counter = false;

  /**
   * Allow set field readonly
   * Use as needed to assure a disabled look and feel, but still readable by accessibility's screen readers.
   * Default:  false
   */
  @Input() readonly: boolean;

  /**
   * Allowing decimal values in number input type:
   * If true: Any number is an acceptable value, as long as it is a valid floating point number;
   * If false: only integer numbers are acceptable;
   *
   * Valid only for input type=number
   * Default: true;
   */
  @Input() allowDecimal: boolean;

  /**
   * @ignore
   */
  public num: number;

  /**
   * @ignore
   */
  public charCounter: string;

  /**
   * List classes
   */
  public groupClass: string;

  /**
   * Original message
   */
  public originalMessage: string;

  /**
   * Event emitter to value changes
   */
  @Output() onChangeValue = new EventEmitter<string>();

  validateEmail: boolean;

  /**
   * Classes of the component
   */
  public classes: string;

  /**
   * @ignore
   */
  private theme: string;

  /**
   * @ignore
   */
  constructor(private ugla: UglaService) {
    this.theme = ugla.theme;
  }

  /**
   * Event keyup input
   * @param event
   */
  keyupHandler(event) {
    const val = event.currentTarget.value;
    if (this.type === 'number' && val !== '') {
      if (this.min && Number(val) < Number(this.min)) {
        event.currentTarget.value = '';
      }
      if (this.max && Number(val) > Number(this.max)) {
        event.currentTarget.value = '';
      }
    }
    this.num = event.currentTarget.value.length;
    this.charCounter = `${this.num}/${this.maxLength}`;
    this.focusoutHandler(event);
  }

  /**
   * Event on change input
   * @param event
   */
  changeHandler(event) {
    this.value = event.currentTarget.value;
    this.focusoutHandler(event);
    this.onChangeValue.emit(event.currentTarget.value);
  }

  /**
   * Event focus out
   * @param event
   */
  focusoutHandler(event) {
    const val = event.currentTarget.value;

    if (event.currentTarget.hasAttribute('required') && val === '') {
      this._message = this.messageRequired;

      event.currentTarget.classList.remove('valid');
      event.currentTarget.classList.add('invalid');
    } else {
      if (!this.invalid) {
        event.currentTarget.classList.remove('invalid');
      }
      this._message = this.originalMessage;
    }
  }

  /**
   * Set initials configurations
   */
  ngOnInit() {
    this.type = this.type === undefined ? 'text' : this.type;
    this.counter = this.counter === undefined ? false : this.counter;
    this.originalMessage = this.message;
    this.num = 0;
    this.charCounter = (this.maxLength !== undefined) ? `${this.num}/${this.maxLength}` : ' ';
    this.multiple = this.multiple === undefined ? false : this.multiple;
    this.disabled = (this.disabled !== undefined) ? this.disabled : false;
    this.readonly = (this.readonly !== undefined) ? this.readonly : false;
    this.value = (this.value !== undefined) ? this.value : '';
    this.invalid = (this.invalid !== undefined) ? this.invalid : false;
    this.messageRequired = (this.messageRequired !== undefined) ? this.messageRequired : Form.REQUIRED;
    this.min = (this.min !== undefined) ? this.min : '';
    this.max = (this.max !== undefined) ? this.max : '';
    this.maxLength = (this.maxLength !== undefined) ? this.maxLength : 1000;
    this.allowDecimal = (this.allowDecimal !== undefined) ? this.allowDecimal : true;
    this.classes = `${this.theme}`;
  }

  inputValidation(event: any) {
    if (this.type === 'number' && !this.allowDecimal) {
      this.removeDecimal(event);
    }
  }

  private removeDecimal(event: any) {
    event.target.value = parseInt(event.target.value, 10) || '';
  }
}
