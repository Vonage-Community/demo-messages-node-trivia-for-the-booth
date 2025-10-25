#!/usr/bin/env node
import { getUserByEmail } from '../service/users/getUserByEmail.js';
import { resetPassword } from '../service/users/resetPassword.js';
import inquirer from 'inquirer';

async function main() {
  try {
    console.log('\n🔐 User Password Reset\n---------------------');

    // Step 1: Prompt for email
    const { email } = await inquirer.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Enter user email:',
        validate: (value) => {
          if (!value || !value.includes('@')) return 'Please enter a valid email address.';
          return true;
        },
        filter: (val) => val.trim().toLowerCase(),
      },
    ]);

    const user = getUserByEmail(email);

    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.name} (${user.email})`);

    let passOk = false;
    let pass;

    do {
      const { newPassword, confirmPassword } = await inquirer.prompt([
        {
          type: 'password',
          name: 'newPassword',
          message: 'Enter new password:',
          mask: '*',
        },
        {
          type: 'password',
          name: 'confirmPassword',
          message: 'Confirm new password:',
          mask: '*',
        },
      ]);

      passOk = newPassword === confirmPassword;
      if (!passOk) {
        console.error(`❌ Passwords do not match`);
      }
      pass = newPassword;
    } while(!passOk)


    resetPassword({id: user.id, password: pass})

    console.log('✅ Password successfully updated.');
  } catch (err) {
    console.error('⚠️ Error:', err.message);
  }
}

main();






