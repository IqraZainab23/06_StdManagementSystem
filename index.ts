#!/usr/bin/env node

import inquirer from 'inquirer'
import chalk from 'chalk'

console.log(chalk.blueBright('Welcome to the Student Management System'))

class Course {
  constructor(public name: string, public cost: number) {}
}

class Student {
  private static studentCounter: number = 10001;
  public id: number;
  public name: string;
  public courses: Course[] = [];
  public balance: number = 0;

  constructor(name: string) {
    this.id = Student.studentCounter++;
    this.name = name;
  }

  enroll(course: Course): void {
    this.courses.push(course);
    this.balance += course.cost;
  }

  viewBalance(): void {
    console.log(chalk.green(`Balance for ${this.name}: $${this.balance}`));
  }

  payTuition(amount: number): void {
    if (amount <= this.balance) {
      this.balance -= amount;
      console.log(chalk.green(`Payment of $${amount} received. Remaining balance: $${this.balance}`));
    } else {
      console.log(chalk.green(`Insufficient funds. Balance: $${this.balance}`));
    }
  }

  showStatus(): void {
    console.log(chalk.magentaBright(`Student ID: ${this.id}`));
    console.log(chalk.magentaBright(`Name: ${this.name}`));
    console.log(chalk.magentaBright(`Courses Enrolled:`));
    this.courses.forEach(course => console.log(chalk.magentaBright(` ${course.name}`)));
    console.log(chalk.magentaBright(`Balance: $${this.balance}`));
  }
}

class StudentManagementSystem {
  private students: Student[] = [];
  private courses: Course[] = [
    new Course("Computer", 4500),
    new Course("Science", 6000),
    new Course("Math", 5000)
  ];

  async addStudent(): Promise<void> {
    const answers = await inquirer.prompt([
        {
            type: 'input', 
            name: 'name', 
            message: (chalk.bgCyan('Enter student name:')) 
        }
    ]);
    const newStudent = new Student(answers.name);
    this.students.push(newStudent);
    console.log(chalk.cyan(`Student ${answers.name} added with ID ${newStudent.id}`));
  }

  async enrollStudent(): Promise<void> {
    const studentAnswers = await inquirer.prompt([
        {
            type: 'input', 
            name: 'studentId', 
            message: (chalk.bgCyan('Enter student ID:')) 
        }
    ]);
    const courseAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'courseName', 
        message:(chalk.bgCyan( 'Enter course name:')) }]);

    const student = this.findStudent(Number(studentAnswers.studentId));
    const course = this.findCourse(courseAnswers.courseName);

    if (student && course) {
      student.enroll(course);
      console.log(chalk.cyan(`${student.name} enrolled in ${course.name}`));
    } else {
      console.log(chalk.cyan("Student or course not found."));
    }
  }

  async viewStudentBalance(): Promise<void> {
    const studentAnswers = await inquirer.prompt([
        {
            type: 'input', 
            name: 'studentId', 
            message: (chalk.bgCyan('Enter student ID:' ))
        }
    ]);
    const student = this.findStudent(Number(studentAnswers.studentId));

    if (student) {
      student.viewBalance();
    } else {
      console.log(chalk.cyan("Student not found."));
    }
  }

  async payStudentTuition(): Promise<void> {
    const studentAnswers = await inquirer.prompt([
        {
            type: 'input', 
            name: 'studentId', 
            message: 'Enter student ID:' 
        }
    ]);
    const amountAnswers = await inquirer.prompt([
        {
            type: 'input', 
            name: 'amount', 
            message: 'Enter tuition amount:' }]);

    const student = this.findStudent(Number(studentAnswers.studentId));

    if (student) {
      const amount = parseFloat(amountAnswers.amount);
      student.payTuition(amount);
    } else {
      console.log("Student not found.");
    }
  }

  async showStudentStatus(): Promise<void> {
    const studentAnswers = await inquirer.prompt([
        {
            type: 'input',
            name: 'studentId', 
            message: 'Enter student ID:'
         }
        ]);
    const student = this.findStudent(Number(studentAnswers.studentId));

    if (student) {
      student.showStatus();
    } else {
      console.log(chalk.cyan("Student not found."));
    }
  }

  private findStudent(studentId: number): Student | undefined {
    return this.students.find(student => student.id === studentId);
  }

  private findCourse(courseName: string): Course | undefined {
    return this.courses.find(course => course.name === courseName);
  }
}

async function main() {
  const sms = new StudentManagementSystem();

  while (true) {
    const action = await inquirer.prompt([
      {
        type: 'list', 
        name: 'action', 
        message: 'Choose an action:', 
        choices: ['Add Student', 'Enroll Student', 'View Balance', 'Pay Tuition', 'Show Status', 'Exit']
      }
    ]);

    switch (action.action) {
      case 'Add Student':
        await sms.addStudent();
        break;
      case 'Enroll Student':
        await sms.enrollStudent();
        break;
      case 'View Balance':
        await sms.viewStudentBalance();
        break;
      case 'Pay Tuition':
        await sms.payStudentTuition();
        break;
      case 'Show Status':
        await sms.showStudentStatus();
        break;
      case 'Exit':
        console.log(chalk.red('Exiting from student management system'));
        process.exit();
    }
  }
}

main();