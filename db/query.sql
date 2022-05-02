USE hrtracking_db;

SELECT * 
FROM employee 
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;

SELECT id AS ID, name AS Department
FROM department;

SELECT role.id AS ID, title AS Role, salary AS Salary, department.name AS Department
FROM role
JOIN department ON role.department_id = department.id;

SELECT *
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id
ORDER BY employee.id;

SELECT *
FROM role;

SELECT *
FROM employee;