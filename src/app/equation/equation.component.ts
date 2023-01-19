import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { delay, filter, scan } from 'rxjs';
import { MathValidators } from '../math-validators';

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.scss']
})
export class EquationComponent implements OnInit {

  secondsPerSolution= 0;

  mathForm= new FormGroup({
    a: new FormControl(this.randomNumber()),
    b: new FormControl(this.randomNumber()),
    answer: new FormControl('')
  }, [
    // (form: AbstractControl) => {
    //   const {a,b,answer} = form.value;
    //   if(a + b === parseInt(answer)) {
    //     return null;
    //   }
    //   return {addition: true}
    // }
    MathValidators.addition('answer', 'a', 'b')
  ])
  constructor() { }

  ngOnInit(): void {
    this.mathForm.statusChanges.pipe(
      filter((value)=> value === 'VALID'),
      delay(500),
      scan((acc: any)=> {

        return {
          numberSolved: acc.numberSolved + 1,
          startTime: acc.startTime
        }
      }, {numberSolved: 0, startTime: new Date()})
    ).subscribe(({startTime, numberSolved})=> {
      this.secondsPerSolution= (new Date().getTime() - startTime.getTime()) / numberSolved / 1000;

      this.mathForm.setValue({
        a: this.randomNumber(),
        b: this.randomNumber(),
        answer: ''
      })
   
    })
  }

  get a() {
    return this.mathForm.value.a;
  }

  get b() {
    return this.mathForm.value.b;
  }

  randomNumber() {
    return Math.floor(Math.random() * 10)
  }

}
