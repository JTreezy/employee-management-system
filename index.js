const inquirer = require('inquirer');
const cTable = require('console.table');
const server = require("./db/server.js");

const choices = [
    'View all departments', 
    'View all roles', 
    'View all employees', 
    'Add a department', 
    'Add a role', 
    'Add an employee', 
    'Update an employee role', 
    'Exit'
  ]

function start() {
  inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      choices: choices,
      name: 'main',
    }
  ])
  .then((data) => {
      switch(data.main) {
            case choices[0]:
                viewAllDepartments();
                break;
            case choices[1]:
                viewAllRoles();
                break;
            case choices[2]:
                viewAllEmployees();
                break;
            case choices[3]:
                addDepartment();
                break;
            case choices[4]:
                addRole();
                break;
            case choices[5]:
                addEmployee();
                break;
            case choices[6]:
                changeRole();
                break;
            case choices[7]:
                console.log("Thank you for using the employee management system. Stay well and stay hydrated.");
                break;
      }
  });
}

//Function to view all departments
function viewAllDepartments() {
    let query = "Select id AS ID, name AS Department FROM department ORDER BY id";
    server.query(query, (err, res) => {
        if (err) {
            console.log('Error loading departments');
            start();
        } else {
            console.table('\n', res, '====================\n');
            start();
        }
    });
}

function viewAllRoles() {
    let query = `
    SELECT role.id AS ID, title AS Role, salary AS Salary, department.name AS Department
    FROM role JOIN department ON role.department_id = department.id
    ORDER BY role.id`;

    server.query(query, (err, res) => {
        if (err) {
            console.log('Error loading roles');
            start();
        } else {
            console.table('\n', res, '====================\n');
            start();
        }
    })
}

function viewAllEmployees() {
    let query = `
    SELECT employee.id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, title AS Role, salary AS Salary, department.name AS Department, manager.first_name AS Manager_First, manager.last_name AS Manager_Last
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    ORDER BY employee.id`;

    server.query(query, (err, res) => {
        if (err) {
            console.log('Error loading roles');
            start();
        } else {
            console.table('\n', res, '====================\n');
            start();
        }
    })
}

function addDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'newDepartment',
        message: 'Please add department name'
    }]).then(function(res) {
        server.query('INSERT INTO department SET ?', {
            name: res.newDepartment,
        })
        const newDeptQuery = 'Select * FROM department';
        server.query(newDeptQuery, function(err, res) {
            if (err) throw (err);
            console.table('Department List:', res);
            start();
        })
    })
}

function addRole() {
    let departmentQuery = "SELECT * FROM department";
    server.query(departmentQuery, (err, res) => {
        if (err) {
            console.log("Error loading departments, cannot create role");
            start();
        } else{
            const departmentChoices = [];
            const departmentIdNums = [];

            for (let i = 0; i < res.length; i++) {
                departmentChoices.push(res[i].name);
                departmentIdNums.push(res[i].id);
            }
            inquirer.prompt([
                {
                    message: 'What is the title of the role?',
                    type: 'input',
                    name: 'role',
                },
                {
                    message: 'What is the salary of the role?',
                    type: 'input',
                    name: 'salary',
                },
                {
                    message: 'What department does this role go into?',
                    choices: departmentChoices,
                    type: 'list',
                    name: 'department',
                }
            ]).then(function (response) {
                let { role, salary, department } = response;

                let departmentId;

                for (let i = 0; i < departmentChoices.length; i++) {
                    if (department === departmentChoices[i]) {
                        departmentId = departmentIdNums[i];
                    };
                };
                let query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

                server.query(query, [role, salary, departmentId], (err, res) => {
                    if (err) {
                        console.log('ERROR CREATING THE ROLE');
                        start();
                    } else {
                        console.log(`${role} has been added to roles!`);
                        start();
                    }
                })

            })
        }

    })
}

function addEmployee() {
    let roleQuery = `SELECT * FROM role`;
    server.query(roleQuery, (err, res) => {
        if (err) {
            console.log('Error loading roles, unable to add employee')
            start();
        } else {
            const roleChoices = [];
            const roleIdNums = [];

            for (let i = 0; i < res.length; i++) {
                roleChoices.push(res[i].title);
                roleIdNums.push(res[i].id);
            }

            let employeeQuery = `SELECT * FROM employee`;

            server.query(employeeQuery, (err, res) => {
                if (err) {
                    console.log('Error loading employees, unable to add new employee');
                    start();
                } else {
                    const managerChoices = [];
                    const managerIdNums = [];

                    for (let i = 0; i < res.length; i++) {
                        managerChoices.push(`${res[i].first_name} ${res[i].last_name}`);
                        managerIdNums.push(res[i].id);
                    }

                    managerChoices.push('This employee does not have a manager.')

                    inquirer.prompt([
                        {
                            message: `What is the new employee's first name?`,
                            type: 'input',
                            name: 'firstName',
                        },
                        {
                            message: `What is the new employee's last name?`,
                            type: 'input',
                            name: 'lastName',
                        },
                        {
                            message: `What is the new employee's role?`,
                            choices: roleChoices,
                            type: 'list',
                            name: 'role',
                        },
                        {
                            message: `Who is the new employee's manager?`,
                            choices: managerChoices,
                            type: 'list',
                            name: 'manager',
                        }
                    ]).then(function (response) {
                        let { firstName, lastName, role, manager } = response;

                        let roleId;
                        let managerId;

                        for (let i = 0; i < roleChoices.length; i++) {
                            if (role === roleChoices[i]) {
                                roleId = roleIdNums[i];
                            };
                        }

                        for (let i = 0; i < managerChoices.length; i++) {
                            if (manager === managerChoices[i]) {
                                managerId = managerIdNums[i];
                            };
                        }

                        let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                        server.query(query, [firstName, lastName, roleId, managerId], (err, res) => {
                            if (err) {
                                console.log(`Error adding employee`);
                                start();
                            } else {
                                console.log(`${firstName} ${lastName} has been added to the database.`);
                                start();
                            }
                        })
                    })
                }
            })
        }
    })
}

function changeRole() {
    let roleQuery = `SELECT * FROM role`;

    server.query(roleQuery, (err, res) => {
        if (err) {
            console.log('Error loading roles, unable to update');
            start();
        } else {
            const roleChoices = [];
            const roleIdNums = [];

            for (let i = 0; i < res.length; i++) {
                roleChoices.push(res[i].title);
                roleIdNums.push(res[i].id);
            }

            let employeeQuery = `SELECT * FROM employee`;

            server.query(employeeQuery, (err, res) => {
                if (err) {
                    console.log('Error loading employees, unable to update');
                    start();
                } else {
                    const employeeChoices = [];
                    const employeeIdNums = [];

                    for (let i = 0; i < res.length; i++) {
                        employeeChoices.push(`${res[i].first_name} ${res[i].last_name}`);
                        employeeIdNums.push(res[i].id);
                    }

                    inquirer.prompt([
                        {
                            message: `Which employee would you like to update?`,
                            choices: employeeChoices,
                            type: 'list',
                            name: 'employee',
                        },
                        {
                            message: `What is the new employee's role?`,
                            choices: roleChoices,
                            type: 'list',
                            name: 'newRole',
                        },
                    ]).then(function (response) {
                        let { employee, newRole } = response;

                        let employeeId;
                        let roleId;

                        for (let i = 0; i < employeeChoices.length; i++) {
                            if (employee === employeeChoices[i]) {
                                employeeId = employeeIdNums[i];
                            }

                            if (newRole === roleChoices[i]) {
                                roleId = roleIdNums[i];
                            };
                        }
                        let query = `UPDATE employee SET role_id = ? WHERE id = ?`
                        server.query(query, [roleId, employeeId], (err, res) => {
                            if (err) {
                                console.log(`Error adding employee`);
                                start();
                            } else {
                                console.log(`Employee has been updated.`);
                                start();
                            }
                        })
                    })
                }
            })
        }
    })
}


start();