INSERT INTO todos (name, description, priority, due_date, done, created_date, done_date) VALUES
-- Tasks already completed
('Update frontend libraries', 'Update React, TypeScript, and other frontend dependencies to their latest versions', 'MEDIUM', '2025-07-10', true, '2025-07-01 09:30:00', '2025-07-09 16:45:12'),
('Fix login page validation', 'Implement proper form validation on the login page and handle error messages', 'HIGH', '2025-07-12', true, '2025-07-05 11:20:00', '2025-07-11 14:32:08'),
('Add unit tests for API endpoints', 'Create comprehensive test coverage for all REST endpoints in the backend', 'HIGH', '2025-07-15', true, '2025-07-03 10:15:00', '2025-07-14 17:10:45'),
('Update database schema', 'Add new columns for tracking task modifications and user assignment', 'MEDIUM', '2025-07-08', true, '2025-07-02 14:20:00', '2025-07-07 11:25:33'),
('Create UI mockups for mobile app', 'Design mockups for the upcoming mobile application version', 'LOW', '2025-07-16', true, '2025-07-06 15:45:00', '2025-07-15 09:12:56'),

-- Tasks due soon (within a week)
('Implement dark mode theme', 'Add dark mode support to the entire application with toggle functionality', 'MEDIUM', '2025-07-22', false, '2025-07-12 13:30:00', NULL),
('Optimize API response time', 'Improve backend performance for list endpoints by implementing pagination and caching', 'HIGH', '2025-07-23', false, '2025-07-14 09:20:00', NULL),
('Setup CI/CD pipeline', 'Configure Jenkins for automated testing and deployment workflows', 'HIGH', '2025-07-24', false, '2025-07-16 11:45:00', NULL),
('Refactor authentication service', 'Implement JWT-based authentication and improve security measures', 'HIGH', '2025-07-25', false, '2025-07-15 14:10:00', NULL),
('Create user management dashboard', 'Implement admin panel for user role management and permissions', 'MEDIUM', '2025-07-26', false, '2025-07-17 10:30:00', NULL),

-- Tasks due in the medium term
('Implement data export feature', 'Add functionality to export task data to CSV and PDF formats', 'MEDIUM', '2025-08-02', false, '2025-07-18 09:15:00', NULL),
('Add internationalization support', 'Implement i18n with English and Spanish language options', 'LOW', '2025-08-05', false, '2025-07-16 16:20:00', NULL),
('Integrate with calendar API', 'Connect with Google Calendar API for task synchronization', 'MEDIUM', '2025-08-10', false, '2025-07-17 13:40:00', NULL),
('Create comprehensive documentation', 'Document API endpoints, component usage, and deployment processes', 'LOW', '2025-08-15', false, '2025-07-15 11:30:00', NULL),
('Implement custom reporting module', 'Create a dashboard for generating custom task reports and statistics', 'MEDIUM', '2025-08-18', false, '2025-07-18 15:25:00', NULL),

-- Long-term tasks
('Migrate to microservices architecture', 'Plan and implement migration from monolith to microservices', 'HIGH', '2025-09-15', false, '2025-07-10 10:00:00', NULL),
('Implement real-time notifications', 'Add WebSocket support for real-time task updates and notifications', 'MEDIUM', '2025-09-01', false, '2025-07-12 14:50:00', NULL),
('Create mobile application version', 'Develop React Native mobile app with core functionality', 'HIGH', '2025-10-01', false, '2025-07-14 09:00:00', NULL),
('Implement machine learning suggestions', 'Add ML-based task prioritization and time estimation features', 'LOW', '2025-10-15', false, '2025-07-16 11:20:00', NULL),
('Setup analytics dashboard', 'Integrate application with analytics tools and create custom dashboard', 'LOW', '2025-09-20', false, '2025-07-17 16:15:00', NULL);
