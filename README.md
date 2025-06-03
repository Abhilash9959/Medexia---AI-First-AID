# Aidify - AI-Powered Emergency Medical Response System

Aidify is a comprehensive emergency medical response system that combines real-time health monitoring, intelligent fall detection, and instant emergency services activation. The system is designed to provide immediate assistance during medical emergencies while ensuring critical medical information is readily available to first responders.

## Key Features

- **Intelligent Fall Detection**: Advanced algorithms detect falls and automatically trigger emergency response
- **Real-time Health Monitoring**: Track vital signs and health metrics with visual indicators
- **Voice Command System**: Hands-free operation for users with mobility limitations
- **QR-based Medical Information**: Instant access to critical patient data for first responders
- **Dual Storage Architecture**: Local and cloud storage for reliable data access
- **Emergency Services Integration**: Direct connection to emergency services with location tracking
- **Accessibility Features**: Dark mode, voice commands, and animated health visualizations

## Technologies Used

- **Frontend**: React + TypeScript, Vite, Tailwind CSS
- **State Management**: React Context API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time Features**: WebSocket for health monitoring
- **Location Services**: Geolocation API
- **Voice Recognition**: Web Speech API
- **QR Code Generation**: QRCode.js

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aidify.git
cd aidify
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Setup Supabase:
   - Create a Supabase account at https://supabase.com
   - Create a new project
   - Run the database migrations from `create_emergency_tables.sql`
   - Enable necessary Supabase services (Auth, Storage, Database)

5. Start the development server:
```bash
npm run dev
```

## Core Components

### Emergency Services
- Fall detection and automatic emergency alerts
- Real-time location tracking
- Direct emergency service integration
- SMS notifications to emergency contacts

### Medical Information Management
- Secure storage of medical history
- QR code generation for instant access
- Offline capability through dual storage
- Emergency contact management

### Health Monitoring
- Real-time vital signs tracking
- Visual health indicators
- Historical data analysis
- Customizable health metrics

### Accessibility Features
- Voice command navigation
- Dark mode support
- Responsive design
- Screen reader compatibility

## Database Schema

The application uses several tables in Supabase:

### medical_info
- User medical history
- Emergency contacts
- Allergies and medications
- Chronic conditions

### emergency_logs
- Emergency event records
- Response times
- Location data
- Contact notifications

### user_profiles
- User preferences
- Accessibility settings
- Notification preferences
- Device information

## Security Features

- End-to-end encryption for medical data
- Secure authentication with Supabase
- Role-based access control
- Regular security audits
- GDPR compliance

## Performance Optimizations

- Local QR code generation
- Cached medical information
- Optimized database queries
- Efficient state management
- Progressive web app capabilities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- React and TypeScript communities
- Supabase team
- All contributors and users of the project
