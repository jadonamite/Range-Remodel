// src/utils/validation.js

/**
 * Validate if a password meets the criteria (minimum 8 characters)
 * @param {string} password
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
   return typeof password === "string" && password.length >= 8;
};

/**
 * Basic validation for a seed phrase (checks for 12 or 24 words)
 * @param {string} seedPhrase
 * @returns {boolean}
 */
export const isValidSeedPhrase = (seedPhrase) => {
   if (!seedPhrase) return false;
   const words = seedPhrase.trim().split(/\s+/);
   return words.length === 12 || words.length === 24;
};

/**
 * Basic validation for a private key (length check)
 * @param {string} privateKey
 * @returns {boolean}
 */
export const isValidPrivateKey = (privateKey) => {
   return typeof privateKey === "string" && privateKey.trim().length >= 64;
};
