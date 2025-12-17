# PetCare App

## Overview
PetCare is a React Native application designed to help users manage and interact with pet-related information. The app provides features such as viewing pet listings, accessing detailed pet information, and adjusting user settings.

## Project Structure
```
petcare-app
├──src/
│   ├── view/             # Interface do usuário
│   │   ├── components/   # Componentes reutilizáveis
│   │   └── screens/      # Telas
│   ├── viewmodel/        # ViewModels (estado e comandos da UI)
│   ├── usecase/          # Casos de uso (regras de negócio)
│   ├── model/            # Domínio
│   │   ├── entities/     # Entidades (User, Appointment)
│   │   ├── repositories/
│   │   ├── services/     # Interfaces de serviços
│   │   │   └── supabase/
│   │   └── errors/       # Erros de domínio
│   ├── infra/            # Implementações concretas
│   │   ├── repostories/  # Firebase Auth + Firestore
│   │   └── services/     # Expo Notifications
│   ├── navigation/
│   └── di/               # Injeção de dependências
├── package.json
├── tsconfig.json
├── app.json
└── README.md
```

## Installation
To get started with the PetCare app, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd petcare-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Running the App
To run the app on your device or emulator, use the following command:
```
npm start
```
Follow the instructions in the terminal to launch the app.

## Features
- **Home Screen**: Displays a list of pets and navigation options.
- **Pet Details Screen**: Shows detailed information about a selected pet.
- **Settings Screen**: Allows users to adjust app settings and preferences.
- **Reusable Components**: Includes components like PetCard, Header, and Footer for a consistent UI.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.