// hash-password.mjs
import bcrypt from 'bcrypt';

const password = 'eedc_admin'; // Changez ceci par votre mot de passe
const hash = await bcrypt.hash(password, 10);
console.log('Mot de passe:', password);
console.log('Hash:', hash);