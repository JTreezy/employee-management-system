USE hrtracking_db;

INSERT INTO department (name)
VALUES ("Corporate"),
       ("Branch Office");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", "600000.00", 1),
       ("Executive", "400000.00", 1),
       ("Manager", "300000.00", 1),
       ("Employee", "50000.00", 2),
       ("Intern", "30000.00", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("George", "Harrison", 1, null),
       ("Maria", "Garcia", 2, 1),
       ("Mary", "Smith", 3, 2),
       ("Thomas", "Clark", 4, 3),
       ("Bruce", "Warren", 5, 4);