import { Component, OnInit } from '@angular/core';
import { signal } from '@angular/core';
import { user } from './user.type';
import {
  Field,
  form,
  required,
  min,
  max,
  pattern,
  Schema,
  schema,
  apply,
} from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-forms',
  imports: [Field],
  templateUrl: './forms.html',
})
export class Forms implements OnInit {
  private readonly user = signal<user>({
    fullname: '',
    birthdate: new Date(),
    genre: '',
    identifier: 0,
    newsletter: false,
  });

  schemaUser: Schema<user> = schema((path) => {
    required(path.birthdate, { message: 'Birthdate is required' });
    required(path.identifier, { message: 'Identifier is required' });
    min(path.identifier, 1000, { message: 'Identifier must be at least 1000' });
    max(path.identifier, 9999, { message: 'Identifier must be at most 9999' });

    apply(path.genre, this.schemaText);
    apply(path.fullname, this.schemaText);
    required(path.newsletter, {
      when: ({ valueOf }) => valueOf(path.identifier) > 1000,
      message: 'Newsletter subscription is required',
    });
    // validations
  });

  schemaText: Schema<string> = schema((path) => {
    min(path, 3, { message: 'must be at least 3' });
    max(path, 20, { message: 'must be at most 20' });
    pattern(path, /^[a-zA-Z\s]+$/, {
      message: 'can only contain letters and spaces',
    });
  });

  public readonly form = form(this.user, this.schemaUser);

  ngOnInit(): void {
    this.form().value.set({
      fullname: 'Mauro Bernal',
      birthdate: new Date('1990-01-01'),
      genre: 'M',
      identifier: 1234,
      newsletter: true,
    });
    console.log(this.form().touched(), 'touched');
    console.log(this.form().dirty(), 'dirty');
  }
  onSubmit(event: Event): void {
    event.preventDefault();

    console.log(this.form().touched(), 'touched');
    console.log(this.form().dirty(), 'dirty');
    console.log('is valid?', this.form().valid());
    console.log('erros:', this.form().errors());
  }
}
