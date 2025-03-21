# Range Wallet Project Structure

src/
├── components/
│ ├── common/
│ │ ├── Button.jsx
│ │ ├── Input.jsx
│ │ ├── Loading.jsx
│ │ ├── Modal.jsx
│ │ └── SeedPhraseInput.jsx
│ ├── layout/
│ │ └── Layout.jsx
│ ├── modals/
│ │ ├── CreateWalletFlow/
│ │ │ ├── CreatePassword.jsx
│ │ │ ├── BackupSeedPhrase.jsx
│ │ │ └── ConfirmBackup.jsx
│ │ ├── ImportWalletFlow/
│ │ │ ├── ImportChoice.jsx
│ │ │ ├── ImportSeedPhrase.jsx
│ │ │ ├── ImportPrivateKey.jsx
│ │ │ └── SetPassword.jsx
│ │ └── Login.jsx
│ └── wallet/
│ ├── Dashboard.jsx
│ ├── Assets.jsx
│ └── Transactions.jsx
├── context/
│ └── WalletContext.jsx
├── styles/
│ ├── global.css
│ └── tailwind.css
├── utils/
│ ├── validation.js
│ └── helpers.js
├── App.jsx
└── index.jsx
