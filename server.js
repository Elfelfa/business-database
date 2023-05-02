const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'business_db'
    },
    console.log(`Connected to the Black Mesa database. Welcome.`)
);

function init() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'mainSelection',
                message: 'Welcome! Please select an option:',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit'],
            }
        ])
        .then((response) => {
            switch (response.mainSelection) {
                case 'View all departments':
                    printData('SELECT * FROM departments');
                    break;
                case 'View all roles':
                    printData('SELECT * FROM roles');
                    break;
                case 'View all employees':
                    printData('SELECT * FROM employees');
                    break;
                case 'Add a department':
                    var query = '';

                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'deptName',
                                message: 'Please enter the name of the new department:',
                            }
                        ])
                        .then((response) => {
                            query = `INSERT INTO departments (name) VALUES ("${response.deptName}")`;
                            printData(query);
                        });
                    break;
                case 'Add a role':
                    var query = '';

                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'roleName',
                                message: 'Please enter the name of the new role:',
                            },
                            {
                                type: 'input',
                                name: 'salary',
                                message: 'Please enter the salary of the role:',
                            },
                            {
                                type: 'input',
                                name: 'deptID',
                                message: 'Please enter the ID of the department this role belongs to:',
                            }
                        ])
                        .then((response) => {
                            query = `INSERT INTO roles (title, salary, department_id) VALUES ("${response.roleName}", ${response.salary}, ${response.deptID})`;
                            printData(query);
                        });
                    break;
                case 'Add an employee':
                    var query = '';

                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'fName',
                                message: 'Please enter employees first name:',
                            },
                            {
                                type: 'input',
                                name: 'lName',
                                message: 'Please enter employees last name:',
                            },
                            {
                                type: 'input',
                                name: 'rID',
                                message: 'Please enter employees role id:',
                            },
                            {
                                type: 'input',
                                name: 'mID',
                                message: 'Please enter the ID of this employees manager. If the employee has no manager leave blank or enter NULL:',
                            },
                        ])
                        .then((response) => {
                            if (response.mID === '') {
                                query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${response.fName}", "${response.lName}", ${response.rID}, NULL)`;
                            }
                            else {
                                query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${response.fName}", "${response.lName}", ${response.rID}, ${response.mID})`;
                            }
                            printData(query);
                        });
                    break;
                case 'Update an employee role':
                    var query = '';

                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'eID',
                                message: 'Please enter the employee ID:',
                            },
                            {
                                type: 'input',
                                name: 'newRole',
                                message: 'Please enter the employees new role ID:',
                            }
                        ])
                        .then((response) => {
                            query = `UPDATE employees SET role_id = ${response.newRole}, manager_id = NULL WHERE id = ${response.eID}`;
                            printData(query);
                        });
                    break;
                case 'Quit':
                    console.log('Goodbye.');
                    break;
            };
        })
};

function printData(query) {
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);
    });
    setTimeout(init, 1000);
}

init();