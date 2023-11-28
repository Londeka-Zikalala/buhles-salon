-- Add insert scripts here

-- DATA FOR THE CLIENTS TABLE 
INSERT INTO client (first_name,last_name,phone_number) VALUES ('Thando', 'Nkosi', '071 165 1891');
INSERT INTO client (first_name,last_name,phone_number) VALUES ('Martha', 'Nkosi', '072 175 2892');
INSERT INTO client (first_name,last_name,phone_number) VALUES ('Thembi', 'Xulu', '073 185 3893');
INSERT INTO client (first_name,last_name,phone_number) VALUES ('Xoli', 'Mgwenya', '071 195 4894');
INSERT INTO client (first_name,last_name,phone_number) VALUES ('Thabile', 'Mondlana', '071 105 5895');
INSERT INTO client (first_name,last_name,phone_number) VALUES ('Senamile', 'Shongwe', '071 115 6896');
INSERT INTO client (first_name,last_name,phone_number) VALUES ('Sendzile', 'Tsabetse', '071 125 7897');

-- DATA FOR THE STYLISTS TABLE 
INSERT INTO stylist (first_name,last_name,phone_number, commission_percentage) VALUES ('Thabo', 'Khoza', '073 225 2388', 0.09);
INSERT INTO stylist (first_name,last_name,phone_number, commission_percentage) VALUES ('Sam', 'Jennings', '073 125 2388', 0.15);
INSERT INTO stylist (first_name,last_name,phone_number, commission_percentage) VALUES ('Natasha', 'Romanoff', '073 025 2388', 0.18);



-- DATA FOR THE TREATMENTS TABLE
INSERT INTO treatment (type, code, price ) VALUES ('pedicures', 111, 175);
INSERT INTO treatment (type,code, price) VALUES ('manicures', 222, 215);
INSERT INTO treatment (type,code, price) VALUES ('make_up', 333, 185);
INSERT INTO treatment (type,code, price) VALUES ('brow_and_lashes',444, 240);
