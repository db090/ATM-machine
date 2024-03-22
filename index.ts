#! /usr/bin/env node

import inquirer from "inquirer";
import { Faker, faker } from "@faker-js/faker";

interface user {
  id: number;
  pin: number;
  name: string;
  accNumber: number;
  balance: number;
}

const createUsers = () => {
  let users: user[] = [];
  for (let i = 0; i <= 5; i++) {
    let user: user = {
      id: i,
      pin: 1000 + i,
      name: faker.person.fullName(),
      accNumber: Math.floor(100000000 * Math.random() * 900000000),
      balance: 1000000 * i,
    };

    users.push(user);
  }

  return users;
};

const atmMachine = async (users: user[]) => {
  let restart = true;

  do {
    const res = await inquirer.prompt({
      type: "number",
      message: "Write pin code",
      name: "pin",
    });

    const user = users.find((val) => val.pin === res.pin);

    if (user) {
      console.log(`Welcome ${user.name}`);

      await atmFunc(user);

      const restartPrompt = await inquirer.prompt({
        type: "confirm",
        name: "restart",
        message: "Do you want to perform another transaction?",
        default: true,
      });

      restart = restartPrompt.restart;
    } else {
      console.log("Invalid user");
      restart = false;
    }
  } while (restart);
};

const atmFunc = async (user: user) => {
  const ans = await inquirer.prompt({
    type: "list",
    name: "select",
    choices: ["withdraw", "deposit", "balance", "exit"],
    message: "Choose one option from these 4 options",
  });

  switch (ans.select) {
    case "withdraw":
      const amount = await inquirer.prompt({
        type: "number",
        message: "Enter amount",
        name: "rupees",
      });

      if (amount.rupees > user.balance) {
        console.log("Insufficient balance");
        break;
      }
      if (amount.rupees > 2500) {
        console.log("Please enter a smaller amount");
        break;
      }
      console.log(`Withdraw amount = ${amount.rupees}`);
      console.log(`Total balance left = ${user.balance - amount.rupees}`);
      break;

    case "deposit":
      const depositAmount = await inquirer.prompt({
        type: "number",
        message: "Enter the amount you want to deposit",
        name: "depRupees",
      });
      console.log(
        `${depositAmount.depRupees} rupees has been deposited into your account`
      );
      console.log(`Total balance = ${user.balance + depositAmount.depRupees}`);
      break;

    case "balance":
      console.log(`Balance = ${user.balance}`);
      break;

    case "exit":
      console.log("Thank you for using this ATM");
      break;

    default:
      console.log("Invalid option");
  }
};

const users = createUsers();
atmMachine(users);
